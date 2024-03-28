import Stripe from 'stripe'
import express from 'express'
import { responder } from '../middleware/response.js';
import { newOrderValidation } from '../middleware/joiValidation.js';
import { findOrder, getOrders, insertOrder } from '../model/order/OrderModel.js';
import { MongoClient, ObjectId } from 'mongodb';
import { sendEmailReceipt } from '../utils/nodemailer.js';
import { userAuth } from '../middleware/authMiddleWare.js';

let router = express.Router();

const uri = process.env.MONGO_URL;

const client = new MongoClient(uri);

router.post("/", userAuth, async (req, res, next) => {
    try {
        const { amount, currency, paymentMethodType } = req.body

        const strip = new Stripe(process.env.STRIPE_SECRET)

        const paymentIntent = await strip.paymentIntents.create({
            amount: amount * 100,
            currency,
            payment_method_types: [paymentMethodType]
        })

        responder.SUCCESS({
            res,
            status: "success",
            message: "Payment is charged",
            clientSecret: paymentIntent.client_secret
        })
    } catch (error) {
        next(error)
    }
})

router.post("/create-order", newOrderValidation, userAuth, async (req, res, next) => {
    try {
        //claculate Order total
        let subTotal = 0;
        for (const item of req.body.cartItem) {
            subTotal += item.price * item.qty
        }
        subTotal = subTotal.toFixed(2);
        const shippingEstimate = req.body.cartItem.reduce((acc, item) => acc + item.qty, 0) * 0.25 + 15
        const taxRate = 0.02
        const taxEstimate = (subTotal * taxRate).toFixed(2)

        const orderTotal = (parseFloat(subTotal) + parseFloat(taxEstimate) + parseFloat(shippingEstimate)).toFixed(2);

        await client.connect();

        const dbName = client.db('fashon');
        const colName = dbName.collection('products');

        const { userId, fName, lName, address, phone, email, cartItem } = req.body;
        if (!userId || !fName || !lName || !address || !phone || !email || !cartItem || !cartItem.length) {
            return responder.ERROR({
                res,
                errorCode: 400,
                message: "Missing required fields"
            })
        }

        for (const item of cartItem) {
            const { productId, size, price, color } = item;
            const qty = parseInt(item.qty)

            if (!productId || !size || !qty || !color) {
                return responder.ERROR({
                    res,
                    errorCode: 400,
                    message: "Invalid cart item"
                })
            }

            const product = await colName.findOne({ _id: new ObjectId(productId) })

            if (!product) {
                return responder.ERROR({
                    res,
                    errorCode: 404,
                    message: "Product Not Found"
                })
            }

            const colors = product.variations.find(item => item.color === color)
            if (!colors) {
                return responder.ERROR({
                    res,
                    errorCode: 404,
                    message: "This color is not available. Please select the listed color and ty again"
                })
            }

            const sizes = colors.sizes.find(sizeObj => sizeObj.size === size)

            if (product.price !== price && sizes.salesPrice !== price) {
                return responder.ERROR({
                    res,
                    errorCode: 404,
                    message: "Price mismatch detected, order failed. Please try again later!"
                })
            }

            if (!sizes) {
                return responder.ERROR({
                    res,
                    errorCode: 404,
                    message: `Size ${size} not available for this product`
                })
            }
            if (sizes.qty < qty) {
                return responder.ERROR({
                    res,
                    errorCode: 404,
                    message: `Not enough quantity available for size ${size}`
                })
            }

            sizes.qty -= qty


            await colName.updateMany(
                { _id: new ObjectId(productId), 'variations.color': color, 'variations.sizes.size': size },
                { $set: { 'variations.$[outer].sizes.$[inner].qty': sizes.qty } },
                { arrayFilters: [{ 'outer.color': color }, { 'inner.size': size }] }
            )

            // Calculate the total quantity after the product is bought
            const totalQty = product.variations.reduce((acc, variation) => {
                return acc + variation.sizes.reduce((qtyAcc, size) => qtyAcc + size.qty, 0);
            }, 0);

            // Update the totalQty field of the product
            await colName.updateOne(
                { _id: new ObjectId(productId) },
                { $set: { totalQty: totalQty } }
            );

        }
        if (orderTotal !== req.body.orderTotal) {
            return responder.ERROR({
                res,
                errorCode: 400,
                message: "Total Price missed match detected"
            })
        }

        const orderDetail = {
            ...req.body,
            payReceive: {
                subTotal: parseFloat(subTotal),
                shipping: parseFloat(shippingEstimate),
                taxEstimate: parseFloat(taxEstimate),
                orderTotal: parseFloat(orderTotal)
            }
        }

        const order = await insertOrder(orderDetail)

        if (order?._id) {
            sendEmailReceipt({
                email,
                fName,
                cartItem,
                subTotal,
                shippingEstimate,
                taxEstimate,
                orderTotal
            })
        }

        responder.SUCCESS({
            res,
            message: "Payment Successful, your order is on the way.",
            order,
        })

    } catch (error) {
        next(error)
    }
})

router.get("/:_id?", userAuth, async (req, res, next) => {
    try {
        const { _id } = req.params

        const user = req.userInfo;

        const order = _id
            ? await findOrder({_id})
            : await getOrders({userId: user._id});
        
        return responder.SUCCESS({
            res,
            message: "Here are your orders",
            order
        })
       

    } catch (error) {
        next(error)
    }
})

export default router

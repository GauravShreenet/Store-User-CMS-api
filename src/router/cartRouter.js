import express from 'express'
import { deleteAllCartItems, deleteCartItems, getCartItem, insertCartItem, updateCartItem } from '../model/cart/cartModel.js'
import { responder } from '../middleware/response.js'
import { newCartItemValidation } from '../middleware/joiValidation.js'
import { userAuth } from '../middleware/authMiddleWare.js'
import { MongoClient, ObjectId } from 'mongodb'

let router = express.Router()

const uri = process.env.MONGO_URL;
const client = new MongoClient(uri);

router.post("/", newCartItemValidation, userAuth, async (req, res, next) => {
    try {
        await client.connect();

        const dbName = client.db('fashon');
        const colName = dbName.collection('products');

        const { productId } = req.body

        const product = await colName.findOne({ _id: new ObjectId(productId) })

       const instCartItem = await insertCartItem(req.body)
       
       responder.SUCCESS({
        res,
        message: "Your item is added to the cart",
        instCartItem,
       })
    } catch (error) {
        next(error)
    }
})

router.patch("/", userAuth, async (req, res, next) => {
    try {
        const { _id, qty } = req.body

        const result = await updateCartItem({_id}, {qty})
        if (result?._id) {
            responder.SUCCESS({
                res,
            })
        }
        responder.ERROR({
            res,
            message: "Something went wrong. Please try again later!!!"
        })

    } catch (error) {
        next(error)
    }
})

router.delete("/", userAuth, async (req, res, next) => {
    try {
        const { _id } = req.body

        const result = await deleteCartItems({_id})
        if (result?._id) {
            responder.SUCCESS({
                res,
                message: "Item is deleted"
            })
        }
        responder.ERROR({
            res,
            message: "Something went wrong. Please try again later!!!"
        })

    } catch (error) {
        next(error)
    }
})

router.delete("/deleteAll", userAuth, async (req, res, next) => {
    try {
        const { _id } = req.userInfo
        const result = await deleteAllCartItems({ userId: _id })

        if (result?._id) {
            responder.SUCCESS({
                res,
                message: "Payment SuccessFul"
            })
        }
        responder.ERROR({
            res,
            message: "Something went wrong. Please try again later!!!"
        })

    } catch (error) {
        next(error)
    }
})

router.get("/", userAuth, async (req, res, next) => {
    try {
        const { _id } = req.userInfo
        const cartItem = await getCartItem({ userId: _id }) //userId is a filter to get the particular items

        responder.SUCCESS({
            res,
            message: "Here are the cart items",
            cartItem,
        })
    } catch (error) {
        next(error)
    }
})

export default router;
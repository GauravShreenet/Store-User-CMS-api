import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
    status: {
        type: String,
        default: "order placed",
    },
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    fName: {
        type: String,
        required: true,
    },
    lName: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    payReceive: {
        subTotal: {
            type: Number,
            required: true
        },
        shipping: {
            type: Number,
            required: true
        },
        taxEstimate: {
            type: Number,
            required: true
        },
        orderTotal: {
            type: Number,
            required: true
        },
    },
    cartItem: [
        {
            name: {
                type: String,
                required: true,
            },
            productId: {
                type: String,
                required: true,
            },
            slug:{
                type: String,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
            size: {
                type: String,
                required: true,
            },
            color: {
                type: String,
                required: true,
            },
            qty: {
                type: Number,
                required: true,
            },
            thumbnail: {
                type: String,
                required: true,
            },
        }
    ]
},
    {
        timestamps: true
    }
);

export default mongoose.model("Order", orderSchema)
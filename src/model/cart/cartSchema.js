import mongoose from 'mongoose'

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    productId: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
    },
    sku:{
        type: String,
        required: true,
    },
    size:{
        type: String,
        required: true,
    },
    color:{
        type: String,
        required: true,
    },
    qty:{
        type: Number,
        required: true,
    },
    thumbnail:{
        type: String,
        required: true,
    }
},
    {
        timestamps: true
    }
)

export default mongoose.model("Cart", cartSchema)
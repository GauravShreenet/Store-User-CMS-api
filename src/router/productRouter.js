import express from 'express'
import { MongoClient } from 'mongodb'
import { responder } from '../middleware/response.js';

let router = express.Router();

const uri = process.env.MONGO_URL;

const client = new MongoClient(uri);

router.get("/new-arrival", async(req, res, next)=> {
    try {
        await client.connect();

        const dbName = client.db('fashon');
        const colName = dbName.collection('products');

        const newArrive = await colName.find({}).sort({ createdAt: -1 }).limit(12).toArray()

        return responder.SUCCESS({
            res,
            message: "Here are your latest arrival",
            newArrive
        })
    
    } catch (error) {
        next(error)
    }
})

router.get("/:slug?", async(req, res, next) => {
    try {
        await client.connect();

        const dbName = client.db('fashon');
        const colName = dbName.collection('products');

        const { slug } = req.params;

        const products = slug
        ? await colName.findOne({ slug })
        : await colName.find({}).sort({ createdAt: -1 }).toArray()

        return responder.SUCCESS({
            res,
            message: "Here are your products",
            products,
        })
    } catch (error) {
        next(error)
    }
})


export default router;

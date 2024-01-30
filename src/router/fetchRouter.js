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

router.get("/categories", async(req, res, next)=> {
    try {
        await client.connect();

        const dbName = client.db('fashon');
        const colName = dbName.collection('categories')

        const categories = await colName.find({}).toArray()

        return responder.SUCCESS({
            res,
            message: "Here are the Categories",
            categories
        })

    } catch (error) {
        next(error)
    }
})

export default router;

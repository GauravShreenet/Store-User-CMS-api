import express from 'express'
import { MongoClient } from 'mongodb';
import { responder } from '../middleware/response.js';

let router = express.Router();

const uri = process.env.MONGO_URL;

const client = new MongoClient(uri);

router.get("/:slug?", async (req, res, next) => {
    try {
        await client.connect();

        const dbName = client.db('fashon');
        const colName = dbName.collection('categories');
        const products = dbName.collection("products");

        const { slug } = req.params;
        if (slug) {
            //get the id of the category with destracturing
            
            // const  category = await colName.findOne({ slug })
            const  { _id } = await colName.findOne({ slug })

            // const query = { parentCatId: (category._id).toString()}
            const query = { parentCatId: _id.toString()}
            console.log(query)

            const categoryProducts = await products.find(query).sort({ createdAt: -1 }).toArray();
            

            return responder.SUCCESS({
                res,
                message: "Here the products related to the category",
                categoryProducts,
            })
        }
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
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import "dotenv/config";
import { connectDb } from './src/config/configDb.js';


const app = express();

const PORT = process.env.PORT || 8000

connectDb();
app.use(cors());
app.use(express.json())
app.use(morgan("tiny"))

import userRouter from './src/router/userRouter.js';
import productRouter from './src/router/productRouter.js';
import categoryRouter from './src/router/categoryRouter.js';
import cartRouter from './src/router/cartRouter.js'
import orderRouter from './src/router/orderRouter.js';

app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/cartItems", cartRouter);
app.use("/api/v1/orders", orderRouter);


app.get("/", (req, res) => {
    res.json({
        status: "success",
        message: "server is live"
    })
})

app.use((error, req, res, next)=> {
    const errorCode = error.errorCode || 500

    res.status(errorCode).json({
        status: "error",
        message: error.message,
    })
})

app.listen(PORT, (error) => {
    error ? console.log(error) : console.log(`Server is is running at http://localhost:${PORT}`);
})
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import "dotenv/config";
import { connectDb } from './src/config/configDb.js';


const app = express();

const PORT = process.env.PROT || 8000

connectDb();
app.use(cors());
app.use(express.json())
app.use(morgan("tiny"))

import userRouter from './src/router/userRouter.js';

app.use("/api/v1/users", userRouter);

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
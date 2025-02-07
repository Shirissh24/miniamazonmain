import express from 'express';
import mongoose from 'mongoose';
import user from "./Controllers/user.model.js";
import { userController } from './Controllers/user.controller.js';
// import jwt from 'jsonwebtoken';
import { productController } from './product/product.controller.js';
import cors from 'cors';

//backend app
const app = express();

app.use(express.json());
app.use(cors());

//db connect
const dbConnect = async() => {
    try {
        const url = "mongodb+srv://sandeshmaharzan5:sandesh08@sandesh.5wg9e.mongodb.net/College-user?retryWrites=true&w=majority&appName=sandesh";
        await mongoose.connect(url);
        console.log("DB connection successful..");
    } catch (error) {
        console.log('Db connection failed...');
        console.log(error.message);
    }
};

dbConnect();

//register routes or controller
app.use(userController);
app.use(productController);

//network port
const PORT = 8000;   

app.listen(PORT, () =>{
    console.log(`App on listening on port ${PORT}`)
});


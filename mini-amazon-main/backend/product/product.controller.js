import express from 'express';
import productTable from "./product.model.js";
import productValidationSchema from './product.validation.js';
import mongoose from 'mongoose';
import isUser from '../middleware/authentication.middleware.js';
import validateMongoIdFromReqParams from '../middleware/mongo.validate.js';

const router = express.Router();

// add product
router.post('/product/add', isUser , async (req, res, next) => {
    // console.log("I am from middleware")               // this is middle ware
    // data validation
    try {
        req.body = await productValidationSchema.validate(req.body);
        next();
    } catch (error) {
        return res.status(400).send({message: error.message});
    }                 
}, async (req, res) => {
    // extract product from body
    const newProduct = req.body;

    // add product
    await productTable.create(newProduct);

    return res.status(201).send({message: 'Product is added successfully....', productDetails: newProduct});
});

// get product by id
router.get('/product/details/:id', isUser , validateMongoIdFromReqParams, async (req, res) => {
    // extract product id from req params
    const productId = req.params.id;

    // find product
    const product = await productTable.findOne({_id: productId});

    // if not product throw error
    if(!product) {
        return res.status(404).send({message: 'Product does not exist'});
    }

    // send res product details
    return res.status(200).send({message: 'success', productData: product});
});

// delete product by id
router.delete('/product/delete/:id', isUser,  validateMongoIdFromReqParams, async (req, res) => {
    // extract product id from req params
    const productId = req.params.id;

    //find product
    const product = await productTable.findOne({_id: productId});

    // if not product throw error
    if(!product) {
        return res.status(404).send({message: 'Product does not exist'});
    }

    // delete product   
    await productTable.deleteOne({_id: productId});

    // send res 
    return res.status(200).send({message: 'Product is deleted successfully'});
});

// list products
router.post(
    '/product/list',
    isUser,
    async (req, res, next) => {
      const paginationSchema = Yup.object({
        page: Yup.number().positive().integer().default(1),
        limit: Yup.number().positive().integer().default(10),
      });
  
      try {
        req.body = await paginationSchema.validate(req.body);
      } catch (error) {
        return res.status(400).send({ message: error.message });
      }
      next();
    },
    async (req, res) => {
      // extract page and limit from req.body
      const paginationData = req.body;
  
      const limit = paginationData.limit;
      const page = paginationData.page;
  
      const skip = (page - 1) * limit;
  
      const products = await productTable.aggregate([
        {
          $match: {},
        },
  
        { $skip: skip },
        { $limit: limit },
      ]);
  
      const totalItem = await ProductTable.find().countDocuments();
  
      const totalPage = Math.ceil(totalItem / limit);
  
      return res
        .status(200)
        .send({ message: 'success', productList: products, totalPage });
    }
  );
  
router.put(
    "/product/edit/:id",
    isUser,
    validateMongoIdFromReqParams,
    async (req, res, next) => {
      // create schema
      const productValidationSchema = Yup.object({
        name: Yup.string().required().trim().max(155),
        brand: Yup.string().required().trim().max(155),
        price: Yup.number().required().min(0),
        quantity: Yup.number().required().min(1),
        category: Yup.string()
          .required()
          .trim()
          .oneOf([
            "grocery",
            "electronics",
            "electrical",
            "clothing",
            "kitchen",
            "kids",
          ]),
        image: Yup.string().notRequired().trim(),
      });
      try {
        req.body = await productValidationSchema.validate(req.body);
        next();
      } catch (error) {
        return res.status(400).send({ message: error.message });
      }
    },
  
    async (req, res) => {
      const productId = req.params.id;
      // find product
      const product = await productTable.findOne({ _id: productId });
  
      if (!product) {
        return res.status(404).send({ message: "Product does not exist...." });
      }
  
      // update product
      const newValues = req.body;
      await ProductTable.updateOne({_id:productId}),
      {
        $set:{
          name: newValues.name,
          brand:newValues.brand,
          price:newValues.price,
          quantity:newValues.quantity,
          category:newValues.category,
        }
      }
      return res
        .status(200)
        .send({ message: "Product updated successfully...." });
    }
  );

export { router as productController};
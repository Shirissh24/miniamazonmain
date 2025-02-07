import mongoose from "mongoose";
const validateMongoIdFromReqParams=(req, res, next) => {
    // extract product id from req params
    const productId = req.params.id;

    // should be a valid mongo id
    const isValidProductId = mongoose.isValidObjectId(productId);

    // if not valid id   
    if(!isValidProductId) {
        return res.status(400).send({message: 'Invalid Product ID...'});
    }
    next();
};

export default validateMongoIdFromReqParams;
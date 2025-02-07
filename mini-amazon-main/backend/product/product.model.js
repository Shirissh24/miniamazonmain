import mongoose from "mongoose";

// create schema

const productSchema = new mongoose.Schema({
    name: {
        type: String, required: true, trim: true, maxlength: 150,
    },
    price: {
        type: String, required: true, min: 0,
    },
    brand: {
        type: String, required: true, trim: 0, maxlength: 155,
    },
    category: {
        type: String, required: true, trim: true, 
        enum: ["Grocery", "Electronics", "Clothing", "Kitchen", "Kids"],
    },
    image: {
        type: String, required: false, trim: true,
    },
    Quantity: {
        type: Number, trim: true, min: 1,
    },
    description: {
        type: String, trim: true,  maxlength: 1000
    }
}, {
    timestamps: true,
});

const productTable = mongoose.model('Product', productSchema);
export default productTable;
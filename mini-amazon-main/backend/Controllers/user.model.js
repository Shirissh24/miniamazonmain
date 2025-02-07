
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 255,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
        unique: true,
    },
    phoneNumber: {
        type: String,
        required: false,
        trim: true,
        maxlength: 20,
    },
    address: {
        type: String,
        required: false,
        trim: true,
        maxlength: 100,
    },
    dateOfBirth: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
    },
    gender: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
        enum: ['Male', 'Female', 'Others'],   //select only one in given array
    },
});

// create table/ model/ collection
const user = mongoose.model('user', userSchema);
export default user;
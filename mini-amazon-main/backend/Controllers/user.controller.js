import express from 'express';
import user from "./user.model.js";
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import userValidationSchema from './user.validation.js';
import yup from 'yup';

const router =  express.Router();

// register req and password hashing
router.post("/user/register", async (req, res, next) => {
    //data validation
    try {
        req.body = await userValidationSchema.validate(req.body);
        next();
    } catch (error) {
        return res.status(400).send({message: error.message});
    }  
}, async (req, res) => {
    const newuser = req.body;

    //find user with provided email
    const user = await user.findOne({ email: newuser.email });

    //if user throws error
    if(user) {
        return res.status(400).send({message: 'Email already exists'});
    };

    //hash password =? requirement is plain password and salt rounds

    const plainPassword = newuser.password;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

    newuser.password = hashedPassword;

    await user.create(newuser);
    return res.status(201).send("Registered user...")
})

// login request
router.post("/user/login", async(req, res, next) => {
    const loginUserValidationSchema = yup.object ({
        email: yup.string().required().email().max(100),
        password: yup.string().required().max(100).trim(),
    });

    try {
        req.body = await loginUserValidationSchema.validate(req.body);
        next();
    } catch (error) {
        return res.status(400).send({message: error.message});
    }  
}, async (req, res) => {
    const loginCredentials = req.body;


    //find user with provided email
    const user = await user.findOne({ email : loginCredentials.email });

    //if not user throw error
    if(!user) {
        return res.status(400).send({message: 'Invalid email or password'});
    };

    //password check
    // need to compare plain password with hashed password
    // plain password is provide by user

    const plainPassword = loginCredentials.password;
    const hashedPassword = user.password;

    const isPasswordMatched = await bcrypt.compare(plainPassword, hashedPassword);

    if(!isPasswordMatched) {
        return res.status(400).send({message: 'Invalid Credentials'});
    };

    //remove password
    user.password = undefined;

    //generate access token using jwt where email is encrypted through payload
    const secretKey = "sushilganduhokoteshwormabasxa";
    const payload = {email: user.email};

    const token = jwt.sign(payload, secretKey, {
        expiresIn: '8d',
    });

    return res.status(200).send({message: 'Login successfull...', userDetails: user, accessToken: token});
});

// list request
router.get('/user/list', async (req, res) => {
    const users = await user.find();
    return res.status(200).send({message: 'success', user_List: users});
});

//router.post("/user/add", (req, res) =>{
    
//     const newuser = req.body;
//     // const newuser = {
//     //     id: 3,
//     //     name: 'nikhil uprety',
//     // };
//     userList.push(newuser);
//     return res.status(201).send({message: "added user successfully.."});
// })

//get user by id
//router.get("/user/details/:id", (req, res) =>{
    
//     const userId = req.params.id;
//     // const actorId = req.body.id;
//     const userDetail = userList.find((item) => {
//         return item.id === Number(userId);   //in case your number is stored in string eg '56'
//     });
//     if(!userDetail){
//         return res.status(404).send({ message: "user doesnot exist"})
//     };

//     return res.status(200).send(
//         {
//         message: "success", 
//         userData: userDetail
//     });
// })


//delete user by id
router.delete('/user/delete/:id', async (req, res) => {
    //extract user id from req params
    const userId = req.params.id;

    //should be a valid mongo id
    const isValidId = mongoose.isValidObjectId(userId);

    // if not Valid id
    if(!isValidId){
        return res.status(400).send({message: 'Invalid Object ID...'});
    }
    
    // find user
    const user = await user.findOne({_id : userId});

    // if not user throw error
    if(!user) {
        return res.status(404).send({message: 'user does not exist'});
    }

    //delete user
    await user.deleteOne({_id : userId
    });

    // send res
    return res.status(200).send({message: 'user is deleted successfully'});
});

export {router as userController};
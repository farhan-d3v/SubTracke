import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {JWT_EXPIRES_IN, JWT_SECRET} from "../config/env.js";

import User from "../Models/user.model.js";

export const signUp = async (req,res,next) =>{
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        //creating user
       const {name, email, password} = req.body;

       //check if user exist
    const existingUser = await User.findOne({email});

    if(existingUser){
        const error = new Error('User already exists');
        error.statusCode = 409;
        throw error;
    }
        //hashes password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        //creating a new user
        const newUsers = await User.create([{ name, email, password:hashedPassword}], {session});
        //generate token
        const token = jwt.sign({userId: newUsers[0]._id},JWT_SECRET,{expiresIn: JWT_EXPIRES_IN });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success:true,
            message:'New User is created',
            data:{
                token,
                user: newUsers[0]
            }
        })
    }catch (error){
    await session.abortTransaction();
    session.endSession();
    next(error);
    }
}

export const signIn = async (req,res,next) =>{
    try {
    const {email, password} = req.body;

    const user = await User.findOne({email});

    if (!user){
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid){
        const error = new Error('incorrect password');
        error.statusCode = 401;
        throw error;
    }
    const token = jwt.sign({userId: user._id},JWT_SECRET,{expiresIn: JWT_EXPIRES_IN});

    res.status(200).json({
        success: true,
        message:'User signed in successfully',
        data:{
            token,
            user,
        }
    });

    }catch (error){
        next(error);
    }
}

export const signOut = async (req,res,next) =>{}


import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{type: String,
        required: [true, 'UserName is required'],
        trim : true,
       minLength: 2,
        maxLength: 50,
    },
    email:{
        type: String,
        required: [true, 'User Email is required'],
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'please fill a valid email address'],
    },
    password: {
        type: String,
        required: [true, 'User password is required'],
        minLength: 6,
    }
}, {timestamps:true});

const User = mongoose.model('User', userSchema);

export default User;

import mongoose from "mongoose";

const userSchema =  new mongoose.Schema({
    name: {type: String, required: true, trim: true},
    email: {type: String, requried: true, trim: true, unique: true, lowercase: true},
    password: {type: String, required: true, trim: true},
    is_verifiled: {type: Boolean, default: false},
    roles: { type: [String], enum: ["user", "admin"], default: ["user"] },
})

// Model 

const UserModel = mongoose.model("user", userSchema)


export default UserModel;
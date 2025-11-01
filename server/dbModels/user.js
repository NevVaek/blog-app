import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    id: {type: String, required: true},
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    joined: {type: Date, required: true},
});

const userModel = mongoose.model("User", userSchema);

export default userModel
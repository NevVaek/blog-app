import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const userSchema = mongoose.Schema({
    id: {type: String, required: true},
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    joined: {type: Date, required: true},
    icon: {type: String, default: `${process.env.BASE_URL}/uploads/images/userIcons/default-icon.jpeg` ,required: true}
});

const userModel = mongoose.model("User", userSchema);

export default userModel
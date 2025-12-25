import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const userSchema = mongoose.Schema({
    id: {type: String, required: true, unique: true},
    username: {type: String, required: true, unique: true, minlength: 5, maxlength: 20, trim: true},
    email: {type: String, required: true, unique: true, trim: true},
    password: {type: String, required: true},
    joined: {type: Date, required: true},
    icon: {type: String, default: `${process.env.BASE_URL}/uploads/images/usericons/default-icon.jpeg` ,required: true}
});

const userModel = mongoose.models.Blog || mongoose.model("User", userSchema);

export default userModel
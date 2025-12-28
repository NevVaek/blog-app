import mongoose from "mongoose";

const blogSchema = mongoose.Schema({
    id: {type: String, required: true, unique: true},
    owner: {type: mongoose.Schema.Types.ObjectId, ref:"User", required: true},
    blogName: {type: String, required: true, unique: true, minlength: 5, maxlength: 50, trim: true},
    description: {type: String, maxlength: 1500, required: false},
    followers: {type: Number, default: 0, required: true},
    banner: {type: String, default: null},
    blogSlug: {type: String, required: true, unique: true},
}, {timestamps: true});

const postSchema = mongoose.Schema({
    id: {type: String, required: true, unique: true},
    author: {type: mongoose.Schema.Types.ObjectId, ref:"User", required: true},
    blogId: {type: String, required: true},
    title: {type: String, required: true, maxlength: 200},
    body: {type: String, required: true, maxlength: 50000},
    images: [{type: String}],
    stars: {type: Number, default: 0, required: true}
}, {timestamps: true});

export const blogModel = mongoose.models.Blog || mongoose.model("Blog", blogSchema);
export const postModel = mongoose.models.Post || mongoose.model("Post", postSchema);


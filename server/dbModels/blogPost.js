import mongoose from "mongoose";

const blogSchema = mongoose.Schema({
    id: {type: String, required: true},
    owner: {type: mongoose.Schema.Types.ObjectId, ref:"User", required: true},
    blogName: {type: String, required: true},
    description: {type: String, maxlength: 2000, required: false},
    followers: {type: Number, default: 0, required: true},
    banner: {type: String, default: null},
    blogSlug: {type: String, required: true},
}, {timestamps: true});

const postSchema = mongoose.Schema({
    id: {type: String, required: true},
    author: {type: mongoose.Schema.Types.ObjectId, ref:"User", required: true},
    blogId: {type: String, required: true},
    title: {type: String, required: true},
    body: {type: String, required: true},
    images: [{type: String}],
    stars: {type: Number, default: 0, required: true}
}, {timestamps: true});

export const blogModel = mongoose.models.Blog || mongoose.model("Blog", blogSchema);
export const postModel = mongoose.models.Post || mongoose.model("Post", postSchema);


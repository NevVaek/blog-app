import mongoose from "mongoose";

const blogSchema = mongoose.Schema({
    id: {type: String, required: true},
    ownerId: {type: String, required: true},
    blogName: {type: String, required: true},
    followers: {type: Number, default: 0, required: true},
    banner: {type: String, default: null},
}, {timestamps: true});

const postSchema = mongoose.Schema({
    id: {type: String, required: true},
    authorId: {type: String, required: true},
    blogId: {type: String, required: true},
    title: {type: String, required: true},
    body: {type: String, required: true},
    images: [{type: String}],
    stars: {type: Number, default: 0, required: true}
}, {timestamps: true});

export const blogModel = mongoose.model("Blog", blogSchema);
export const postModel = mongoose.model("Post", postSchema);


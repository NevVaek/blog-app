import {postModel, blogModel} from "../dbModels/blogPost.js";
import {v4 as uuidv4} from "uuid";

export async function postWare(mode, req) {
    try {
        if (mode === "rAll") {
            const blogId = await searchBlogId(req.params.blogName)
            if (!blogId) {
                return false;
            }
            return await postModel.find({blogId: blogId});
        } else if (mode === "rOne") {
            const blogId = await searchBlogId(req.params.blogName);
            if (!blogId) {
                return "noBlog";
            }
            const result = await postModel.findOne({id: req.params.postId});
            if (!result) {
                return "noPost";
            }
            return result;
        } else if (mode === "w") {
            const blogId = await searchBlogId(req.params.blogName);
            if (!blogId) {
                return false;
            }

            const newPost = new postModel({
                id: uuidv4(),
                authorId: req.user.id,
                blogId: blogId,
                title: req.body.title,
                body: req.body.body,
                images: req.files ? req.files.map(file => {
                `${req.protocol}://${req.get("host")}/uploads/${file.filename}`
                }) : []
            });
            await newPost.save();
            return true;
        } else if (mode === "a") {
            const blogId = await searchBlogId(req.params.blogName);
            if (!blogId) {
                return "noBlog";
            }
            const UpdatedFields = req.body;

            const post = await postModel.findOneAndUpdate(
                {id: req.params.postId},
                {$set: UpdatedFields},
                {new: true, runValidators: true}
            );
            if (!post) {
                return "noPost";
            }
            return true;
        } else {
            throw new Error("Unknown mode specified");
        }
    } catch(err) {
        throw err
    }
}

export async function blogWare(mode, req) {
    try{
        if (mode === "r") {
            const result = await blogModel.findOne({blogName: req.params.blogName});
            if (!result) {
                return false;
            }
            return result;
        } else if (mode === "w") {
            const checkedResult = await blogModel.findOne({blogName: req.body.blogName});
            if (checkedResult) {
                return false;
            }
            const newBlog = new blogModel({
               id: uuidv4(),
                ownerId: req.user.id,
                blogName: req.body.blogName,
                banner: req.file ? `${req.protocol}://${req.get("host")}/uploads/images/banners/${req.file.filename}` : null,
            });
            await newBlog.save();
            return true;
        } else if (mode === "a") {
            const blogId = await searchBlogId(req.params.blogName);
            if (!blogId) {
                return false;
            }
            const updatedFields = req.body;
            if (req.file) {
                updatedFields.image = `${req.protocol}://${req.get("host")}/uploads/images/banners/${req.file.filename}`
            }

            await blogModel.findOneAndUpdate(
                {id: blogId},
                {$set: updatedFields},
                {runValidators: true}
            );
            return true;
        } else {
            throw new Error("Unknown mode specified");
        }
    } catch (err) {
        throw err
    }
}

async function searchBlogId(name) {
    try {
        const result = await blogModel.findOne({blogName: name});
        if (!result) {
            return false;
        }
        return result.id;
    } catch (err) {
        throw err
    }
}



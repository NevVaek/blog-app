import {postModel, blogModel} from "../dbModels/blogPost.js";
import {v4 as uuidv4} from "uuid";
import slugify from "slugify";

export async function postWare(mode, req) {
    try {
        if (mode === "rAll") {
            const blogId = await searchBlogNames("slugToId", req.params.blogSlug);
            if (!blogId) {
                return false;
            }
            return await postModel.find({blogId: blogId});
        } else if (mode === "rOne") {
            const blogId = await searchBlogNames("slugToId", req.params.blogSlug);
            if (!blogId) {
                return "noBlog";
            }
            const result = await postModel.findOne({id: req.params.postId});
            if (!result) {
                return "noPost";
            }
            return result;
        } else if (mode === "w") {
            const blogId = await searchBlogNames("slugToId", req.params.blogSlug);
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
            const blogId = await searchBlogNames("slugToId", req.params.blogSlug);
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
            const result = await blogModel.findOne({blogSlug: req.params.blogSlug});
            if (!result) {
                return false;
            }
            return result;
        } else if (mode === "w") {
            const checkedResult = await blogModel.findOne({blogName: req.body.blogName});
            if (checkedResult) {
                return "exists";
            }
            if (!checkString(req.body.blogName)) {
                return "forbidden"
            }

            const newBlog = new blogModel({
               id: uuidv4(),
                ownerId: req.user.id,
                blogName: req.body.blogName,
                blogSlug: slugify(req.body.blogName, {lower: true, strict: true}),
                banner: req.file ? `${req.protocol}://${req.get("host")}/uploads/images/banners/${req.file.filename}` : null,
            });
            await newBlog.save();
            return true;
        } else if (mode === "a") {
            const blogId = await searchBlogNames("slugToId", req.params.blogSlug);
            if (!blogId) {
                return "noBlog";
            }
            const updatedFields = req.body;
            if (req.file) {
                updatedFields.image = `${req.protocol}://${req.get("host")}/uploads/images/banners/${req.file.filename}`
            }
            if (req.body.blogName) {
                if (!checkString(req.body.blogName)) {
                    return "forbidden";
                }
                updatedFields.blogSlug = slugify(req.body.blogName, { lower: true });
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

async function searchBlogNames(mode, name) {
    try {
        if (mode === "nameToId" || mode === "nameToSlug") {
         const result = await blogModel.findOne({blogName: name});
         if (!result) {
            return false;
        }
         return mode === "nameToId" ? result.id : result.blogSlug;
        }

        if (mode === "slugToId") {
            const result = await blogModel.findOne({blogSlug: name});
            if (!result) {
                return false;
            }
            return result.id;
        } else {
            throw new Error("Unknown mode");
        }
    } catch (err) {
        throw err
    }
}

function checkString(name) {
    if (!name) {
        return false;
    }
    const regex = /^[a-zA-Z0-9 _-]+$/;

    return regex.test(name)
}



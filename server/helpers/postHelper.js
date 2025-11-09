import {postModel, blogModel} from "../dbModels/blogPost.js";
import {v4 as uuidv4} from "uuid";
import slugify from "slugify";
import fs from "fs";

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

            if (req.files) {
                if (req.files.length > 5) return "exceedMax";
            }

            const newPost = new postModel({
                id: uuidv4(),
                authorId: req.user.id,
                blogId: blogId,
                title: req.body.title,
                body: req.body.body,
                images: req.files ? req.files.map(file => {
                `${req.protocol}://${req.get("host")}/uploads/images/posts/${file.filename}`
                }) : []
            });
            await newPost.save();
            return true;
        } else if (mode === "a") {
            const blogId = await searchBlogNames("slugToId", req.params.blogSlug);
            if (!blogId) {
                return "noBlog";
            }
            const post = await postModel.findOne({id: req.params.postId});
            if (!post) {
                return "noPost";
            }

            const allowed = ["title", "body", "images"]

            for (const key of allowed) {
                if (req.body[key] !== undefined) post[key] = req.body[key];
            }

            if (req.body.deletedImages) {
                const toDelete = JSON.parse(req.body.deletedImages);
                post.images = post.images.filter(img => !toDelete.includes(img));

                await Promise.all(toDelete.map(async (filename) => {
                    try {
                        await fs.unlink(`uploads/images/posts/${filename}`, err => {
                            throw new Error()
                        });
                    } catch (err) {
                        console.error("Failed to delete", filename);
                        throw new Error("Bad delete");
                    }
                }));
            }

            if (req.files && req.files.length > 0) {

                const newImages = req.files.map(file =>
                    `${req.protocol}://${req.get("host")}/uploads/images/posts/${file.filename}`
                );
                post.images = [...post.images, ...newImages];
            }

            if (post.images.length > 5) return "exceedMax";
            await post.save();

            return true;
        } else if (mode === "d") {
            const blog = await blogModel.findOne({blogSlug: req.params.blogSlug});
            if (!blog) {
                return "noBlog";
            }
            const post = await postModel.findOneAndDelete({id: req.params.postId});
            if (!post) {
                return "noPost";
            }

            if (post.images && post.images.length > 0) {
                for (const imgUrl of post.images) {
                    const filename = imgUrl.split("/").pop();
                    fs.unlink(`uploads/images/posts/${filename}`, err => {
                        console.error("Failed to delete", filename);
                        throw new Error("Bad delete");
                    });
                }
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

            const allowed = ["blogName", "banner"];
            const updateFields = {}

            for (const key of allowed) {
                if (req.body[key] !== undefined) updateFields[key] = req.body[key];
            }

            if (Object.keys(updateFields).length === 0) {
                return "empty";
            }

            if (req.file) {
                updateFields.banner = `${req.protocol}://${req.get("host")}/uploads/images/banners/${req.file.filename}`
            }
            if (updateFields.blogName) {
                if (!checkString(updateFields.blogName)) {
                    return "forbidden";
                }
                 const checkedResult = await blogModel.findOne({blogName: updateFields.blogName});
                if (checkedResult) {
                    return "exists";
                }

                updateFields.blogSlug = slugify(updateFields.blogName, { lower: true });
            }

            await blogModel.findOneAndUpdate(
                {id: blogId},
                {$set: updateFields},
                {runValidators: true}
            );
            return true;
        } else if (mode === "d") {

            const blog = await blogModel.findOneAndDelete({blogSlug: req.params.blogSlug}, {});
            if (!blog) {
                return "noBlog";
            }

            if (blog.banner) {
             await fs.promises.unlink(`uploads/images/banners/${blog.banner.split("/").pop()}`);
            }

            const posts = await postModel.find({blogId: blog.id});
            if (posts.length) {
             for (const post of posts) {
                 if (post.images && post.images.length > 0) {
                     await Promise.allSettled(
                         post.images.map(imgUrl => {
                             const filename = imgUrl.split("/").pop();
                             return fs.promises.unlink(`uploads/images/posts/${filename}`)
                         })
                     );

                 }
             }
            }

            await postModel.deleteMany({blogId: blog.id});

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





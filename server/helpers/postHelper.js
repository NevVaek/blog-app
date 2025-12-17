import {postModel, blogModel} from "../dbModels/blogPost.js";
import deleteWare from "./deleteHelper.js";
import {v4 as uuidv4} from "uuid";
import slugify from "slugify";
import fs from "fs";

export async function postWare(mode, req) {
    try {
        if (mode === "rPagination") {
            const blogId = await searchBlogNames("slugToId", req.params.blogSlug);
            if (!blogId) {
                return false;
            }
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            const totalPosts = await postModel.countDocuments({blogId: blogId});

            const posts = await postModel.find({blogId: blogId}).sort({createdAt: -1}).skip(skip).limit(limit).populate("author", "id username icon");

            return {posts, page, limit, totalPosts}

        } else if (mode === "rOne") {
            const blogId = await searchBlogNames("slugToId", req.params.blogSlug);
            if (!blogId) {
                return "noBlog";
            }
            const result = await postModel.findOne({id: req.params.postId}).populate("author", "id username icon");
            if (!result) {
                return "noPost";
            }
            return result;
        } else if (mode === "w") {

            //return false when blogslug doesn't exist
            const blogId = await searchBlogNames("slugToId", req.params.blogSlug);
            if (!blogId) {
                return false;
            }

            if (req.files) {
                if (req.files.length > 5) return "exceedMax";
            }

            const newPost = new postModel({
                id: uuidv4(),
                author: req.user._id,
                blogId: blogId,
                title: req.body.title,
                body: req.body.body,
                images: req.files ? req.files.map(file =>
                `${req.protocol}://${req.get("host")}/uploads/images/posts/${file.filename}`
                ) : []
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
            const updatePostFields = {}     //Creates container

            for (const key of allowed) {        //Adds the new values to the container
                if (req.body[key] !== undefined) updatePostFields[key] = req.body[key];
            }
            const toDelete = req.body.deletedImages ? JSON.parse(req.body.deletedImages) : null;

            if (toDelete) {
                updatePostFields.images = post.images.filter(img => !toDelete.includes(img));
            }

            if (req.files && req.files.length > 0) {

                const newImages = req.files.map(file =>
                    `${req.protocol}://${req.get("host")}/uploads/images/posts/${file.filename}`
                );
                updatePostFields.images = [...updatePostFields.images, ...newImages];
            }

            if (updatePostFields.images.length > 5) return "exceedMax";

            const updatedResult = await postModel.findOneAndUpdate(
                {id: req.params.postId,
                author: req.user._id        // For double protection
                },
                {$set: updatePostFields},
                {runValidators: true, new: true}
            );

            if (!updatedResult) {
                throw new Error("Id not found");
            }

            if (toDelete) {
                await deleteWare("post", toDelete);
            }

            return true;
        } else if (mode === "d") {
            const blog = await blogModel.findOne({blogSlug: req.params.blogSlug});
            if (!blog) {
                return "noBlog";
            }
            const post = await postModel.findOneAndDelete({id: req.params.postId, author: req.user._id}); //Single atomic operation. Only runs once per request
            if (!post) {
                return "noPost";
            }

            if (post.images && post.images.length > 0) {
                await deleteWare("post", post.images);
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
        if (mode === "rOne") {
            const result = await blogModel.findOne({blogSlug: req.params.blogSlug}).populate("owner", "id username icon");
            if (!result) {
                return false;
            }
            return result;
        } else if (mode === "rOneNameNew") {
            return checkBlogNameForDupe("new", req.body.blogName);  // Returns TRUE if there is dupe, otherwise, FALSE
        } else if (mode === "rOneNameUpdate") {
            return checkBlogNameForDupe("update", req.body.blogName, req.body.blogId);  // Returns TRUE if there is dupe, otherwise, FALSE
        } else if (mode === "rMult") {
            const result = await blogModel.find().sort({followers: -1}).limit(10).populate("owner", "id username icon");
            if (!result) {
                return false;
            }
            return result
        } else if (mode === "w") {
            const checkedResult = await checkBlogNameForDupe("new", req.body.blogName);
            if (checkedResult) {
                return "exists";
            }
            if (!checkString(req.body.blogName)) {
                return "forbidden"
            }
            const newBlog = new blogModel({
               id: uuidv4(),
                owner: req.user._id,
                blogName: req.body.blogName,
                description: req.body.description,
                blogSlug: slugify(req.body.blogName, {lower: true, strict: true}),
                banner: req.file ? `${req.protocol}://${req.get("host")}/uploads/images/banners/${req.file.filename}` : `${req.protocol}://${req.get("host")}/uploads/images/banners/defaults/default${getRandomInt(1, 17)}.jpg`
            });
            await newBlog.save();
            return true;
        } else if (mode === "a") {
            const blogId = await searchBlogNames("slugToId", req.params.blogSlug);
            if (!blogId) {
                return "noBlog";
            }
            const blog = await blogModel.findOne({ id: blogId });
            const oldBannerPath = blog.banner;

            const allowed = ["blogName","description", "banner"];
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
                 const checkedResult = await checkBlogNameForDupe("update", updateFields.blogName, blogId);
                if (checkedResult) {
                    return "exists";
                }

                updateFields.blogSlug = slugify(updateFields.blogName, { lower: true });
            }

            try {
                const updateResult = await blogModel.findOneAndUpdate(   //Single atomic operation. Only runs once per request
                    {id: blogId,
                    owner: req.user._id
                    },
                    {$set: updateFields},
                    {runValidators: true}
                );
                if (!updateResult) {
                    throw new Error("Id not found");
                }

            } catch (err) {
                if (err.code === 11000) return "exists";
                throw new Error("Something went wrong");
            }

            if (req.file && oldBannerPath) {
                await deleteWare("banner", oldBannerPath);
            }

            return updateFields.blogName ? updateFields.blogSlug : true;
        } else if (mode === "d") {

            const blog = await blogModel.findOneAndDelete({blogSlug: req.params.blogSlug, owner: req.user._id}, {}); //Single atomic operation. Only runs once per request
            if (!blog) {
                return "noBlog";
            }

            if (blog.banner) {
                await deleteWare("banner", blog.banner);
            }

            const posts = await postModel.find({blogId: blog.id});
            if (posts.length) {
                for (const post of posts) {
                    if (post.images && post.images.length > 0) {
                        await deleteWare("post", post.images);
                    }
                }

                await postModel.deleteMany({blogId: blog.id, author: req.user._id});
            }
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

async function checkBlogNameForDupe(mode, nameData, blogIdData=null) {
    try {                                                                   // Returns TRUE if there is dupe, otherwise returns FALSE
        const name = slugify(nameData, { lower: true });
        const result = await blogModel.findOne({blogSlug: name});
        if (mode === "new") {
            return !!result;
        } else if (mode === "update") {                                     // For the mode "update", requires blogIdData as argument
            if (!result) {
                return false;
            }
            return !result.id === blogIdData   //For the mode "update", if the result blog and the checking blog is the same, pass
        }
        return false;
    } catch {
        return false
    }
}

function getRandomInt(min, max) {
  // Ensure min and max are integers
  min = Math.ceil(min);
  max = Math.floor(max);

  // Generate a random number in the specified range
  return Math.floor(Math.random() * (max - min + 1)) + min;
}





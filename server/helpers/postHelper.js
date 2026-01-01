import {postModel, blogModel} from "../dbModels/blogPost.js";
import {stringLengthChecker} from "./authHelper.js";
import deleteWare from "./deleteHelper.js";
import {v4 as uuidv4} from "uuid";
import slugify from "slugify";

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
            try {
                //return false when blogslug doesn't exist
                const blogId = await searchBlogNames("slugToId", req.params.blogSlug);
                if (!blogId) {
                    throw {name: "InvalidBlogError", message: "Blog could not be found"}
                }
                const titleLengthResult = stringLengthChecker(req.body.title, 200);
                if (titleLengthResult !== true ) {
                    throw {name: "ValidationError",
                        errors: {
                            title: {message: "Post title cannot be longer than 200 characters"}
                        }
                    }
                }
                const normalizedBody = typeof req.body.body === "string" ? normalizeString(req.body.body) : "";
                const bodyLengthResult = stringLengthChecker(normalizedBody, 50000);
                if (bodyLengthResult !== true) {
                    throw {name: "ValidationError",
                        errors: {
                            title: {message: "Post description cannot be longer than 50000 characters"}
                        }
                    }
                }

                if (req.files) {
                    if (req.files.length > 5) {
                        throw {name: "ValidationError",
                            errors: {
                                images: {message: "Uploaded file count exceeds allowed limit"}
                            }
                        }
                    }
                }

                const newPost = new postModel({
                    id: uuidv4(),
                    author: req.user._id,
                    blogId: blogId,
                    title: req.body.title,
                    body: normalizedBody,
                    images: req.files ? req.files.map(file =>
                    `${req.protocol}://${req.get("host")}/uploads/images/posts/${file.filename}`
                    ) : []
                });
                await newPost.save();
                return {status: "ok"};
            } catch (err) {
                if (err.name === "ValidationError") {
                    const firstError = Object.values(err.errors)[0].message;
                    return {status: "err", code: 400, message: firstError}
                }
                if (err.name === "InvalidBlogError") {
                     return {status: "err", code: 404, message: "Blog could not be found"}
                }
                return {status: "err", code: 500, message: err}
            }

        } else if (mode === "a") {
            try {
                const blogId = await searchBlogNames("slugToId", req.params.blogSlug);
                if (!blogId) {
                    throw {name: "InvalidError", message: "Blog could not be found"};
                }
                const post = await postModel.findOne({id: req.params.postId});
                if (!post) {
                    throw {name: "InvalidError", message: "Post could not be found"};
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

                if (updatePostFields.title) {
                    const titleLengthResult = stringLengthChecker(req.body.title, 200);
                    if (titleLengthResult !== true ) {
                        throw {name: "ValidationError",
                            errors: {
                                title: {message: "Post title cannot be longer than 200 characters"}
                            }
                        }
                    }
                }

                if (updatePostFields.body) {
                    updatePostFields.body = typeof updatePostFields.body ? normalizeString(updatePostFields.body) : "";
                    const bodyLengthResult = stringLengthChecker(updatePostFields.body, 50000);
                    if (bodyLengthResult !== true) {
                        throw {name: "ValidationError",
                            errors: {
                                title: {message: "Post description cannot be longer than 50000 characters"}
                            }
                        }
                    }
                }

                if (updatePostFields.images.length > 5) {
                    throw {name: "ValidationError",
                        errors: {
                            images: {message: "Uploaded file count exceeds allowed limit"}
                        }
                    }
                }

                const updatedResult = await postModel.findOneAndUpdate(
                    {id: req.params.postId,
                    author: req.user._id},  // For double protection
                    {$set: updatePostFields},
                    {runValidators: true, new: true}
                );

                if (!updatedResult) {
                    throw {name: "InvalidError", message: "Post could not be found"}
                }

                if (toDelete) {
                    await deleteWare("post", toDelete);
                }

                return {status: "ok"};
            } catch (err) {

                if (err.name === "ValidationError") {
                    const firstError = Object.values(err.errors)[0].message;
                    return {status: "err", code: 400, message: firstError}
                }
                if (err.name === "InvalidError") {
                     return {status: "err", code: 404, message: err.message}
                }
                return {status: "err", code: 500, message: err}
            }

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
        } else if (mode === "rUser") {
            const result = await blogModel.find({owner: req.user._id}).sort({followers: -1});
            if (!result) {
                return false;
            }
            return result;
        } else if (mode === "w") {
            try {
                const quotaCheck = await checkBlogCount(req.user._id);
                if (!quotaCheck) {
                    throw {
                        name: "ValidationError",
                        errors: {
                            blog: {message: "5 Blog limit already reached for this account."}
                        }
                    }
                }

                const nameLengthResult = stringLengthChecker(req.body.blogName, 50, 5, true);
                if (nameLengthResult !== true) {
                    let message = "";
                    if (nameLengthResult === "TooShort") {
                        message = "Blog name cannot be shorter than 5 characters";
                    } else if (nameLengthResult === "TooLong") {
                        message = "Blog name cannot be longer than 50 characters";
                    } else {
                        throw new Error("Unknown type in stringLengthChecker for blogWare");
                    }
                    throw {
                            name: "ValidationError",
                            errors: {
                                blogName: { message: message}
                            }
                        };
                }
                const normalizedDesc = typeof req.body.description === "string" ? normalizeString(req.body.description) : "";
                const descLengthResult = stringLengthChecker(normalizedDesc, 3000);
                if (descLengthResult !== true) {
                    throw {
                        name: "ValidationError",
                            errors: {
                                description: { message: "Blog description cannot be longer than 3000 characters"}
                            }
                    }
                }

                const checkedResult = await checkBlogNameForDupe("new", req.body.blogName);
                if (checkedResult) {
                    throw {name: "ConflictError", code: 11000, message: "exists"}
                }
                if (!checkString(req.body.blogName)) {
                    throw {name: "ValidationError", errors: {message: "Blog name can only contain letters, numbers, spaces, underscores, and hyphens"}}
                }
                const newBlogSlug = slugify(req.body.blogName, {lower: true, strict: true});
                const newBlog = new blogModel({
                    id: uuidv4(),
                    owner: req.user._id,
                    blogName: req.body.blogName,
                    description: normalizedDesc,
                    blogSlug: newBlogSlug,
                    banner: req.file ? `${req.protocol}://${req.get("host")}/uploads/images/banners/${req.file.filename}` : `${req.protocol}://${req.get("host")}/uploads/images/banners/defaults/default${getRandomInt(1, 17)}.jpg`
                });
                await newBlog.save();
                return {status: "ok", data: newBlogSlug};
            } catch (err) {
                if (err.code === 11000) {
                    return {status: "err", code: 409, message: "Blog name already exists"} //returns when dupe user
                }
                if (err.name === "ValidationError") {
                    const firstError = Object.values(err.errors)[0].message;
                    return {status: "err", code: 400, message: firstError}
                }
                return {status: "err", code: 500, message: err}
            }

        } else if (mode === "a") {
            try {
                const blogId = await searchBlogNames("slugToId", req.params.blogSlug);
                if (!blogId) {
                    throw {name: "InvalidBlogError", message: "Blog name could not be found"}
                }

                const blog = await blogModel.findOne({ id: blogId });
                const oldBannerPath = blog.banner;
                const allowed = ["blogName","description", "banner"];
                const updateFields = {}

                for (const key of allowed) {    // Checks that the request is not trying to update an unauthorized value then adds to updateFields.
                    if (req.body[key] !== undefined) updateFields[key] = req.body[key];
                }

                if (Object.keys(updateFields).length === 0) {       //Checks that the form is not empty.
                    throw {
                            name: "ValidationError",
                            errors: {
                                blogName: { message: "Form empty. Blog has not been altered."}
                            }
                        };
                }

                if (req.file) {     // Overwrites the filepath in updateFields with the correctly altered path.
                    updateFields.banner = `${req.protocol}://${req.get("host")}/uploads/images/banners/${req.file.filename}`
                }

                if (updateFields.blogName) {  // Only runs if the blog name value has been changed. Checks if the new name meets the limitations
                    const nameLengthResult = stringLengthChecker(req.body.blogName, 50, 5, true);  //Checks if the blog name meets length limit
                    if (nameLengthResult !== true) {
                        let errMessage = "";
                        if (nameLengthResult === "TooShort") {
                            errMessage = "Blog name cannot be shorter than 5 characters";
                        } else if (nameLengthResult === "TooLong") {
                            errMessage = "Blog name cannot be longer than 50 characters";
                        } else {
                            throw new Error("Unknown type in stringLengthChecker for blogWare");
                        }
                        throw {
                            name: "ValidationError",
                            errors: {
                                blogName: { message: errMessage}
                            }
                        };
                    }

                    if (!checkString(updateFields.blogName)) {      // Checks if the blog name contains illegal characters
                        throw {
                            name: "ValidationError",
                            errors: {
                                blogName: { message: "Blog name should only contain letters, numbers, spaces, underscores, and hyphens."}
                            }
                        }
                    }

                    const checkedResult = await checkBlogNameForDupe("update", updateFields.blogName, blogId);    //Checks if the blog name already exists in db
                    if (checkedResult) {
                        throw {name: "ConflictError", code: 11000, message: "Blog name already taken"}
                    }

                    updateFields.blogSlug = slugify(updateFields.blogName, { lower: true });    // Finally, if everything meets requirement, create a blogSlug and add to updateFields
                }

                if (updateFields.description) {
                    updateFields.description = typeof updateFields.description === "string" ? normalizeString(updateFields.description) : "";
                    const descLengthResult = stringLengthChecker(updateFields.description, 1500);
                    if (descLengthResult !== true) {
                        throw {
                            name: "ValidationError",
                                errors: {
                                    description: { message: "Blog description cannot be longer than 1500 characters"}
                                }
                        }
                    }
                }

                const updateResult = await blogModel.findOneAndUpdate(   //Single atomic operation. Only runs once per request
                    {id: blogId,
                    owner: req.user._id
                    },
                    {$set: updateFields},
                    {runValidators: true}
                );
                if (!updateResult) {    // If the blog Id cannot be found, throw error.
                    throw {name: "InvalidBlogError", message: "Blog name not found"};
                }

                if (updateFields.banner && oldBannerPath) {
                    await deleteWare("banner", oldBannerPath);
                }

                return {status: "ok", data: updateFields.blogName ? updateFields.blogSlug : true};

            } catch (err) {
                if (err.code === 11000) {
                    return {status: "err", code: 409, message: "Blog name already taken"}
                }
                if (err.name === "ValidationError") {
                    const firstError = Object.values(err.errors)[0].message;
                    return {status: "err", code: 400, message: firstError}
                } else if (err.name === "InvalidBlogError") {
                    return {status: "err", code: 404, message: err.message}
                } else {
                    throw new Error(err);
                }
            }
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

export async function checkBlogCount(id) {  //Returns true if under quota false if over
    try {
        const count = await blogModel.countDocuments({owner: id});
        return count < 5

    } catch (err) {
        throw err
    }
}

function checkString(name) {
    if (!name) {
        return false;
    }
    const regex = /^[a-zA-Z0-9 _-]+$/;

    return regex.test(name);
}

function normalizeString(string) {
    return string.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
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
            return result.id !== blogIdData   //For the mode "update", if the result blog and the checking blog is the same, pass
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





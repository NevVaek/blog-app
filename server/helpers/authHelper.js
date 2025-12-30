import {v4 as uuidv4} from "uuid";
import User from "../dbmodels/user.js";
import {blogModel, postModel} from "../dbModels/blogPost.js";
import bcrypt from "bcrypt";


async function authWare(mode, req=null, userData=null) {
    try {
        if (!req && !userData) {
            throw new Error("req or userData must be provided");
        }
        if (mode === "r") {
            return await User.findOne({username: req.body.username});
        } else if (mode === "rId") {
            return req ? await User.findOne({ id: req.user.id }) : await User.findOne({ id: userData.id });
        } else if (mode === "w") {
            try { //This write operation is now ATOMIC
                const stringResult = stringLengthChecker(req.body.username, 20, 5, true);
                if (stringResult !== true) {
                    let message = "";
                    if (stringResult === "TooShort") {
                        message = "Username cannot be shorter than 5 characters";
                    } else if (stringResult === "TooLong") {
                        message = "Username cannot be longer than 20 characters";
                    } else {
                        throw new Error("Unknown type in stringLengthChecker in authWare");
                    }
                    throw {
                            name: "ValidationError",
                            errors: {
                                username: { message: message}
                            }
                        };
                }

                const salt = await bcrypt.genSalt();
                const hashedPassword = await bcrypt.hash(req.body.password, salt);
                const newUser = new User({
                    id: uuidv4(),
                    username: req.body.username,
                    email: req.body.email,
                    password: hashedPassword,
                    joined: new Date(),
                });

                await newUser.save();
                return {status: "ok"};
            } catch (err) {
                if (err.code === 11000) {
                    return {status: "err", code: 409, message: "Username already exists"} //returns when dupe user
                }
                if (err.name === "ValidationError") {
                    const firstError = Object.values(err.errors)[0].message;
                    return {status: "err", code: 400, message: firstError}
                }
                return {status: "err", code: 500, message: err}
            }
        } else if (mode === "a") {
            const allowed = ["email", "password", "icon"];
            const updateFields = {};

            for (const key of allowed) {
                if (req.body[key] !== undefined) updateFields[key] = req.body[key];
            }

            if (Object.keys(updateFields).length === 0) {
                return false;
            }

            if (updateFields.password) {
                const salt = await bcrypt.genSalt();
                updateFields.password = await bcrypt.hash(updateFields.password, salt);
            }

            if (req.file) {
                updateFields.icon = `${req.protocol}://${req.get("host")}/uploads/images/usericons/${req.file.filename}`
            }

            const updatedResult = await User.findOneAndUpdate(
                {id: req.user.id},
                {$set: updateFields},
                {runValidators: true, new: true}
            );

            if (!updatedResult) {
                throw new Error("Id not found");
            }

            return true;
        } else {
            throw new Error(`Unknown mode ${mode}`);
        }
    } catch(err) {
        throw err;
    }
}

export async function fetchUserId(username) {
    try {
        const result = await User.findOne({username: username});
        if (!result) {
            return false;
        }
        return result.id;
    } catch(err) {
        throw err;
    }
}

export function stringLengthChecker(string, max=null, min=null, trim=false) {
    if (typeof string !== "string") return "NotString";
    const trimmed = trim ? string.trim() : string;

    if (min && trimmed.length < min) {
        return "TooShort";
    } else if (max && trimmed.length > max) {
        return "TooLong";
    }
    return true;
}

export function permissionChecker(mode) {

    return async (req, res, next) => {
        try {
            const blog = await blogModel.findOne({blogSlug: req.params.blogSlug});
            if (!blog) {
                return res.status(404).json({
                    message: `Couldn't find blog. It doesn't exist`
                });
            }
            if (mode === "blog") {
                if (!blog.owner.equals(req.user._id)) {
                    return res.status(403).json({
                        message: "Access denied"
                    });
                }
            }
            if (mode === "post") {
                const post = await postModel.findOne({id: req.params.postId});
                if (!post) {
                    return res.status(404).json({
                        message: "Couldn't find post"
                    });
                }
                if (req.user._id.toString() !== blog.owner.toString() && req.user._id.toString() !== post.author.toString()) {
                    return res.status(403).json({
                        message: "Access denied"
                    });
                }
            }
            next();

        } catch(err) {
            next(err);
        }
    }
}


export default authWare
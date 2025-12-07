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
            const checkedResult = await User.findOne({username: req.body.username});
            if (checkedResult) {
                return false;
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
            return true;
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

            await User.findOneAndUpdate(
                {id: req.user.id},
                {$set: updateFields},
                {runValidators: true}
            );

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

export function permissionChecker(mode) {

    return async (req, res, next) => {
        try {
            const blog = await blogModel.findOne({blogSlug: req.params.blogSlug});
            if (!blog) {
                return res.status(404).json({
                    message: `Couldn't find blog. It dosen't exist`
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
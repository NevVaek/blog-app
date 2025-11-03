import {Router} from "express";
import {validateToken} from "../helpers/tokenHelper.js";
import {postWare, blogWare} from "../helpers/postHelper.js";
import {uploadBanner, uploadPostImages} from "../helpers/uploadHelper.js";

const blogRouter = Router();

blogRouter.get("/:blogName/posts", async(req, res, next) => {
    try {
        const postResult = await postWare("rAll", req);
        const blogResult = await blogWare("r", req)
        if (!postResult) {
            return res.status(404).json({
                message: `Couldn't find blog ${req.params.blogName}. It exists not`
            });
        }
        res.status(200).json({
            blogName: req.params.blogName,
            postCount: postResult.length,
            posts: postResult,
        });
    } catch (err) {
        next(err)
    }
});

blogRouter.get("/:blogName/posts/:postId", async(req, res, next) => {
    try {
        const result = await postWare("rOne", req);
        if (result === "noBlog") {
            return res.status(404).json({
                message: `Couldn't find blog ${req.params.blogName}. It exists not`
            });
        } else if (result === "noPost") {
            return res.status(404).json({
                message: `Couldn't find specified post in ${req.params.blogName}.`
            });
        }
        res.status(200).json({
            blogName: req.params.blogName,
            post: result,
        });
    } catch (err) {
        next(err);
    }
});

blogRouter.post("/:blogName/posts/new", validateToken, uploadPostImages.array("images", 5), async(req, res, next) => {
    try {
        const result = await postWare("w", req);
        if (!result) {
            throw new Error("Couldn't create new post");
        } else {
            res.status(201).json({
                message: "Post successful"
            });
        }
    } catch(err) {
        next(err);
    }
});

blogRouter.post("/create/new", validateToken, uploadBanner.single("banner"), async (req, res, next) => {
    try {
        const result = await blogWare("w", req);
        if (!result) {
            return res.status(409).json({
                message: "Blog name already taken"
            });
        }
        res.status(201).json({
            message: "Blog successfully created"
        });
    } catch (err) {
        next(err);
    }
});


export default blogRouter;
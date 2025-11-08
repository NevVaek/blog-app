import {Router} from "express";
import {validateToken} from "../helpers/tokenHelper.js";
import {postWare, blogWare} from "../helpers/postHelper.js";
import {permissionChecker} from"../helpers/authHelper.js";
import {uploadBanner, uploadPostImages} from "../helpers/uploadHelper.js";


const blogRouter = Router();

blogRouter.get("/:blogSlug/posts", async(req, res, next) => {
    try {
        const postResult = await postWare("rAll", req);
        const blogResult = await blogWare("r", req)
        if (!blogResult) {
            return res.status(404).json({
                message: `Couldn't find blog ${req.params.blogSlug}. It exists not`
            });
        }
        res.status(200).json({
            blog: blogResult,
            postCount: postResult.length,
            posts: postResult,
        });
    } catch (err) {
        next(err)
    }
});

blogRouter.get("/:blogSlug/posts/:postId", async(req, res, next) => {
    try {
        const result = await postWare("rOne", req);
        const result2 = await blogWare("r", req);
        if (result === "noBlog") {
            return res.status(404).json({
                message: `Couldn't find blog ${req.params.blogSlug}. It exists not`
            });
        } else if (result === "noPost") {
            return res.status(404).json({
                message: `Couldn't find specified post in ${req.params.blogSlug}.`
            });
        }
        res.status(200).json({
            blog: result2,
            post: result,
        });
    } catch (err) {
        next(err);
    }
});

blogRouter.post("/:blogSlug/posts/new", validateToken, permissionChecker("blog"), uploadPostImages.array("images", 5), async(req, res, next) => {
    try {
        const result = await postWare("w", req);
        if (!result) {
            return res.status(404).json({
                message: "Unknown blog name"
            })
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
        if (result === "exists") {
            return res.status(409).json({
                message: "Blog name already taken"
            });
        } else if (result === "forbidden") {
            return res.status(400).json({
                message: "Blog name can only contain letters, numbers, spaces, underscores, and hyphens."
            });
        }
        res.status(201).json({
            message: "Blog successfully created"
        });
    } catch (err) {
        next(err);
    }
});

blogRouter.patch("/create/update/:blogSlug", validateToken, permissionChecker("blog"), uploadBanner.single("banner"), async (req, res, next) => {
    try {
        const result = await blogWare("a", req)
        if (result === "noBlog") {
            return res.status(404).json({
                message: "Unknown blog name"
            });
        } else if (result === "empty") {
            return res.status(400).json({
                message: "Form empty"
            })
        } else if (result === "forbidden") {
            return res.status(400).json({
                message: "Blog name can only contain letters, numbers, spaces, underscores, and hyphens."
            });
        } else if (result === "exists") {
            return res.status(409).json({
                message: "Blog name already taken"
            });
        }
        res.status(200).json({
            message: "Post updated successfully"
        });
    } catch(err) {
        next(err);
    }
});

blogRouter.patch("/:blogSlug/posts/:postId/edit", validateToken, permissionChecker("post"), async (req, res, next) => {
    try {
        const result = await postWare("a", req);
        if (result === "noBlog") {
            return res.status(404).json({
                message: `Couldn't find blog. It doesn't exist.`
            });
        } else if (result === "noPost") {
            return res.status(404).json({
                message: `Couldn't find specified post.`
            });
        } else if (result === "exceedMax") {
            return res.status(400).json({
                message: "Number of uploaded files exceed limit"
            });
        }
        res.status(200).json({
            message: "Post updated successfully"
        });
    } catch(err) {
        next(err);
    }
})


export default blogRouter;
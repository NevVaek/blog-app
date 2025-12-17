import {Router} from "express";
import {validateToken} from "../helpers/tokenHelper.js";
import {postWare, blogWare} from "../helpers/postHelper.js";
import {permissionChecker} from"../helpers/authHelper.js";
import {uploadBanner, uploadPostImages} from "../helpers/uploadHelper.js";


const blogRouter = Router();

blogRouter.get("/blogs", async (req, res, next) => {
    try {
        const result = await blogWare("rMult", req);
        if (!result) {
            return res.status(200).json({
                count: 0,
                blogs: [],
            });
        }
        return res.status(200).json({
            count: result.length,
            blogs: result,
        });
    } catch (err) {
        next(err);
    }
});

blogRouter.get("/:blogSlug/posts", async(req, res, next) => {
    try {
        const blogResult = await blogWare("rOne", req)
        if (!blogResult) {
            return res.status(404).json({
                message: `Couldn't find blog ${req.params.blogSlug}. It exists not`
            });
        }

        const {posts, page, limit, totalPosts} = await postWare("rPagination", req);

        return res.status(200).json({
            blog: blogResult,
            posts: posts,
            postCount: totalPosts,
            page: page,
            pageCount: Math.ceil(totalPosts / limit),
        });
    } catch (err) {
        next(err)
    }
});

blogRouter.get("/:blogSlug", async(req, res, next) => {
    try {
        const blogResult = await blogWare("rOne", req)
        if (!blogResult) {
            return res.status(404).json({
                message: "Couldn't find blog. It doesn't exist"
            });
        }

        return res.status(200).json({
            blog: blogResult
        })
    } catch (err) {
        next(err);
    }
});

blogRouter.get("/:blogSlug/posts/:postId", async(req, res, next) => {
    try {
        const result = await blogWare("rOne", req);
        if (result === "noBlog") {
            return res.status(404).json({
                message: `Couldn't find blog ${req.params.blogSlug}. It exists not`
            });
        }
        const result2 = await postWare("rOne", req);
        if (result2 === "noPost") {
            return res.status(404).json({
                message: `Couldn't find specified post in ${req.params.blogSlug}.`
            });
        }
        return res.status(200).json({
            blog: result,
            post: result2,
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
            return res.status(201).json({
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
        return res.status(201).json({
            message: "Blog successfully created"
        });
    } catch (err) {
        next(err);
    }
});

blogRouter.post("/check/", async (req, res, next) => {
    try {
        const result = req.body.blogId ? await blogWare("rOneNameUpdate", req) : await blogWare("rOneNameNew", req);
        return res.status(200).json({
            result: !!result
        });
    } catch (err) {
        next(err);
    }
})

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
                message: "Blog name should only contain letters, numbers, spaces, underscores, and hyphens."
            });
        } else if (result === "exists") {
            return res.status(409).json({
                message: "Blog name already taken"
            });
        }
        return res.status(200).json({
            message: "Post updated successfully",
            newBlogSlug: result
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
        return res.status(200).json({
            message: "Post updated successfully"
        });
    } catch(err) {
        next(err);
    }
})

blogRouter.delete("/create/delete/:blogSlug", validateToken, permissionChecker("blog"), async (req, res, next) => {
    try {
        const result = await blogWare("d", req);

        if (result === "noBlog") {
            return res.status(404).json({
                message: "Unknown blog name"
            });
        }
        return res.status(200).json({
            message: "Blog deleted successfully"
        })
    } catch (err) {
        next(err);
    }
})

blogRouter.delete("/:blogSlug/posts/:postId/delete", validateToken, permissionChecker("post"), async (req, res, next) => {
    try {
        const result = await postWare("d", req);
        if (result === "noBlog") {
            return res.status(404).json({
                message: "Couldn't find blog. It doesn't exist."
            });
        } else if (result === "noPost") {
            return res.status(404).json({
                message: "Couldn't find specified post"
            });
        }

        return res.status(200).json({
            message: "Post deleted successfully"
        });
    } catch(err) {
        next(err);
    }
});

export default blogRouter;
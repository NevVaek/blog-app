import {Router} from "express";
import {validateToken} from "../helpers/tokenHelper.js";
import {uploadIcon} from "../helpers/uploadHelper.js";
import authWare from "../helpers/authHelper.js";
import User from "../dbModels/user.js";

const accountRouter = Router();

accountRouter.patch("/update/me", validateToken, uploadIcon.single("icon"), async (req, res, next) => {
    try {
        const result = await authWare("a", req);

        if (!result) {
            return res.status(400).json({
                message: "No valid fields provided for update"
            });
        }

        res.status(200).json({
            message: "User updated successfully"
        })
    } catch (err) {
        next(err);
    }
});

accountRouter.get("/me", validateToken, async (req, res) => {
    const user = await authWare("rId", req);
    res.json({
        username: user.username,
        email: user.email,
        icon: user.icon
    });
})

export default accountRouter;


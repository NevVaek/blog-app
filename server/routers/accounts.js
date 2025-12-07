import {Router} from "express";
import {validateToken, validateSessionToken} from "../helpers/tokenHelper.js";
import {uploadIcon} from "../helpers/uploadHelper.js";
import authWare, {fetchUserId} from "../helpers/authHelper.js";
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

        return res.status(200).json({
            message: "User updated successfully"
        })
    } catch (err) {
        next(err);
    }
});

accountRouter.get("/me", validateToken, async (req, res) => {
    const user = await authWare("rId", req);
    return res.status(200).json({
        username: user.username,
        email: user.email,
        icon: user.icon
    });
});

accountRouter.get("/session", async (req, res, next) => {
    const token = req.cookies?.access_token

    if (!token) {
        return res.json({loggedIn: false});
    }

    const checkResult = await validateSessionToken(token);
    if (!checkResult || !checkResult.id) return res.json({loggedIn: false});

    try {
     const userData = await authWare("rId", null, checkResult);

     return res.json({
        loggedIn: true,
        user: {
            id: userData.id,
            _id: userData._id,
            username: userData.username,
            email: userData.email,
            icon: userData.icon,
        }
     });
    } catch (err) {
        next(err);
    }



})

accountRouter.get("/check/:username", async (req, res, next) => {
    const result = await fetchUserId(req.params.username);
    return res.status(200).json({
        result: !!result
    });
});

export default accountRouter;


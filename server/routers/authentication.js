import {Router} from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import authWare from "../helpers/authHelper.js"
import {fetchUserId} from "../helpers/authHelper.js";
import {generateAccessToken} from "../helpers/tokenHelper.js";
import bcrypt from "bcrypt";

const authRouter = Router();

authRouter.post("/login/lgin", async (req, res, next) => {
    try {
        const result = await authWare("r", req);
        if (!result) {
            return res.status(401).json({
                message: "Wrong username or password"
            });
        }
        const matchResult = await bcrypt.compare(req.body.password, result.password);

        if (!matchResult) {
            return res.status(401).json({
                message: "Wrong username or password"
            });
        } else if (matchResult) {
            const userId = await fetchUserId(req.body.username);
            const accessToken = generateAccessToken({id: userId, username: req.body.username});
            res.cookie("access_token", accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 3 * 60 * 60 * 1000,
            });

            res.status(200).json({
                userId: result.id,
                message: "Login successful",
            });
        }
    } catch(err) {
        next(err);
    }
});

authRouter.post("/register/sinup", async (req, res, next) => {
    try {
        const result = await authWare("w", req);
        if (!result) {
            return res.status(409).json({
                message: "Username already exists"
            });
        }
        res.status(201).json({message: "Registration successful"});
    } catch (err) {
        next(err);
    }
});

authRouter.post("/logout", (req, res) => {
    res.clearCookie("access_token", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
    });
    res.status(200).json({message: "Logged out successfully"});
})

export default authRouter;
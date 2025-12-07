import {Router} from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import authWare from "../helpers/authHelper.js"
import {fetchUserId} from "../helpers/authHelper.js";
import {generateAccessToken} from "../helpers/tokenHelper.js";
import bcrypt from "bcrypt";

const authRouter = Router();
dotenv.config();

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
            const accessToken = generateAccessToken({id: result.id, _id: result._id});
            res.cookie("access_token", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",  //For production: set secure: true
                sameSite: "strict",
                maxAge: 3 * 60 * 60 * 1000,
            });

            return res.status(200).json({
                user: {
                    id: result.id,
                    _id: result._id,
                    username: result.username,
                    email: result.email,
                    icon: result.icon,
                }
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
        return res.status(201).json({message: "Registration successful"});
    } catch (err) {
        next(err);
    }
});

authRouter.post("/logout", (req, res, next) => {
    try {
        res.clearCookie("access_token", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        });
        return res.status(200).json({message: "Logged out successfully"});
    } catch (err) {
        next(err);
    }
});


export default authRouter;
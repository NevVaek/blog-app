import {Router} from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import authWare from "../helpers/authHelper.js"
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
            const accessToken = generateAccessToken({user: req.body.username});
            res.status(200).json({
                accessToken: accessToken,
                userId: result.id,
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

export default authRouter;
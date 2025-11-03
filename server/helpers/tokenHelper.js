import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


export function validateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader.split(" ")[1];

    if (!token) {
        res.status(400).json({
            message: "Login token not present. Please log in to continue"
        });
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                message: "Invalid credentials"
            });
        } else {
            req.user = user;
            next();
        }
    });
}

export function generateAccessToken(userInfo) {
    return jwt.sign(
        userInfo, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "1800s",
        }
    );
}
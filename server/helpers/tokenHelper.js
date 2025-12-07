import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


export function validateToken(req, res, next) {
    const token = req.cookies?.access_token || (req.headers["authorization"] && req.headers["authorization"].split(" ")[1]);

    if (!token) {
        return res.status(400).json({
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

export function validateSessionToken(token) {
    if (!token) {
        return false;
    }

    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) return resolve(false);
            return resolve(user);
        });
    });

}

export function generateAccessToken(userInfo) {
    return jwt.sign(
        userInfo, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "1800s",
        }
    );
}
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import {dbConfig} from "./db-config.js";
import authRouter from "./routers/authentication.js";
import blogRouter from "./routers/blogposts.js";
import accountRouter from "./routers/accounts.js";
import migrateBlogSlugs from "./scripts/migrateBlogSlugs.js";
import multer from "multer";

const app = express();
app.use(express.json());
app.use(helmet());
app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:5173", credentials: true,
}));

//If you want to adjust it cross-origin and allow cross-origin resource sharing
app.use((req, res, next) => {
  res.setHeader('cross-origin-resource-policy', 'cross-origin');
  next();
});

app.use("/auth", authRouter);
app.use("/", blogRouter);
app.use("/account/", accountRouter);
app.use("/uploads", express.static("./uploads"));

app.use((err, req, res, next) => {
     console.error(err.stack);

     if (err instanceof multer.MulterError) {   //Error handling for uploadHelper script
            if (err.message === "File too large") {
                return res.status(400).json({
                    message: "Image should be under 2MB"
                });
            }
        }

    return res.status(500).json({       // Handles all other errors that weren't caught
        message: "Internal server error. Please try again later"
    });
});

mongoose.connect(`mongodb://localhost:27017/${dbConfig.dbName}`)
    .then(() => {
        console.log("Connected to database");
        migrateBlogSlugs();
    }).catch(() => {
        console.log("Connection to database failed");
});

const port = 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));

export default app;
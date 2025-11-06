import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import {dbConfig} from "./db-config.js";
import authRouter from "./routers/authentication.js";
import blogRouter from "./routers/blogposts.js";
import migrateBlogSlugs from "./scripts/migrateBlogSlugs.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:5173", credentials: true,
}));

app.use("/auth", authRouter);
app.use("/", blogRouter);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Internal Server Error")
});

app.use("/uploads", express.static("../uploads"))

mongoose.connect(`mongodb://localhost:27017/${dbConfig.dbName}`)
    .then(() => {
        console.log("Connected to database");
        migrateBlogSlugs();
    }).catch(() => {
        console.log("Connection to database failed");
});

app.get("/api/posts", (req, res) => {
    res.json([{id: 1, title: "Hellow World", body: "This is a test post"}]);
});

const port = 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));

export default app;
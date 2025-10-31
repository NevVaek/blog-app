import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/posts", (req, res) => {
    res.json([{id: 1, title: "Hellow World", body: "This is a test post"}]);
});

const port = 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
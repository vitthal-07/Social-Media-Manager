import mongoose from "mongoose";
import express from "express";
import "dotenv/config";
import userRouter from "./routes/user.js";
import blogRouter from "./routes/blog.js";

const app = express();
app.use(express.json());

app.use("/api/blog", blogRouter);
app.use("/api/user", userRouter);

mongoose
    .connect(process.env.DB_URL)
    .then(() => {
        console.log("Connected to database");
        app.listen(process.env.PORT, () => {
            console.log(
                `Server is running on process.env.port ${process.env.PORT}`
            );
        });
    })
    .catch((err) => {
        console.error("Error connecting to database:", err);
    });

app.use("/", (req, res) => {
    res.send("Hello World");
});

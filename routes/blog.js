import express from "express";
import {
    getAllBlogs,
    addBlog,
    updateBlog,
    getBlogById,
    deleteBlog,
    getBlogsByUser,
} from "../controllers/blog.js";

const blogRouter = express.Router();

// Get all blogs
blogRouter.get("/", getAllBlogs);

// Get a blog by ID
blogRouter.get("/:id", getBlogById);

// Get blogs by user
blogRouter.get("/user/:id", getBlogsByUser);

// Add a new blog
blogRouter.post("/add", addBlog);

// Update a blog
blogRouter.put("/update/:id", updateBlog);

// Delete a blog
blogRouter.delete("/delete/:id", deleteBlog);

export default blogRouter;

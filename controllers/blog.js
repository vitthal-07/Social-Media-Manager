import mongoose from "mongoose";
import Blog from "../models/blog.js";
import User from "../models/user.js";

// Get all blogs
export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().exec();

        if (!blogs || blogs.length === 0) {
            return res.status(404).json({ message: "No blogs found!" });
        }

        res.status(200).json({ blogs });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error." });
    }
};

// Get a blog by ID
export const getBlogById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const blog = await Blog.findById(id).exec();

        if (!blog) {
            return res.status(404).json({ message: "Blog not found!" });
        }

        res.status(200).json({ blog });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error." });
    }
};

// Get blogs by user
export const getBlogsByUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const blogs = await Blog.find({ user: userId }).exec();

        if (!blogs || blogs.length === 0) {
            return res.status(404).json({ message: "No blogs found!" });
        }

        res.status(200).json({ blogs });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error." });
    }
};

// Add a new blog
export const addBlog = async (req, res, next) => {
    try {
        const { title, description, image, user } = req.body;
        const existingUser = await User.findById(user).exec();

        if (!existingUser) {
            return res.status(404).json({ message: "User not found!" });
        }

        const blog = new Blog({ title, description, image, user });
        const session = await mongoose.startSession();
        session.startTransaction();
        await blog.save();
        existingUser.blogs.push(blog);
        await existingUser.save();
        await session.commitTransaction();

        res.status(201).json({ message: "Blog added successfully!" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error." });
    }
};

// Update a blog
export const updateBlog = async (req, res, next) => {
    try {
        const blogId = req.params.id;
        const { title, description } = req.body;
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            { title, description },
            { new: true }
        ).exec();

        if (!blog) {
            return res.status(404).json({ message: "Blog not found!" });
        }

        res.status(200).json({ message: "Blog updated successfully!" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error." });
    }
};

// Delete a blog
export const deleteBlog = async (req, res) => {
    try {
        const id = req.params.id;
        const blog = await Blog.findByIdAndDelete(id).populate("user").exec();

        if (!blog) {
            return res.status(404).json({ message: "Blog not found!" });
        }

        await blog.user.blogs.pull(blog);
        await blog.user.save();

        res.status(200).json({ message: "Blog deleted successfully!" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error." });
    }
};

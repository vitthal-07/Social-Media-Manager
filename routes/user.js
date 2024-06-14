import express from "express";
import { getAllUsers, signup, login } from "../controllers/user.js";

const userRouter = express.Router();

// Get all users
userRouter.get("/", getAllUsers);

// Create a new user
userRouter.post("/signup", signup);

// Login a user
userRouter.post("/login", login);

export default userRouter;

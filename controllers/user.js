import User from "../models/user.js";
import bcrypt from "bcryptjs";

const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().exec();

        if (!users || users.length === 0) {
            return res.status(404).json({ message: "No users found!" });
        }

        res.status(200).json({ users });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const signup = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res
            .status(400)
            .json({ message: "Please provide all required fields." });
    }

    if (!validateEmail(email)) {
        return res.status(400).json({ message: "Invalid email." });
    }

    if (password.length < 8) {
        return res
            .status(400)
            .json({ message: "Password must be at least 8 characters." });
    }

    try {
        const existingUser = await User.findOne({ email }).exec();

        if (existingUser) {
            return res.status(400).json({ message: "User already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({
            name,
            email,
            password: hashedPassword,
            blogs: [],
        });

        await user.save();

        res.status(201).json({ message: "User created successfully." });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res
            .status(400)
            .json({ message: "Please provide email and password." });
    }

    try {
        const existingUser = await User.findOne({ email }).exec();

        if (!existingUser) {
            return res.status(404).json({ message: "User not found." });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            existingUser.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid password." });
        }

        res.status(200).json({ message: "Login successful" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

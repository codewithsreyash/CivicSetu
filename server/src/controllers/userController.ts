import { Request, Response } from "express";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/User";
import config from "../config/config";

// ---------- Types ----------
interface JwtPayload {
  id: string;
}

// Extend Express Request type (req.user)
interface AuthRequest extends Request {
  user?: {
    _id: mongoose.Types.ObjectId;
    role?: string;
  };
}

// ---------- Utils ----------
const generateToken = (id: string): string => {
  return (jwt as any).sign({ id }, config.jwtSecret, { expiresIn: '1d' });
};

 

// ---------- Controllers ----------

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, department } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || "citizen",
      ...(department && { department }),
    });

    if (user) {
      res.status(201).json({
        _id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        token: generateToken(String(user._id)),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error: any) {
    console.error("Register error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      token: generateToken(String(user._id)),
    });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      _id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
    });
  } catch (error: any) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    res.json({
      _id: String(updatedUser._id),
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      department: updatedUser.department,
      token: generateToken(String(updatedUser._id)),
    });
  } catch (error: any) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// @desc    Save Expo push token
// @route   POST /api/users/push-token
// @access  Private
export const savePushToken = async (req: AuthRequest, res: Response) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: "Push token is required" });
    }

    if (!req.user?._id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.pushToken = token;
    await user.save();

    res.status(200).json({ message: "Push token saved" });
  } catch (error: any) {
    console.error("Save push token error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await User.find({});
    res.json(
      users.map((u) => ({
        _id: String(u._id),
        name: u.name,
        email: u.email,
        role: u.role,
        department: u.department,
      }))
    );
  } catch (error: any) {
    console.error("Get users error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

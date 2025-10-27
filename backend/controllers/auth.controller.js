import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import { User } from "../models/user.model.js";
import { ENV } from "../lib/env.js";
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";

export const signup = async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format",
        error: "Invalid email format",
      });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        message: "Username is already taken",
        error: "Username is already taken",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long",
        error: "Password must be at least 8 characters long",
      });
    }

    const newUser = await User.create({ fullName, username, email, password });

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        email: newUser.email,
        followers: newUser.followers,
        following: newUser.following,
        profilePicture: newUser.profilePicture,
        coverPicture: newUser.coverPicture,
      });

      try {
        await sendWelcomeEmail(newUser.email, newUser.fullName, ENV.CLIENT_URL);
      } catch (error) {
        console.error("Error sending welcome email:", error);
      }
    } else {
      return res.status(400).json({
        message: "Invalid user data",
        error: "Invalid user data",
      });
    }
  } catch (error) {
    console.log("Error in signup authController:", error.message);
    return res.status(500).json({
      message: error.message || "Internal server error",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  res.send("User logged in");
  // const passwordMatch = await user.comparePassword(password);
};

export const logout = async (req, res) => {
  res.send("User logged out");
};

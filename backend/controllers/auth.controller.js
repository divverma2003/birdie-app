import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import User from "../models/user.model.js";
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

    const newUser = new User({
      fullName,
      username,
      email,
      password,
    });
    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);

      await newUser.save();

      res.status(201).json({
        message: "User registered successfully",
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
  try {
    // req body contains exactly a username and password
    // or a email and password

    const { username, email, password } = req.body;
    const identifier = username || email;

    if (!identifier || !password) {
      return res.status(400).json({
        message: "Please provide username/email and password",
        error: "Please provide username/email and password",
      });
    }

    let passwordMatch = false;
    let user;

    user = await User.findOne({ username });
    if (!user) user = await User.findOne({ email });

    if (user) passwordMatch = await user.comparePassword(password);

    if (!user) {
      return res.status(401).json({
        identifier,
        message: "Invalid user",
        error: "Invalid user",
      });
    }

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid password",
        error: "Invalid password",
      });
    }

    if (!user || !passwordMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
        error: "Invalid credentials",
      });
    }

    generateTokenAndSetCookie(user._id, res);
    return res.status(200).json({
      message: "Loggedn in successfully",
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      followers: user.followers,
      following: user.following,
      profilePicture: user.profilePicture,
      coverPicture: user.coverPicture,
    });
  } catch (error) {
    console.log("Error in login authController:", error.message);
    return res.status(500).json({
      message: error.message || "Internal server error",
      error: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    // Clear the JWT cookie and invalidate the token by setting its expiration to a past date
    res.cookie("JWT_Token", "", { maxAge: 0 });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout authController:", error.message);
    return res.status(500).json({
      message: error.message || "Internal server error",
      error: error.message,
    });
  }
};

export const getMe = async (req, res) => {
  try {
    // req.userId is set in the auth.middleware.js after verifying the JWT token
    // only select user fields except password
    const user = await User.findById(req.userId).select("-password");

    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getMe authController:", error.message);
    return res.status(500).json({
      message: error.message || "Internal server error",
      error: error.message,
    });
  }
};

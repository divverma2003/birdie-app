import User from "../models/user.model.js";
import { ENV } from "../lib/env.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.JWT_Token;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, ENV.JWT_TOKEN_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

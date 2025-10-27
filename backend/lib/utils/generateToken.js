import jwt from "jsonwebtoken";
import { ENV } from "../env.js";

export const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ id: userId }, ENV.JWT_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("JWT_Token", token, {
    secure: ENV.NODE_ENV !== "development",
    httpOnly: true, // prevent XSS attacks cross-site scripting attacks
    sameSite: "strict", // CSRF attacks cross-site request forgery attacks
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
};

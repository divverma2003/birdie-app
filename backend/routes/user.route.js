import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  getUserProfile,
  followUnfollowUser,
  updateUser,
  getSuggestedUsers,
} from "../controllers/user.controller.js";
const router = express.Router();

router.get("/suggested", protectRoute, getSuggestedUsers);
router.get("/profile/:username", protectRoute, getUserProfile);
router.post("/follow-unfollow/:id", protectRoute, followUnfollowUser);
router.post("/update", protectRoute, updateUser);

export default router;

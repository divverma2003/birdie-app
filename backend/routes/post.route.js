import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  createPost,
  deletePost,
  commentOnPost,
  getAllPosts,
  getLikedPosts,
  getUserPosts,
  getFollowingPosts,
  likeUnlikePost,
  updatePost,
  deleteComment,
} from "../controllers/post.controller.js";

const router = express.Router();

router.post("/create", protectRoute, createPost);
router.post("/comment/:id", protectRoute, commentOnPost);
router.post("/like/:id", protectRoute, likeUnlikePost);
router.delete("/:id", protectRoute, deletePost);
router.delete("/comment/:postId/:commentId", protectRoute, deleteComment);
router.put("/:id", protectRoute, updatePost);

router.get("/all", protectRoute, getAllPosts);
router.get("/following", protectRoute, getFollowingPosts);
router.get("/likes/:id", protectRoute, getLikedPosts);
router.get("/user/:username", protectRoute, getUserPosts);

export default router;

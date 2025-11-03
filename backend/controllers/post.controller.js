import { v2 as cloudinary } from "cloudinary";

import { ENV } from "../lib/env.js";

import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import Post from "../models/post.model.js";

export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let { img } = req.body;
    const userId = req.user._id.toString();

    let imgId;

    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found", error: "User not found" });

    if (!text && !img) {
      return res.status(400).json({
        message: "Post cannot be empty. Include text or an image.",
        error: "Post cannot be empty",
      });
    }

    if (img) {
      const uploadResponse = await cloudinary.uploader.upload(img);
      img = uploadResponse.secure_url;
      imgId = uploadResponse.public_id;
    }

    const newPost = new Post({
      user: userId,
      text,
      img,
      imgId,
    });

    await newPost.save();

    return res.status(201).json({
      message: "Post created successfully",
      post: newPost,
    });
  } catch (error) {
    console.log("Error in createPost postController:", error.message);
    return res.status(500).json({
      message: error.message || "Internal server error",
      error: error.message,
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        error: "Post not found",
      });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to delete this post",
        error: "Unauthorized",
      });
    }

    if (post.img) {
      await cloudinary.uploader.destroy(post.imgId);
    }

    await Post.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.log("Error in deletePost postController:", error.message);
    return res.status(500).json({
      message: error.message || "Internal server error",
      error: error.message,
    });
  }
};

export const commentOnPost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;

    if (!text) {
      return res.status(400).json({
        message: "Comment text is required",
        error: "Comment text is required",
      });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        error: "Post not found",
      });
    }
    const comment = { user: userId, text };
    post.comments.push(comment);
    await post.save();

    // send notification to post owner
    const notification = new Notification({
      from: userId,
      to: post.user,
      type: "comment",
    });
    await notification.save();

    return res.status(201).json({
      post,
    });
  } catch (error) {
    console.log("Error in commentOnPost postController:", error.message);
    return res.status(500).json({
      message: error.message || "Internal server error",
      error: error.message,
    });
  }
};

export const likeUnlikePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        error: "Post not found",
      });
    }
    const userLikedPost = post.likes.includes(userId);

    if (userLikedPost) {
      // unlike
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });

      const updatedLikes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );

      return res
        .status(200)
        .json({ message: "Post unliked successfully", updatedLikes });
    } else {
      // like
      post.likes.push(userId);
      await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
      await post.save();

      const notification = new Notification({
        from: userId,
        to: post.user,
        type: "like",
      });
      await notification.save();

      const updatedLikes = post.likes;

      return res
        .status(200)
        .json({ message: "Post liked successfully", updatedLikes });
    }
  } catch (error) {
    console.log("Error in likeUnlikePost postController:", error.message);
    return res.status(500).json({
      message: error.message || "Internal server error",
      error: error.message,
    });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      // latest posts first
      .sort({ createdAt: -1 })
      // populate user and comments user details with the actual objects excluding password
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    if (posts.length === 0) {
      return res.status(200).json({ message: "No posts found", data: [] });
    }

    return res
      .status(200)
      .json({ message: "Posts retrieved successfully.", posts });
  } catch (error) {
    console.log("Error in getAllPosts postController:", error.message);
    return res.status(500).json({
      message: error.message || "Internal server error",
      error: error.message,
    });
  }
};

export const getLikedPosts = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: "User not found",
      });
    }

    const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    return res.status(200).json({
      message: "Liked posts retrieved successfully.",
      likedPosts,
    });
  } catch (error) {
    console.log("Error in getLikedPosts postController:", error.message);
    return res.status(500).json({
      message: error.message || "Internal server error",
      error: error.message,
    });
  }
};

export const getFollowingPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: "User not found",
      });
    }

    // get the user ids that the user is following
    const followingUsers = user.following;

    // now use these ids to find posts that are made by these users
    const feedPosts = await Post.find({ user: { $in: followingUsers } })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    return res.status(200).json({
      message: "Following posts retrieved successfully.",
      feedPosts,
    });
  } catch (error) {
    console.log("Error in getFollowingPosts postController:", error.message);
    return res.status(500).json({
      message: error.message || "Internal server error",
      error: error.message,
    });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user)
      return res.status(404).json({
        message: "User not found",
        error: "User not found",
      });

    const posts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    return res.status(200).json({
      message: "User posts retrieved successfully.",
      posts,
    });
  } catch (error) {
    console.log("Error in getUserPosts postController:", error.message);
    return res.status(500).json({
      message: error.message || "Internal server error",
      error: error.message,
    });
  }
};

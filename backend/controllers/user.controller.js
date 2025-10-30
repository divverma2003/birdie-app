import { v2 as cloudinary } from "cloudinary";
import { ENV } from "../config/env.config.js";
import User from "../models/user.model.js";
import Notification from "../models/notifications.model.js";
import { sendEmailChangeNotification } from "../emails/emailHandlers.js";

export const getUserProfile = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username }).select("-password");
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found", error: "User not found" });

    return res.status(200).json({ user });
  } catch (error) {
    console.log("Error in getUserProfile userController:", error.message);
    return res.status(500).json({
      message: error.message || "Internal server error",
      error: error.message,
    });
  }
};

export const followUnfollowUser = async (req, res) => {
  try {
    // id is the id of the user to be followed/unfollowed
    const { id } = req.params;
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    if (id === req.user._id.toString()) {
      return res.status(400).json({
        message: "You cannot follow/unfollow yourself",
        error: "You cannot follow/unfollow yourself",
      });
    }

    if (!userToModify || !currentUser)
      return res.status(400).json({
        message: "User not found",
        error: "User not found",
      });

    const isFollowing = currentUser.following.includes(userToModify._id);

    // if following, then unfollow
    if (isFollowing) {
      // remove as follower from userToModify
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      // remove from following of currentUser
      await User.findByIfAndUpdate(req.user._id, {
        $pull: { following: userToModify._id },
      });
    } else {
      // if not following, then follow
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });

      // send notification to userToModify
      const newNotification = new Notification({
        type: "follow",
        from: req.user._id,
        to: userToModify._id,
      });

      await newNotification.save();

      return res
        .status(200)
        .json({ message: "User followed successfully", isFollowing: true });
    }
  } catch (error) {
    console.log("Error in followUnfollowUser userController:", error.message);
    return res.status(500).json({
      message: error.message || "Internal server error",
      error: error.message,
    });
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    const followingIds = user.following.map(
      (id) => new mongoose.Types.ObjectId(id)
    );

    const suggestedUsers = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId }, // exclude current user
          _id: { $nin: followingIds }, // exclude users already followed
        },
      },
      { $sample: { size: 4 } }, // random sample directly
      {
        $project: {
          password: 0, // exclude sensitive fields
        },
      },
    ]);

    return res.status(200).json(suggestedUsers);
  } catch (error) {
    console.log("Error in getSuggestedUsers userController:", error.message);
    return res.status(500).json({
      message: error.message || "Internal server error",
      error: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  const { fullName, email, username, currentPassword, newPassword, bio, link } =
    req.body;
  let { profilePicture, coverPicture } = req.body;
  const userId = req.user._id;

  try {
    let user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (
      (!newPassword && currentPassword) ||
      (newPassword && !currentPassword)
    ) {
      return res.status(400).json({
        message:
          "Both current and new passwords are required to change password",
        error: "Both current and new passwords are required to change password",
      });
    }

    if (currentPassword && newPassword) {
      if (newPassword.length < 8) {
        return res.status(400).json({
          message: "New password must be at least 8 characters long",
          error: "New password must be at least 8 characters long",
        });
      }
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(401).json({
          message: "Current password is incorrect",
          error: "Current password is incorrect",
        });
      }

      user.password = newPassword;

      if (profilePicture) {
        if (user.profilePicture) {
          await cloudinary.uploader.destroy(user.profilePictureId);
        }
      }
      const uploadProfilePicture = await cloudinary.uploader.upload(
        profilePicture
      );
      profilePicture = uploadProfilePicture.secure_url;
      user.profilePictureId = uploadProfilePicture.public_id; // for easy deletion later
    }

    if (coverPicture) {
      if (user.coverPicture) {
        await cloudinary.uploader.destroy(user.coverPictureId);
      }
      const uploadCoverPicture = await cloudinary.uploader.upload(coverPicture);
      coverPicture = uploadCoverPicture.secure_url;
      user.coverPictureId = uploadCoverPicture.public_id;
    }

    if (email && email !== user.email) {
      try {
        await sendEmailChangeNotification(
          user.email,
          user.fullName,
          user.username,
          ENV.CLIENT_URL
        );
      } catch (error) {
        console.error("Error sending email change notification:", error);
      }
    }

    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.profilePicture = profilePicture || user.profilePicture;
    user.coverPicture = coverPicture || user.coverPicture;
    await user.save();

    // todo: send email if email is changed
    return res.status(200).json({
      message: "User updated successfully",
      user: {
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        bio: user.bio,
        link: user.link,
        profilePicture: user.profilePicture,
        coverPicture: user.coverPicture,
      },
    });
  } catch (error) {
    console.log("Error in updateUser userController:", error.message);
    return res.status(500).json({
      message: error.message || "Internal server error",
      error: error.message,
    });
  }
};

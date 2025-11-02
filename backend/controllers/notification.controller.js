import Notification from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    /* const notifications = await Notification.find({ to: userId }).populate({
      path: "from",
      select: "username profilePicture",
    }); */

    await Notification.updateMany(
      { to: userId, read: false },
      { $set: { read: true } }
    );

    const notifications = await Notification.find({ to: userId }).populate({
      path: "from",
      select: "username profilePicture",
    });
    return res.status(200).json({
      message: "Notifications fetched successfully",
      notifications,
    });
  } catch (error) {
    console.log(
      "Error in getNotifications notificationController:",
      error.message
    );
    return res.status(500).json({
      message: error.message || "Internal server error",
      error: error.message,
    });
  }
};

export const deleteNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    await Notification.deleteMany({ to: userId });
    return res.status(200).json({
      message: "Notifications deleted successfully",
    });
  } catch (error) {
    console.log(
      "Error in deleteNotifications notificationController:",
      error.message
    );
    return res.status(500).json({
      message: error.message || "Internal server error",
      error: error.message,
    });
  }
};

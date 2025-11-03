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

// todo: delete single notification
export const deleteNotification = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user._id;

    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return res
        .status(404)
        .json({ message: "Notification not found", error: "Not found" });
    }

    if (notification.to.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "You are not authorized to delete this notification",
        error: "Unauthorized",
      });
    }
    await Notification.findByIdAndDelete(notificationId);
    return res
      .status(200)
      .json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.log(
      "Error in deleteNotification notificationController:",
      error.message
    );
    return res.status(500).json({
      message: error.message || "Internal server error",
      error: error.message,
    });
  }
};

import { ScheduledMessage } from "../models/scheduledMessage.model.js";

export const scheduleMessage = async (req, res) => {
  try {
    console.log("Incoming scheduled message", req.body);
    const { text, image, scheduledTime } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;

    if (!text && !image) {
      return res.status(400).json({ message: "Message content is empty." });
    }

    const scheduledMessage = new ScheduledMessage({
      senderId,
      receiverId,
      text,
      image,
      scheduledTime,
    });

    await scheduledMessage.save();

    return res.status(201).json({ message: "Message scheduled successfully" });
  } catch (error) {
    console.error("Schedule error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

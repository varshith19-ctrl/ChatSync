import dotenv from "dotenv";
dotenv.config();
import cloudinary from "../lib/cloudinary.js";
import { CohereClient } from "cohere-ai";

const cohere = new CohereClient({
  token: process.env.GEMINI_API_KEY,
});

import User from "../models/user.model.js";
import Message from "../models/message.model.js";

import { getReceiverSocketId, io } from "../lib/socket.js";
export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Errorin getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        {
          senderId: myId,
          receiverId: userToChatId,
        },
        {
          senderId: userToChatId,
          receiverId: myId,
        },
      ],
    });
    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller", error.message);
    res.status(500).json({ error: "Internal Server error" });
  }
};
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const myId = req.user._id;
    let imageUrl;
    if (image) {
      //base 64 image
      const updloadResponse = await cloudinary.uploader.upload(image);
      imageUrl = updloadResponse.secure_url;
    }
    const newMessage = new Message({
      senderId: myId,
      receiverId,
      text,
      image: imageUrl,
    });
    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller", error.message);
    res.status(404).json({ message: "Internal Server error" });
  }
};

export const summarizeMessages = async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Invalid or empty messages." });
  }

  const cleanedMessages = messages.filter(
    (m) => typeof m === "string" && m.trim() !== ""
  );

  if (cleanedMessages.length === 0) {
    return res
      .status(400)
      .json({ error: "All messages are empty or invalid." });
  }

  try {
    const response = await cohere.summarize({
      text: cleanedMessages.join("\n"),
      model: "command",
      length: "short", // short, medium, long
      format: "paragraph", // paragraph | bullet
      temperature: 1, // less randomness
      extractiveness: "low", // low, medium, high
    });

res.json({ summary: response.summary });
  } catch (error) {
    console.error("Cohere summarization error:", error);
    res.status(500).json({
      error: "Failed to summarize messages.",
      details: error.message || "Unknown error",
    });
  }
};

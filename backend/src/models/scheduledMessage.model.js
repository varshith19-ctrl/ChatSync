import mongoose from "mongoose";

const ScheduledMessageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: String,
  image: String,
  scheduledTime: { type: Date, required: true },
});

export const ScheduledMessage = mongoose.model(
  "ScheduledMessage",
  ScheduledMessageSchema
);

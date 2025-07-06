// src/lib/scheduler.js
import cron from "node-cron";
import { ScheduledMessage } from "../models/scheduledMessage.model.js";
import Message from "../models/message.model.js";
import { io, getReceiverSocketId } from "./socket.js";

export const startScheduler = () => {
  cron.schedule("* * * * *", async () => {
    const now = new Date();

    const messages = await ScheduledMessage.find({
      scheduledTime: { $lte: now },
    });

    for (let msg of messages) {
      const savedMessage = await Message.create({
        senderId: msg.senderId,
        receiverId: msg.receiverId,
        text: msg.text,
        image: msg.image,
        createdAt: new Date(),
      });

      const receiverSocketId = getReceiverSocketId(msg.receiverId.toString());
      const senderSocketId = getReceiverSocketId(msg.senderId.toString());

      // Debugging
      console.log("🟢 Emitting scheduled message to:");
      console.log("Receiver:", receiverSocketId);
      console.log("Sender  :", senderSocketId);

      // ✅ Emit to both receiver and sender
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", savedMessage);
      }
      if (senderSocketId) {
        io.to(senderSocketId).emit("newMessage", savedMessage);
      }

      await ScheduledMessage.findByIdAndDelete(msg._id);
    }
  });

  console.log("⏰ Scheduler running every minute");
};

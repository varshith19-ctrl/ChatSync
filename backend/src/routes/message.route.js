import express from "express";
import { ScheduledMessage } from "../models/scheduledMessage.model.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { markMessagesAsRead } from "../controllers/message.controller.js";

import {
  getMessages,
  getUsersForSidebar,
  sendMessage,
  summarizeMessages,
} from "../controllers/message.controller.js";
import { scheduleMessage } from "../controllers/scheduled.controller.js";
const router = express.Router();

router.get("/user", protectRoute, getUsersForSidebar);
router.post("/schedule/:id", protectRoute, scheduleMessage);
router.get("/:id", protectRoute, getMessages);

router.post("/send/:id", protectRoute, sendMessage);
router.post("/summarize", protectRoute, summarizeMessages);
router.post("/markAsRead/:id", protectRoute, markMessagesAsRead);


export default router;

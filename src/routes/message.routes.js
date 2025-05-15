import express from"express"
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessages, GetUsersForSidebar, sendMessage } from "../controllers/message.controller.js";

const router=express.Router();
 
router.get("/users",protectRoute,GetUsersForSidebar);
router.get("_id",protectRoute,getMessages);

router.post("/send/:id", protectRoute, sendMessage);


export default router;
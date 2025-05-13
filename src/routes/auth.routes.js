import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js"
import { login, logout, signup, updateProfile } from "../controllers/auth.controller.js"
const router=express.Router()
router.post("/signup",signup)
router.post("/login",login) 
router.post("/logout",logout)
router.put("/updateprofile",protectRoute,updateProfile)
export { router as authRoutes} 
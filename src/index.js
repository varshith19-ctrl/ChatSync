import express from 'express'
import dotenv from 'dotenv'
import { authRoutes } from "./routes/auth.routes.js"  
import  messageRoutes  from "./routes/message.routes.js"  
import connectDB from './lib/db.js'
import cors from "cors"
dotenv.config({
    path:"./.env"
}) 
const app=express()


app.listen( process.env.PORT || 3000 ,()=>{
    console.log(`server is running on port ${process.env.PORT}`);
    connectDB()
})
app.use(express.json())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use("/api/auth",authRoutes)
app.use("/api/message",messageRoutes)


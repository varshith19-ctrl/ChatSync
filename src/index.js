import express from 'express'
import dotenv from 'dotenv'
import { authRoutes } from "./routes/auth.routes.js"  
import connectDB from './lib/db.js'
dotenv.config({
    path:"./.env"
}) 
const app=express()


app.listen( process.env.PORT || 3000 ,()=>{
    console.log(`server is running on port ${process.env.PORT}`);
    connectDB()
})
app.use(express.json())
app.use("/api/auth",authRoutes)


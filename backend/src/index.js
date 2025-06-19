import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import cors from "cors";
import path from "path";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();
app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ limit: "500mb", extended: true }));
app.use(
  cors({
    origin: true, // Dynamically allow any origin that makes the request
    credentials: true,
  })
);

app.use(cookieParser());
console.log("✅ Checking authRoutes type:", typeof authRoutes);
console.log("✅ Checking messageRoutes type:", typeof messageRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
import fs from "fs";

if (process.env.NODE_ENV === "production") {
  const distPath = path.join(__dirname, "../frontend/dist");
  const indexPath = path.join(distPath, "index.html");

  app.use(express.static(distPath));

  app.get("/*", (req, res) => {
    res.sendFile(indexPath);
  });
}

server.listen(PORT, () => {
  console.log(`Server is running at port ` + PORT);
  connectDB();
});

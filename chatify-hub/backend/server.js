import express from "express";
import cors from "cors";
import authRoutes from "./src/routes/auth.route.js";
import messageRoutes from "./src/routes/message.route.js";
import path from "path";
import { ENV } from "./src/lib/env.js";
import cookieParser from "cookie-parser";
import { connectDb } from "./src/lib/db.js";
import { app, server } from "./src/lib/socket.js";
const __dirname = path.resolve();

const port = ENV.PORT || 3000;

app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Make ready for deployment
// Make ready for deployment
if (ENV.NODE_ENV === "production") {
  // Frontend ka static folder serve karein
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  // Kisi bhi route ke liye React ka index.html bhejein
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"));
  });
} else {
  // Yeh sirf Local development me dikhega
  app.get("/", (req, res) => {
    res.send("API is Running Successfully in Local Environment");
  });
}

connectDb()
  .then(() => {
    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.log(`Failed to connect to MongoDB: ${error}`);
    process.exit(1);
  });

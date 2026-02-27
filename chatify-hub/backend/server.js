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


if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"));
  });
} else {
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

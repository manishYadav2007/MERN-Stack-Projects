import express from "express";
import authRoutes from "./src/routes/auth.route.js";
import messageRoutes from "./src/routes/message.route.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});

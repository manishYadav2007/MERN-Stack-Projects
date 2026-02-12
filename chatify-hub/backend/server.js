import express from "express";
import authRoutes from "./src/routes/auth.route.js";
import messageRoutes from "./src/routes/message.route.js";
import path from "path";
import dotenv from "dotenv";

const app = express();
dotenv.config();

const __dirname = path.resolve();

const port = process.env.PORT || 3000;

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

// Make ready for deployment
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

app.listen(port, () => {
  console.log(`Server is running on port 3000`);
});


import express from "express";
import authRoutes from "./src/routes/auth.route.js";
import messageRoutes from "./src/routes/message.route.js";
import path from "path";
import { ENV } from "./src/lib/env.js";
import cookieParser from "cookie-parser";
import { connectDb } from "./src/lib/db.js";

const app = express();

const __dirname = path.resolve();

const port = ENV.PORT || 3000;

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

// Make ready for deployment
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

app.get("/", (req, res) => {
  res.send("API is Running Successfully");
});

connectDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.log(`Failed to connect to MongoDB: ${error}`);
    process.exit(1);
  });

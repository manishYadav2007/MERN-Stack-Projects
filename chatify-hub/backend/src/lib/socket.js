import { Server } from "socket.io";
import http from "http";
import express from "express";
import { ENV } from "./env.js";
import { createSocketAuthMiddleware } from "../middleware/socket.auth.middleware.js";
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [ENV.CLIENT_URL],
    credentials: true,
    methods: ["GET", "POST"],
  },
});

// apply auth middleware to all sockets connections

io.use(createSocketAuthMiddleware);

export const getReceiverSocketId = (userId) => userSockets[userId];

// store online users
const userSockets = {};

io.on("connection", (socket) => {
  console.log(`A user connected: ${socket.user.fullName}`);

  const userId = socket.user._id;
  userSockets[userId] = socket.id;

  io.emit("onlineUsers", Object.keys(userSockets));

  socket.on("disconnect", () => {
    console.log(`user disconnected: ${socket.user.fullName}`);
    delete userSockets[userId];
    io.emit("onlineUsers", Object.keys(userSockets));
  });
});

export { io, server, app };

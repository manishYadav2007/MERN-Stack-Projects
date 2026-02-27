import jwt from "jsonwebtoken";
import { userModel } from "../models/user.model.js";
import { ENV } from "../lib/env.js";

export const createSocketAuthMiddleware = async (socket, next) => {
  try {
    const cookieHeader = socket.handshake.headers.cookie;
    if (!cookieHeader) {
      console.log("Socket connection rejected: No cookie header");
      return next(new Error("Unauthorized - No Cookie Header"));
    }
    const token = socket.handshake.headers.cookie
      ?.split("; ")
      .find((row) => row.startsWith("jwt_token="))
      ?.split("=")[1];

    if (!token) {
      console.log("Socket connection rejected: No token provided");
      return next(new Error("Unauthorized - No Token Provided"));
    }

    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    if (!decoded || !decoded.userId) {
      console.log("Socket connection rejected: Invalid token");
      return next(new Error("Unauthorized - Invalid Token"));
    }

    // find the user fromdb
    const user = await userModel.findById(decoded.userId).select("-password");
    if (!user) {
      console.log("Socket connection rejected: User not found");
      return next(new Error("User not found"));
    }

    socket.user = user;
    socket.userId = user._id.toString();
    console.log(
      `Socket authenticated for user: ${user.fullName} (${user._id})`,
    );

    next();
  } catch (error) {
    console.log(`Error in socket authentication: ${error.message}`);
    next(new Error("Unauthorized - Authentication Failed"));
  }
};

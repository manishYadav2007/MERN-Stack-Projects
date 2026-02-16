import { userModel } from "../models/user.model.js";
import { ENV } from "../lib/env.js";
import jwt from "jsonwebtoken";
export const authRouteMiddleware = async (request, response, next) => {
  try {
    const token = request.cookies.jwt_token;
    if (!token) {
      return response
        .status(401)
        .json({ message: "Unauthorized - No token provided" });
    }
    const decoded = jwt.verify(token, ENV.JWT_SECRET);

    if (!decoded)
      return response
        .status(401)
        .json({ message: "Unauthorized - Invalid token" });

    const user = await userModel.findById(decoded.userId);
    if (!user) {
      return response
        .status(401)
        .json({ message: "Unauthorized - User not found" });
    }

    request.user = user;
    next();
  } catch (error) {
    console.log(`Error in ProtectedRoute middleware: ${error}`);
    response.status(500).json({ message: "Internal Server Error" });
    
  }
};

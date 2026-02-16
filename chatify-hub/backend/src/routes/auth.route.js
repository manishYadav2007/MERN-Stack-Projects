import express, { request } from "express";
import {
  signUp,
  login,
  logout,
  updateProfile,
} from "../controllers/auth.controller.js";
import { authRouteMiddleware } from "../middleware/auth.middleware.js";

const route = express.Router();

route.post("/signup", signUp);

route.post("/login", login);

route.post("/logout", logout);
route.put("/update-profile", authRouteMiddleware, updateProfile);
route.get("/verify", authRouteMiddleware, (request, response) =>
  response.status(200).json(request.user),
);

export default route;

import express from "express";
import { signUp, login, logout } from "../controllers/auth.controller.js";

const route = express.Router();

route.post("/signup", signUp);

route.post("/login", login);

route.post("/logout", logout);

export default route;

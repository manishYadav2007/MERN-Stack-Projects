import express from "express";
import { signUp } from "../controllers/auth.controller.js";

const route = express.Router();

route.post("/signup", signUp);

route.get("/login", (request, response) => {
  response.send("Login API Endpoint");
});

route.get("/logout", (request, response) => {
  response.send("Logout API Endpoint");
});

export default route;

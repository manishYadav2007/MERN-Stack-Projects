import express from "express";

const route = express.Router();

route.get("/signup", (request, response) => {
  response.send("Signup API Endpoint");
});

route.get("/login", (request, response) => {
  response.send("Login API Endpoint");
});

route.get("/logout", (request, response) => {
  response.send("Logout API Endpoint");
});

export default route;

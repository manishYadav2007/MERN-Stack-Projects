import express from "express";

const route = express.Router();

route.get("/send", (request, response) => {
  response.send("Send Message API Endpoint");
});

export default route;

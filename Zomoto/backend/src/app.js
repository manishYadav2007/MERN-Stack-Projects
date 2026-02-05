// Create Server

const express = require("express");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.routes");
const foodRoutes = require("./routes/food.routes");

const app = express();
app.use(cookieParser());
app.use(express.json());

app.get("/", (request, response) => {
  response.send("Hello World");
});

// auth route
app.use("/api/auth", authRoutes);

// food route
app.use("/api/food", foodRoutes);

module.exports = app;

// const userModel = require("../models/user.model")
const userModel = require("../models/user.model");
const foodPartnerModel = require("../models/foodPartner.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register User
const registerUser = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    const isUserAlreadyExist = await userModel.findOne({ email });
    
    if (isUserAlreadyExist) {
      return res.status(400).json({ message: "User already exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      fullName,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET_KEY,
    );

    res.cookie("token", token);

    res.send(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login User

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET_KEY,
    );

    res.cookie("token", token);

    res.status(200).json({
      message: "User logged in successfully",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Logout Register user
const logoutUser = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "User logged out successfully" });
};

// Register Food Partner
const registerFoodPartner = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const isFoodPartnerAlreadyExist = await foodPartnerModel.findOne({ email });

    if (isFoodPartnerAlreadyExist) {
      res.send(400).json({ message: "Food Partner already exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const foodPartner = await foodPartnerModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      {
        id: foodPartner._id,
      },
      process.env.JWT_SECRET_KEY,
    );
    res.cookie("token", token);

    res.status(201).json({
      message: "Food Partner registered successfully",
      foodPartner: {
        _id: foodPartner._id,
        name: foodPartner.name,
        email: foodPartner.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login Food Partner

const loginFoodPartner = async (req, res) => {
  const { email, password } = req.body;

  try {
    const foodPartner = await foodPartnerModel.findOne({ email });

    if (!foodPartner) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordMatched = await bcrypt.compare(
      password,
      foodPartner.password,
    );

    if (!isPasswordMatched) {
      res.send(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        id: foodPartner._id,
      },
      process.env.JWT_SECRET_KEY,
    );

    res.cookie("token", token);

    res.status(200).json({
      message: "Food Partner logged in successfully",
      foodPartner: {
        _id: foodPartner._id,
        name: foodPartner.name,
        email: foodPartner.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Logout Food Partner

const logoutFoodPartner = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Food Partner logged out successfully" });
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  registerFoodPartner,
  loginFoodPartner,
  logoutFoodPartner,
};

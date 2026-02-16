import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import { userModel } from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";
import bcrypt from "bcrypt";
import { ENV } from "../lib/env.js";
import { cloudinaryConfig } from "../services/cloudinary.service.js";

const signUp = async (request, response) => {
  const { fullName, email, password } = request.body;

  try {
    if (!fullName || !email || !password) {
      return response.status(400).json({
        message: "Please provide all the required fields",
      });
    }

    if (password.length < 6) {
      return response.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return response.status(400).json({
        message: "Please provide a valid email address",
      });
    }

    const user = await userModel.findOne({ email });
    if (user)
      return response.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      const savedUser = await newUser.save();
      generateToken(savedUser._id, response);
      response.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });

      // send a welcome email

      try {
        await sendWelcomeEmail(
          savedUser.email,
          savedUser.fullName,
          ENV.CLIENT_URL,
        );
      } catch (error) {
        console.log(`Error sending welcome email: ${error}`);
      }
    } else {
      response.status(400).json({
        message: "Invalid user data",
      });
    }
  } catch (error) {
    console.log(`Error in signup controller: ${error}`);
    response.status(500).json({
      message: "Internal server error",
    });
  }
};

const login = async (request, response) => {
  const { password, email } = request.body;
  if (!email || !password)
    return response
      .status(400)
      .json({ message: "Email and password required" });

  try {
    const user = await userModel.findOne({ email });
    if (!user)
      return response.status(400).json({ message: "Invalid credentials" });
    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched)
      return response.status(400).json({
        message: "Invalid credentials",
      });

    generateToken(user._id, response);
    response.status(200).json({
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.error(`Error in login controller: ${error}`);
    response.status(500).json({
      message: "Internal server error",
    });
  }
};
const logout = async (_, response) => {
  response.cookie("jwt_token", "", { maxLimit: 0 });
  response.status(200).json({ message: "Logged out successfully" });
};

const updateProfile = async (request, response) => {
  try {
    const { profilePic } = request.body;
    const userId = request.user._id;

    const uploadImage = await cloudinaryConfig.uploader.upload(profilePic);

    const updatedUser = await userModel
      .findByIdAndUpdate(
        userId,
        { profilePic: uploadImage.secure_url },
        { new: true },
      )
      .select("-password");

    response.status(200).json({
      message: "Profile picture updated successfully",
      updatedUser: updatedUser,
    });
  } catch (error) {
    console.error(`Error in updateProfile controller: ${error}`);
    response.status(500).json({
      message: "Internal server error",
    });
  }
};

export { signUp, login, logout, updateProfile };

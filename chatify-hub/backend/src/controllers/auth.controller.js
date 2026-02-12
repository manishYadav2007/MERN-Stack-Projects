import { userModel } from "../models/user.model.js";
import bcrypt from "bcrypt";

export const signUp = async (request, response) => {
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

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel.create({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser._id, response);
      await newUser.save();
      response.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
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

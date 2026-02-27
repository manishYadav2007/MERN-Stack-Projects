import { userModel } from "../models/user.model.js";

import { messageModel } from "../models/message.model.js";
import { cloudinaryConfig } from "../services/cloudinary.service.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getAllContacts = async (request, response) => {
  try {
    const loggedInUserId = request.user._id;

    const filteredUsers = await userModel
      .find({ _id: { $ne: loggedInUserId } })
      .select("-password");

    response.status(200).json(filteredUsers);
  } catch (error) {
    console.log(`Error in getAllContacts: ${error}`);
    response.status(500).json({ error: "Internal Server Error" });
  }
};

export const getMessagesByUserId = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const { id: userToChatId } = req.params; // Get the userToChatId from the request parameters

    const messages = await messageModel.find({
      $or: [
        { senderId: loggedInUserId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: loggedInUserId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log(`Error in getMessagesByUserId: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;

    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    if (!text && !image) {
      return res
        .status(400)
        .json({ error: "Message text or image is required" });
    }

    if (senderId.equals(receiverId)) {
      return res.status(400).json({ error: "Cannot send message to yourself" });
    }

    const receiverExists = await userModel.findById(receiverId);
    if (!receiverExists) {
      return res.status(404).json({ error: "Receiver not found" });
    }

    let imageUrl;

    if (image) {
      const uploadImage = await cloudinaryConfig.uploader.upload(image);
      imageUrl = uploadImage.secure_url;
    }

    const newMessage = new messageModel({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
  } catch (error) {
    console.log(`Error in sendMessage: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getChatPartners = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const messages = await messageModel.find({
      $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
    });

    const chatPartnersIds = [
      ...new Set(
        messages.map((message) =>
          message.senderId.toString() === loggedInUserId.toString()
            ? message.receiverId.toString()
            : message.senderId.toString(),
        ),
      ),
    ];

    const chatPartners = await userModel
      .find({
        _id: { $in: chatPartnersIds },
      })
      .select("-password");

    res.status(200).json(chatPartners);
  } catch (error) {
    console.log(`Error in getChatPartners: ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const foodModel = require("../models/food.model");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const storageService = require("../services/filestorage.service");

const createFood = async (request, response) => {
  try {
    if (!request.file) {
      return response.status(400).json({
        message: "File upload failed!",
      });
    }

    const uploadResult = await storageService.uploadFile(
      request.file.path,
      `food-${uuidv4()}`,
    );

    const newFood = new foodModel({
      name: request.body.name,
      description: request.body.description,
      video: uploadResult.url,
      foodPartner: request.foodPartner._id,
    });
    await newFood.save();

    response.status(201).json({
      message: "Food created successfully",
      food: newFood,
    });
  } catch (error) {
    if (request.file) fs.unlinkSync(request.file.path);
    response.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getFoodItems = async (request, response) => {
  const foodItems = await foodModel.find({});

  response.status(200).json({
    message: "Food items fetched successfully",
    foodItems: foodItems, 
  });
};

module.exports = {
  createFood,
  getFoodItems,
};

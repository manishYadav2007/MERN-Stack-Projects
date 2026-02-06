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
    console.log(uploadResult);

    const newFood = new foodModel({
      name: request.body.name,
      description: request.body.description,
      video: uploadResult.url,
      partnerId: request.foodPartner._id,
    });
    console.log(newFood);
    await newFood.save();
  } catch (error) {
    if (request.file) fs.unlinkSync(request.file.path);
    response.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  createFood,
};

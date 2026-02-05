const foodModel = require("../models/food.model");

const createFood = async (request, response) => {
  const foodPartner = request.foodPartner;
  console.log(foodPartner);
  console.log(request.body);
  console.log(request.file);

  response.send("New food created successfully...");
};

module.exports = {
  createFood,
};

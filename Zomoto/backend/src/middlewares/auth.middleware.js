const foodPartnerModel = require("../models/foodPartner.model");
const jwt = require("jsonwebtoken");

const authFoodPartnerMiddleware = async (request, response, next) => {
  const token = request.cookies.token;
  if (!token) {
    return response.status(401).json({
      message: "Unauthorized access",
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const foodPartner = await foodPartnerModel.findById(decoded.id);
    request.foodPartner = foodPartner;
    next();
  } catch (error) {
    response.status(401).json({
      message: "Invalid token",
    });
  }
};

module.exports = {
  authFoodPartnerMiddleware,
};

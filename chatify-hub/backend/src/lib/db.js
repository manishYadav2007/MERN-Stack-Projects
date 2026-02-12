import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    const dbConnection = await mongoose.connect(process.env.MONGODB_URL);
    console.log(`MONGODB CONNECTED: ${dbConnection.connection.host}`);
  } catch (error) {
    console.log(error.message);
    process.exit(1); 
  }
};

import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDb = async () => {
  try {
    const { MONGODB_URL } = ENV;
    if (!MONGODB_URL) throw new Error("MONGODB_URL is not defined");
    const dbConnection = await mongoose.connect(ENV.MONGODB_URL);
    console.log(`MONGODB CONNECTED: ${dbConnection.connection.host}`);
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

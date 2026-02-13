import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    const { MONGODB_URL } = process.env;
    if (!MONGODB_URL) throw new Error("MONGODB_URL is not defined");
    const dbConnection = await mongoose.connect(process.env.MONGODB_URL);
    console.log(`MONGODB CONNECTED: ${dbConnection.connection.host}`);
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

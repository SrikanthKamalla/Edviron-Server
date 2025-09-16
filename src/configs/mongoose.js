import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "DataBase",
    });
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err.message);
  }
};

export default connectDB;

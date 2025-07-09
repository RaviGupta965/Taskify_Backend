import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()
let isConnected = false;
const connectDB = async () => {
  try {
    if(isConnected) return;
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected");
    isConnected=true;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1); // Exit with failure
  }
};

export default connectDB;
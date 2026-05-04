import mongoose from "mongoose";
import dotenv from "dotenv";
import { MongoMemoryServer } from "mongodb-memory-server";

dotenv.config();

let mongod = null;

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.log("No MONGO_URI provided, starting in-memory MongoDB...");
      mongod = await MongoMemoryServer.create();
      mongoUri = mongod.getUri();
    }
    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;

import mongoose from "mongoose";
import { config } from "./env.js";

export async function connectDB(): Promise<void> {
  await mongoose.connect(config.mongodbUri);
  console.log("Connected to MongoDB");
}

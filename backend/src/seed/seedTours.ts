import { config } from "../config/env.js";
import { connectDB } from "../config/db.js";
import Tour from "../models/Tour.js";
import { TOUR_SEED_DATA } from "./tourData.js";
import mongoose from "mongoose";

async function seed() {
  await connectDB();

  for (const tourData of TOUR_SEED_DATA) {
    await Tour.findOneAndUpdate({ tourId: tourData.tourId }, tourData, {
      upsert: true,
      new: true,
    });
  }

  console.log(`Seeded ${TOUR_SEED_DATA.length} tours into MongoDB.`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});

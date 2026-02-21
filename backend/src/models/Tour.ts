import mongoose, { Schema, type Document } from "mongoose";

export interface ITour extends Document {
  tourId: string;
  name: string;
  location: string;
  description: string;
  duration: string;
  priceUsd: number;
  availableDates: string[];
  maxParticipants: number;
  imageUrl: string;
}

const TourSchema = new Schema<ITour>(
  {
    tourId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    location: { type: String, required: true, index: true },
    description: { type: String, required: true },
    duration: { type: String, required: true },
    priceUsd: { type: Number, required: true },
    availableDates: { type: [String], required: true },
    maxParticipants: { type: Number, required: true },
    imageUrl: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        ret.id = ret.tourId;
        ret.price_usd = ret.priceUsd;
        ret.available_dates = ret.availableDates;
        ret.max_participants = ret.maxParticipants;
        ret.image_url = ret.imageUrl;
        delete ret._id;
        delete ret.__v;
        delete ret.tourId;
        delete ret.priceUsd;
        delete ret.availableDates;
        delete ret.maxParticipants;
        delete ret.imageUrl;
        delete ret.createdAt;
        delete ret.updatedAt;
        return ret;
      },
    },
  }
);

TourSchema.index({ name: "text", location: "text", description: "text" });

export default mongoose.model<ITour>("Tour", TourSchema);

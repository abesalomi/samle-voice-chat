import mongoose, { Schema, type Document } from "mongoose";

export interface IBooking extends Document {
  bookingId: string;
  tourId: string;
  tourName: string;
  location: string;
  selectedDate: string;
  numParticipants: number;
  customerName: string;
  customerEmail: string;
  totalPriceUsd: number;
  status: "pending" | "confirmed" | "cancelled";
}

const BookingSchema = new Schema<IBooking>(
  {
    bookingId: { type: String, required: true, unique: true, index: true },
    tourId: { type: String, required: true, index: true },
    tourName: { type: String, required: true },
    location: { type: String, required: true },
    selectedDate: { type: String, required: true },
    numParticipants: { type: Number, required: true, min: 1 },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    totalPriceUsd: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "confirmed",
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        ret.id = ret.bookingId;
        ret.tour_id = ret.tourId;
        ret.tour_name = ret.tourName;
        ret.selected_date = ret.selectedDate;
        ret.num_participants = ret.numParticipants;
        ret.customer_name = ret.customerName;
        ret.customer_email = ret.customerEmail;
        ret.total_price_usd = ret.totalPriceUsd;
        delete ret._id;
        delete ret.__v;
        delete ret.bookingId;
        delete ret.tourId;
        delete ret.tourName;
        delete ret.selectedDate;
        delete ret.numParticipants;
        delete ret.customerName;
        delete ret.customerEmail;
        delete ret.totalPriceUsd;
        delete ret.createdAt;
        delete ret.updatedAt;
        return ret;
      },
    },
  }
);

export default mongoose.model<IBooking>("Booking", BookingSchema);

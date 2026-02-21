import { v4 as uuidv4 } from "uuid";
import Booking, { type IBooking } from "../models/Booking.js";
import { getTourById } from "./tourService.js";

export async function getAllBookings(): Promise<IBooking[]> {
  return Booking.find().sort({ createdAt: -1 });
}

export async function createBooking(data: {
  tourId: string;
  selectedDate: string;
  numParticipants: number;
  customerName: string;
  customerEmail: string;
}): Promise<IBooking | null> {
  const tour = await getTourById(data.tourId);
  if (!tour || !tour.availableDates.includes(data.selectedDate)) return null;

  const booking = await Booking.create({
    bookingId: `booking-${uuidv4().slice(0, 8)}`,
    tourId: data.tourId,
    tourName: tour.name,
    location: tour.location,
    selectedDate: data.selectedDate,
    numParticipants: data.numParticipants,
    customerName: data.customerName,
    customerEmail: data.customerEmail,
    totalPriceUsd: tour.priceUsd * data.numParticipants,
    status: "confirmed",
  });

  return booking;
}

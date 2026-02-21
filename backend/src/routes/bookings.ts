import { Router } from "express";
import * as bookingService from "../services/bookingService.js";

export const bookingRouter = Router();

bookingRouter.get("/", async (_req, res, next) => {
  try {
    const bookings = await bookingService.getAllBookings();
    res.json({ bookings });
  } catch (err) {
    next(err);
  }
});

bookingRouter.post("/", async (req, res, next) => {
  try {
    const { tour_id, selected_date, num_participants, customer_name, customer_email } = req.body;

    if (!tour_id || !selected_date || !num_participants || !customer_name || !customer_email) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const booking = await bookingService.createBooking({
      tourId: tour_id,
      selectedDate: selected_date,
      numParticipants: num_participants,
      customerName: customer_name,
      customerEmail: customer_email,
    });

    if (!booking) {
      res.status(400).json({ error: "Invalid tour ID or date" });
      return;
    }

    res.status(201).json(booking);
  } catch (err) {
    next(err);
  }
});

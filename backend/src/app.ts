import express from "express";
import cors from "cors";
import { tourRouter } from "./routes/tours.js";
import { bookingRouter } from "./routes/bookings.js";
import { chatRouter } from "./routes/chat.js";
import { errorHandler } from "./middleware/errorHandler.js";

export const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "Thailand Tour Booking Chat" });
});

app.use("/api/tours", tourRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api", chatRouter);

app.use(errorHandler);

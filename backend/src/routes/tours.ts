import { Router } from "express";
import * as tourService from "../services/tourService.js";

export const tourRouter = Router();

tourRouter.get("/", async (_req, res, next) => {
  try {
    const tours = await tourService.getAllTours();
    res.json({ tours });
  } catch (err) {
    next(err);
  }
});

tourRouter.get("/:tourId", async (req, res, next) => {
  try {
    const tour = await tourService.getTourById(req.params.tourId);
    if (!tour) {
      res.status(404).json({ error: "Tour not found" });
      return;
    }
    res.json(tour);
  } catch (err) {
    next(err);
  }
});

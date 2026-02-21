import Tour, { type ITour } from "../models/Tour.js";

export async function getAllTours(): Promise<ITour[]> {
  return Tour.find().sort({ tourId: 1 });
}

export async function getTourById(tourId: string): Promise<ITour | null> {
  return Tour.findOne({ tourId });
}

export async function searchTours(query: string): Promise<ITour[]> {
  if (!query.trim()) return getAllTours();
  const regex = new RegExp(query, "i");
  return Tour.find({
    $or: [
      { name: regex },
      { location: regex },
      { description: regex },
    ],
  });
}

export async function getToursSummary(): Promise<string> {
  const tours = await getAllTours();
  return tours
    .map((t) => {
      const dates = t.availableDates;
      return `- ${t.name} (ID: ${t.tourId})\n  Location: ${t.location}\n  Price: $${t.priceUsd}/person | Duration: ${t.duration}\n  Max participants: ${t.maxParticipants}\n  Available dates: ${dates.slice(0, 4).join(", ")}${dates.length > 4 ? ` ... (${dates.length} dates total)` : ""}\n  Description: ${t.description}`;
    })
    .join("\n\n");
}

import type { Tour, Booking } from "./types";

function upcomingDate(weeksAhead: number, dayOffset = 0): string {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
  const nextMonday = new Date(today);
  nextMonday.setDate(today.getDate() + daysUntilMonday);
  const target = new Date(nextMonday);
  target.setDate(nextMonday.getDate() + (weeksAhead - 1) * 7 + dayOffset);
  return target.toISOString().split("T")[0];
}

export const TOURS: Tour[] = [
  {
    id: "tour-001",
    name: "Bangkok Grand Palace & Temples",
    location: "Bangkok",
    description:
      "Explore the magnificent Grand Palace, Wat Phra Kaew (Temple of the Emerald Buddha), and Wat Pho with its giant reclining Buddha. Includes a guided long-tail boat ride through the canals.",
    duration: "Full day (8 hours)",
    price_usd: 85,
    available_dates: [upcomingDate(1, 0), upcomingDate(1, 2), upcomingDate(1, 4), upcomingDate(2, 1), upcomingDate(2, 3), upcomingDate(3, 0), upcomingDate(3, 5)],
    max_participants: 12,
    image_url: "https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=400",
  },
  {
    id: "tour-002",
    name: "Chiang Mai Elephant Sanctuary",
    location: "Chiang Mai",
    description:
      "Spend a day at an ethical elephant sanctuary. Feed, bathe, and walk with rescued elephants in their natural habitat. Includes traditional Thai lunch.",
    duration: "Full day (7 hours)",
    price_usd: 120,
    available_dates: [upcomingDate(1, 1), upcomingDate(1, 3), upcomingDate(2, 0), upcomingDate(2, 2), upcomingDate(2, 4), upcomingDate(3, 1), upcomingDate(3, 3)],
    max_participants: 8,
    image_url: "https://images.unsplash.com/photo-1559628376-f3fe5f782a2e?w=400",
  },
  {
    id: "tour-003",
    name: "Phi Phi Islands Snorkeling Adventure",
    location: "Phuket / Krabi",
    description:
      "Speed boat tour to the stunning Phi Phi Islands. Snorkel in crystal-clear waters at Maya Bay, Pileh Lagoon, and Monkey Beach. Lunch on the island included.",
    duration: "Full day (9 hours)",
    price_usd: 95,
    available_dates: [upcomingDate(1, 0), upcomingDate(1, 3), upcomingDate(1, 5), upcomingDate(2, 0), upcomingDate(2, 3), upcomingDate(3, 2), upcomingDate(3, 5)],
    max_participants: 15,
    image_url: "https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=400",
  },
  {
    id: "tour-004",
    name: "Chiang Rai White Temple & Golden Triangle",
    location: "Chiang Rai",
    description:
      "Visit the iconic White Temple (Wat Rong Khun), Blue Temple, and the Golden Triangle where Thailand, Laos, and Myanmar meet. Includes boat ride on the Mekong River.",
    duration: "Full day (10 hours)",
    price_usd: 75,
    available_dates: [upcomingDate(1, 2), upcomingDate(1, 5), upcomingDate(2, 1), upcomingDate(2, 4), upcomingDate(3, 0), upcomingDate(3, 3)],
    max_participants: 10,
    image_url: "https://images.unsplash.com/photo-1512553631-56c30b0e5e6f?w=400",
  },
  {
    id: "tour-005",
    name: "Ayutthaya Ancient Capital Day Trip",
    location: "Ayutthaya",
    description:
      "Explore the UNESCO World Heritage ruins of the ancient Siamese capital. Visit Wat Mahathat (Buddha head in tree roots), Wat Phra Si Sanphet, and the floating market.",
    duration: "Full day (8 hours)",
    price_usd: 65,
    available_dates: [upcomingDate(1, 1), upcomingDate(1, 4), upcomingDate(2, 0), upcomingDate(2, 3), upcomingDate(2, 5), upcomingDate(3, 1), upcomingDate(3, 4)],
    max_participants: 14,
    image_url: "https://images.unsplash.com/photo-1569423100655-66a84cbf869e?w=400",
  },
  {
    id: "tour-006",
    name: "Krabi Kayaking & Jungle Trekking",
    location: "Krabi",
    description:
      "Paddle through mangrove forests, explore hidden lagoons, and trek through the jungle to a stunning emerald pool. Spot wildlife and enjoy a beachside BBQ.",
    duration: "Full day (8 hours)",
    price_usd: 90,
    available_dates: [upcomingDate(1, 0), upcomingDate(1, 2), upcomingDate(2, 1), upcomingDate(2, 4), upcomingDate(3, 0), upcomingDate(3, 3), upcomingDate(3, 5)],
    max_participants: 10,
    image_url: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=400",
  },
  {
    id: "tour-007",
    name: "Bangkok Street Food Night Tour",
    location: "Bangkok",
    description:
      "Discover Bangkok's legendary street food scene with a local guide. Sample 10+ dishes including pad thai, mango sticky rice, boat noodles, and more at hidden local spots.",
    duration: "Half day (4 hours, evening)",
    price_usd: 55,
    available_dates: [upcomingDate(1, 0), upcomingDate(1, 1), upcomingDate(1, 2), upcomingDate(1, 3), upcomingDate(1, 4), upcomingDate(2, 0), upcomingDate(2, 1), upcomingDate(2, 2), upcomingDate(2, 3), upcomingDate(3, 0), upcomingDate(3, 1)],
    max_participants: 8,
    image_url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400",
  },
  {
    id: "tour-008",
    name: "Koh Samui Full-Day Island Hopping",
    location: "Koh Samui",
    description:
      "Hop between the stunning islands of Koh Samui archipelago. Visit Ang Thong Marine Park, snorkel, kayak through caves, and hike to breathtaking viewpoints.",
    duration: "Full day (9 hours)",
    price_usd: 110,
    available_dates: [upcomingDate(1, 1), upcomingDate(1, 4), upcomingDate(2, 0), upcomingDate(2, 2), upcomingDate(2, 5), upcomingDate(3, 1), upcomingDate(3, 4)],
    max_participants: 20,
    image_url: "https://images.unsplash.com/photo-1537956965359-7573183d1f57?w=400",
  },
];

let BOOKINGS: Booking[] = [];

export function getAllTours(): Tour[] {
  return TOURS;
}

export function getTourById(tourId: string): Tour | undefined {
  return TOURS.find((t) => t.id === tourId);
}

export function searchTours(query: string): Tour[] {
  const q = query.toLowerCase();
  return TOURS.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.location.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q)
  );
}

export function createBooking(
  tourId: string,
  selectedDate: string,
  numParticipants: number,
  customerName: string,
  customerEmail: string
): Booking | null {
  const tour = getTourById(tourId);
  if (!tour || !tour.available_dates.includes(selectedDate)) return null;
  const booking: Booking = {
    id: `booking-${Math.random().toString(36).slice(2, 10)}`,
    tour_id: tourId,
    tour_name: tour.name,
    location: tour.location,
    selected_date: selectedDate,
    num_participants: numParticipants,
    customer_name: customerName,
    customer_email: customerEmail,
    total_price_usd: tour.price_usd * numParticipants,
    status: "confirmed",
  };
  BOOKINGS.push(booking);
  return booking;
}

export function getAllBookings(): Booking[] {
  return BOOKINGS;
}

export function getToursSummary(): string {
  return TOURS.map(
    (t) =>
      `- ${t.name} (ID: ${t.id})\n  Location: ${t.location}\n  Price: $${t.price_usd}/person | Duration: ${t.duration}\n  Max participants: ${t.max_participants}\n  Available dates: ${t.available_dates.slice(0, 4).join(", ")}${t.available_dates.length > 4 ? ` ... (${t.available_dates.length} dates total)` : ""}\n  Description: ${t.description}`
  ).join("\n\n");
}

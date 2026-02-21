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

export const TOUR_SEED_DATA = [
  {
    tourId: "tour-001",
    name: "Bangkok Grand Palace & Temples",
    location: "Bangkok",
    description:
      "Explore the magnificent Grand Palace, Wat Phra Kaew (Temple of the Emerald Buddha), and Wat Pho with its giant reclining Buddha. Includes a guided long-tail boat ride through the canals.",
    duration: "Full day (8 hours)",
    priceUsd: 85,
    availableDates: [
      upcomingDate(1, 0), upcomingDate(1, 2), upcomingDate(1, 4),
      upcomingDate(2, 1), upcomingDate(2, 3),
      upcomingDate(3, 0), upcomingDate(3, 5),
    ],
    maxParticipants: 12,
    imageUrl: "https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=400",
  },
  {
    tourId: "tour-002",
    name: "Chiang Mai Elephant Sanctuary",
    location: "Chiang Mai",
    description:
      "Spend a day at an ethical elephant sanctuary. Feed, bathe, and walk with rescued elephants in their natural habitat. Includes traditional Thai lunch.",
    duration: "Full day (7 hours)",
    priceUsd: 120,
    availableDates: [
      upcomingDate(1, 1), upcomingDate(1, 3),
      upcomingDate(2, 0), upcomingDate(2, 2), upcomingDate(2, 4),
      upcomingDate(3, 1), upcomingDate(3, 3),
    ],
    maxParticipants: 8,
    imageUrl: "https://images.unsplash.com/photo-1559628376-f3fe5f782a2e?w=400",
  },
  {
    tourId: "tour-003",
    name: "Phi Phi Islands Snorkeling Adventure",
    location: "Phuket / Krabi",
    description:
      "Speed boat tour to the stunning Phi Phi Islands. Snorkel in crystal-clear waters at Maya Bay, Pileh Lagoon, and Monkey Beach. Lunch on the island included.",
    duration: "Full day (9 hours)",
    priceUsd: 95,
    availableDates: [
      upcomingDate(1, 0), upcomingDate(1, 3), upcomingDate(1, 5),
      upcomingDate(2, 0), upcomingDate(2, 3),
      upcomingDate(3, 2), upcomingDate(3, 5),
    ],
    maxParticipants: 15,
    imageUrl: "https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=400",
  },
  {
    tourId: "tour-004",
    name: "Chiang Rai White Temple & Golden Triangle",
    location: "Chiang Rai",
    description:
      "Visit the iconic White Temple (Wat Rong Khun), Blue Temple, and the Golden Triangle where Thailand, Laos, and Myanmar meet. Includes boat ride on the Mekong River.",
    duration: "Full day (10 hours)",
    priceUsd: 75,
    availableDates: [
      upcomingDate(1, 2), upcomingDate(1, 5),
      upcomingDate(2, 1), upcomingDate(2, 4),
      upcomingDate(3, 0), upcomingDate(3, 3),
    ],
    maxParticipants: 10,
    imageUrl: "https://images.unsplash.com/photo-1512553631-56c30b0e5e6f?w=400",
  },
  {
    tourId: "tour-005",
    name: "Ayutthaya Ancient Capital Day Trip",
    location: "Ayutthaya",
    description:
      "Explore the UNESCO World Heritage ruins of the ancient Siamese capital. Visit Wat Mahathat (Buddha head in tree roots), Wat Phra Si Sanphet, and the floating market.",
    duration: "Full day (8 hours)",
    priceUsd: 65,
    availableDates: [
      upcomingDate(1, 1), upcomingDate(1, 4),
      upcomingDate(2, 0), upcomingDate(2, 3), upcomingDate(2, 5),
      upcomingDate(3, 1), upcomingDate(3, 4),
    ],
    maxParticipants: 14,
    imageUrl: "https://images.unsplash.com/photo-1569423100655-66a84cbf869e?w=400",
  },
  {
    tourId: "tour-006",
    name: "Krabi Kayaking & Jungle Trekking",
    location: "Krabi",
    description:
      "Paddle through mangrove forests, explore hidden lagoons, and trek through the jungle to a stunning emerald pool. Spot wildlife and enjoy a beachside BBQ.",
    duration: "Full day (8 hours)",
    priceUsd: 90,
    availableDates: [
      upcomingDate(1, 0), upcomingDate(1, 2),
      upcomingDate(2, 1), upcomingDate(2, 4),
      upcomingDate(3, 0), upcomingDate(3, 3), upcomingDate(3, 5),
    ],
    maxParticipants: 10,
    imageUrl: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=400",
  },
  {
    tourId: "tour-007",
    name: "Bangkok Street Food Night Tour",
    location: "Bangkok",
    description:
      "Discover Bangkok's legendary street food scene with a local guide. Sample 10+ dishes including pad thai, mango sticky rice, boat noodles, and more at hidden local spots.",
    duration: "Half day (4 hours, evening)",
    priceUsd: 55,
    availableDates: [
      upcomingDate(1, 0), upcomingDate(1, 1), upcomingDate(1, 2),
      upcomingDate(1, 3), upcomingDate(1, 4),
      upcomingDate(2, 0), upcomingDate(2, 1), upcomingDate(2, 2), upcomingDate(2, 3),
      upcomingDate(3, 0), upcomingDate(3, 1),
    ],
    maxParticipants: 8,
    imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400",
  },
  {
    tourId: "tour-008",
    name: "Koh Samui Full-Day Island Hopping",
    location: "Koh Samui",
    description:
      "Hop between the stunning islands of Koh Samui archipelago. Visit Ang Thong Marine Park, snorkel, kayak through caves, and hike to breathtaking viewpoints.",
    duration: "Full day (9 hours)",
    priceUsd: 110,
    availableDates: [
      upcomingDate(1, 1), upcomingDate(1, 4),
      upcomingDate(2, 0), upcomingDate(2, 2), upcomingDate(2, 5),
      upcomingDate(3, 1), upcomingDate(3, 4),
    ],
    maxParticipants: 20,
    imageUrl: "https://images.unsplash.com/photo-1537956965359-7573183d1f57?w=400",
  },
];

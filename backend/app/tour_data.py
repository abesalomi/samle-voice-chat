"""In-memory tour booking data for Thailand tours."""

from datetime import date, timedelta
from typing import Optional
import uuid


def _upcoming_date(weeks_ahead: int, day_offset: int = 0) -> str:
    """Return an ISO date string for a day in an upcoming week."""
    today = date.today()
    # Start from next Monday
    next_monday = today + timedelta(days=(7 - today.weekday()))
    target = next_monday + timedelta(weeks=weeks_ahead - 1, days=day_offset)
    return target.isoformat()


TOURS: list[dict] = [
    {
        "id": "tour-001",
        "name": "Bangkok Grand Palace & Temples",
        "location": "Bangkok",
        "description": "Explore the magnificent Grand Palace, Wat Phra Kaew (Temple of the Emerald Buddha), and Wat Pho with its giant reclining Buddha. Includes a guided long-tail boat ride through the canals.",
        "duration": "Full day (8 hours)",
        "price_usd": 85,
        "available_dates": [
            _upcoming_date(1, 0),
            _upcoming_date(1, 2),
            _upcoming_date(1, 4),
            _upcoming_date(2, 1),
            _upcoming_date(2, 3),
            _upcoming_date(3, 0),
            _upcoming_date(3, 5),
        ],
        "max_participants": 12,
        "image_url": "https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=400",
    },
    {
        "id": "tour-002",
        "name": "Chiang Mai Elephant Sanctuary",
        "location": "Chiang Mai",
        "description": "Spend a day at an ethical elephant sanctuary. Feed, bathe, and walk with rescued elephants in their natural habitat. Includes traditional Thai lunch.",
        "duration": "Full day (7 hours)",
        "price_usd": 120,
        "available_dates": [
            _upcoming_date(1, 1),
            _upcoming_date(1, 3),
            _upcoming_date(2, 0),
            _upcoming_date(2, 2),
            _upcoming_date(2, 4),
            _upcoming_date(3, 1),
            _upcoming_date(3, 3),
        ],
        "max_participants": 8,
        "image_url": "https://images.unsplash.com/photo-1559628376-f3fe5f782a2e?w=400",
    },
    {
        "id": "tour-003",
        "name": "Phi Phi Islands Snorkeling Adventure",
        "location": "Phuket / Krabi",
        "description": "Speed boat tour to the stunning Phi Phi Islands. Snorkel in crystal-clear waters at Maya Bay, Pileh Lagoon, and Monkey Beach. Lunch on the island included.",
        "duration": "Full day (9 hours)",
        "price_usd": 95,
        "available_dates": [
            _upcoming_date(1, 0),
            _upcoming_date(1, 3),
            _upcoming_date(1, 5),
            _upcoming_date(2, 0),
            _upcoming_date(2, 3),
            _upcoming_date(3, 2),
            _upcoming_date(3, 5),
        ],
        "max_participants": 15,
        "image_url": "https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=400",
    },
    {
        "id": "tour-004",
        "name": "Chiang Rai White Temple & Golden Triangle",
        "location": "Chiang Rai",
        "description": "Visit the iconic White Temple (Wat Rong Khun), Blue Temple, and the Golden Triangle where Thailand, Laos, and Myanmar meet. Includes boat ride on the Mekong River.",
        "duration": "Full day (10 hours)",
        "price_usd": 75,
        "available_dates": [
            _upcoming_date(1, 2),
            _upcoming_date(1, 5),
            _upcoming_date(2, 1),
            _upcoming_date(2, 4),
            _upcoming_date(3, 0),
            _upcoming_date(3, 3),
        ],
        "max_participants": 10,
        "image_url": "https://images.unsplash.com/photo-1512553631-56c30b0e5e6f?w=400",
    },
    {
        "id": "tour-005",
        "name": "Ayutthaya Ancient Capital Day Trip",
        "location": "Ayutthaya",
        "description": "Explore the UNESCO World Heritage ruins of the ancient Siamese capital. Visit Wat Mahathat (Buddha head in tree roots), Wat Phra Si Sanphet, and the floating market.",
        "duration": "Full day (8 hours)",
        "price_usd": 65,
        "available_dates": [
            _upcoming_date(1, 1),
            _upcoming_date(1, 4),
            _upcoming_date(2, 0),
            _upcoming_date(2, 3),
            _upcoming_date(2, 5),
            _upcoming_date(3, 1),
            _upcoming_date(3, 4),
        ],
        "max_participants": 14,
        "image_url": "https://images.unsplash.com/photo-1569423100655-66a84cbf869e?w=400",
    },
    {
        "id": "tour-006",
        "name": "Krabi Kayaking & Jungle Trekking",
        "location": "Krabi",
        "description": "Paddle through mangrove forests, explore hidden lagoons, and trek through the jungle to a stunning emerald pool. Spot wildlife and enjoy a beachside BBQ.",
        "duration": "Full day (8 hours)",
        "price_usd": 90,
        "available_dates": [
            _upcoming_date(1, 0),
            _upcoming_date(1, 2),
            _upcoming_date(2, 1),
            _upcoming_date(2, 4),
            _upcoming_date(3, 0),
            _upcoming_date(3, 3),
            _upcoming_date(3, 5),
        ],
        "max_participants": 10,
        "image_url": "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=400",
    },
    {
        "id": "tour-007",
        "name": "Bangkok Street Food Night Tour",
        "location": "Bangkok",
        "description": "Discover Bangkok's legendary street food scene with a local guide. Sample 10+ dishes including pad thai, mango sticky rice, boat noodles, and more at hidden local spots.",
        "duration": "Half day (4 hours, evening)",
        "price_usd": 55,
        "available_dates": [
            _upcoming_date(1, 0),
            _upcoming_date(1, 1),
            _upcoming_date(1, 2),
            _upcoming_date(1, 3),
            _upcoming_date(1, 4),
            _upcoming_date(2, 0),
            _upcoming_date(2, 1),
            _upcoming_date(2, 2),
            _upcoming_date(2, 3),
            _upcoming_date(3, 0),
            _upcoming_date(3, 1),
        ],
        "max_participants": 8,
        "image_url": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400",
    },
    {
        "id": "tour-008",
        "name": "Koh Samui Full-Day Island Hopping",
        "location": "Koh Samui",
        "description": "Hop between the stunning islands of Koh Samui archipelago. Visit Ang Thong Marine Park, snorkel, kayak through caves, and hike to breathtaking viewpoints.",
        "duration": "Full day (9 hours)",
        "price_usd": 110,
        "available_dates": [
            _upcoming_date(1, 1),
            _upcoming_date(1, 4),
            _upcoming_date(2, 0),
            _upcoming_date(2, 2),
            _upcoming_date(2, 5),
            _upcoming_date(3, 1),
            _upcoming_date(3, 4),
        ],
        "max_participants": 20,
        "image_url": "https://images.unsplash.com/photo-1537956965359-7573183d1f57?w=400",
    },
]

# In-memory bookings store
BOOKINGS: list[dict] = []


def get_all_tours() -> list[dict]:
    return TOURS


def get_tour_by_id(tour_id: str) -> Optional[dict]:
    for tour in TOURS:
        if tour["id"] == tour_id:
            return tour
    return None


def search_tours(query: str) -> list[dict]:
    """Search tours by name, location, or description."""
    query_lower = query.lower()
    results = []
    for tour in TOURS:
        if (
            query_lower in tour["name"].lower()
            or query_lower in tour["location"].lower()
            or query_lower in tour["description"].lower()
        ):
            results.append(tour)
    return results


def create_booking(
    tour_id: str,
    selected_date: str,
    num_participants: int,
    customer_name: str,
    customer_email: str,
) -> Optional[dict]:
    """Create a new booking. Returns the booking dict or None if tour not found."""
    tour = get_tour_by_id(tour_id)
    if not tour:
        return None

    if selected_date not in tour["available_dates"]:
        return None

    booking = {
        "id": f"booking-{uuid.uuid4().hex[:8]}",
        "tour_id": tour_id,
        "tour_name": tour["name"],
        "location": tour["location"],
        "selected_date": selected_date,
        "num_participants": num_participants,
        "customer_name": customer_name,
        "customer_email": customer_email,
        "total_price_usd": tour["price_usd"] * num_participants,
        "status": "confirmed",
    }
    BOOKINGS.append(booking)
    return booking


def get_all_bookings() -> list[dict]:
    return BOOKINGS


def get_tours_summary() -> str:
    """Return a human-readable summary of all tours for the AI assistant."""
    lines = ["Available Thailand Tours:\n"]
    for t in TOURS:
        dates_str = ", ".join(t["available_dates"][:4])
        if len(t["available_dates"]) > 4:
            dates_str += f" ... ({len(t['available_dates'])} dates total)"
        lines.append(
            f"- {t['name']} (ID: {t['id']})\n"
            f"  Location: {t['location']}\n"
            f"  Price: ${t['price_usd']}/person | Duration: {t['duration']}\n"
            f"  Max participants: {t['max_participants']}\n"
            f"  Available dates: {dates_str}\n"
            f"  Description: {t['description']}\n"
        )
    return "\n".join(lines)

import { useState, useEffect } from "react";
import type { Booking } from "../types";
import { fetchBookings } from "../api";
import "./BookingList.css";

interface Props {
  refreshKey: number;
}

export default function BookingList({ refreshKey }: Props) {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    fetchBookings()
      .then(setBookings)
      .catch(() => setBookings([]));
  }, [refreshKey]);

  if (bookings.length === 0) {
    return (
      <div className="booking-list">
        <h2>My Bookings</h2>
        <p className="no-bookings">
          No bookings yet. Chat with our assistant to book a tour!
        </p>
      </div>
    );
  }

  return (
    <div className="booking-list">
      <h2>My Bookings</h2>
      <div className="booking-cards">
        {bookings.map((b) => (
          <div key={b.id} className="booking-card">
            <div className="booking-card-header">
              <span className={`booking-status ${b.status}`}>{b.status}</span>
              <span className="booking-id">{b.id}</span>
            </div>
            <h3>{b.tour_name}</h3>
            <div className="booking-details">
              <div className="booking-detail">
                <span className="detail-label">Location</span>
                <span>{b.location}</span>
              </div>
              <div className="booking-detail">
                <span className="detail-label">Date</span>
                <span>
                  {new Date(b.selected_date + "T00:00:00").toLocaleDateString(
                    "en-US",
                    {
                      weekday: "short",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    }
                  )}
                </span>
              </div>
              <div className="booking-detail">
                <span className="detail-label">Guests</span>
                <span>{b.num_participants}</span>
              </div>
              <div className="booking-detail">
                <span className="detail-label">Name</span>
                <span>{b.customer_name}</span>
              </div>
              <div className="booking-detail total">
                <span className="detail-label">Total</span>
                <span className="booking-total">${b.total_price_usd}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

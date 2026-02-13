import { useState, useEffect } from "react";
import type { Tour } from "../types";
import { fetchTours } from "../api";
import "./TourList.css";

interface Props {
  onTourSelect: (tour: Tour) => void;
}

export default function TourList({ onTourSelect }: Props) {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetchTours()
      .then(setTours)
      .catch(() => setTours([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredTours = tours.filter(
    (t) =>
      t.name.toLowerCase().includes(filter.toLowerCase()) ||
      t.location.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) {
    return (
      <div className="tour-list">
        <div className="tour-list-loading">Loading tours...</div>
      </div>
    );
  }

  return (
    <div className="tour-list">
      <div className="tour-list-header">
        <h2>Available Tours</h2>
        <input
          type="text"
          className="tour-filter"
          placeholder="Filter by name or location..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      <div className="tour-grid">
        {filteredTours.map((tour) => (
          <div
            key={tour.id}
            className="tour-card"
            onClick={() => onTourSelect(tour)}
          >
            <div
              className="tour-card-image"
              style={{ backgroundImage: `url(${tour.image_url})` }}
            >
              <span className="tour-card-location">{tour.location}</span>
            </div>
            <div className="tour-card-body">
              <h3>{tour.name}</h3>
              <p className="tour-card-desc">{tour.description}</p>
              <div className="tour-card-footer">
                <span className="tour-price">${tour.price_usd}/person</span>
                <span className="tour-duration">{tour.duration}</span>
              </div>
              <div className="tour-dates">
                {tour.available_dates.slice(0, 3).map((d) => (
                  <span key={d} className="tour-date-chip">
                    {new Date(d + "T00:00:00").toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                ))}
                {tour.available_dates.length > 3 && (
                  <span className="tour-date-chip more">
                    +{tour.available_dates.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

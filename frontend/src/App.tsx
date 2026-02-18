import { useState, useMemo } from "react";
import ChatPanel from "./components/ChatPanel";
import TourList from "./components/TourList";
import BookingList from "./components/BookingList";
import type { Tour } from "./types";
import "./App.css";

type Tab = "chat" | "tours" | "bookings";

function App() {
  const [activeTab, setActiveTab] = useState<Tab>("chat");
  const [bookingRefreshKey, setBookingRefreshKey] = useState(0);
  const sessionId = useMemo(
    () => `session-${Date.now().toString(36)}`,
    []
  );

  const handleBookingMade = () => {
    setBookingRefreshKey((k) => k + 1);
  };

  const handleTourSelect = (_tour: Tour) => {
    setActiveTab("chat");
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-brand">
          <span className="app-logo">🇹🇭</span>
          <div>
            <h1>Thailand Tour Booking</h1>
            <p>Voice & Text Chat Assistant</p>
          </div>
        </div>
        <nav className="app-nav">
          <button
            className={`nav-tab ${activeTab === "chat" ? "active" : ""}`}
            onClick={() => setActiveTab("chat")}
          >
            💬 Chat
          </button>
          <button
            className={`nav-tab ${activeTab === "tours" ? "active" : ""}`}
            onClick={() => setActiveTab("tours")}
          >
            🏝 Tours
          </button>
          <button
            className={`nav-tab ${activeTab === "bookings" ? "active" : ""}`}
            onClick={() => setActiveTab("bookings")}
          >
            📋 Bookings
          </button>
        </nav>
      </header>

      <main className="app-main">
        {activeTab === "chat" && (
          <div className="chat-container">
            <ChatPanel
              sessionId={sessionId}
              onBookingMade={handleBookingMade}
            />
          </div>
        )}
        {activeTab === "tours" && (
          <div className="content-container">
            <TourList onTourSelect={handleTourSelect} />
          </div>
        )}
        {activeTab === "bookings" && (
          <div className="content-container">
            <BookingList refreshKey={bookingRefreshKey} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

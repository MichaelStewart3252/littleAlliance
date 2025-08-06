import React, { useState, useEffect } from "react";
import "./Event.css";

function Event({ user }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/events")
      .then(res => res.json())
      .then(data => {
        setEvents(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleRegister = async (eventId) => {
    setRegistering(eventId);
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:5000/api/events/${eventId}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });
    const data = await res.json();

    // Always refetch events to update registration status
    await fetch("http://localhost:5000/api/events")
      .then(res => res.json())
      .then(setEvents);

    if (!res.ok && data.message !== "Already registered") {
      alert(data.message || "Registration failed");
    }
    setRegistering(null);
  };

  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  if (loading) return <div>Loading events...</div>;

  if (sortedEvents.length === 0) {
    return (
      <div className="events-list" style={{ textAlign: "center", marginTop: "2rem", color: "#888" }}>
        No upcoming events!
      </div>
    );
  }

  return (
    <div className="events-list">
      {sortedEvents.map((event) => {
        const isRegistered = user && event.registrations && event.registrations.some(
          r =>
            (r.user && typeof r.user === "object" && (r.user._id === user._id || r.user._id === user.id)) ||
            (typeof r.user === "string" && (r.user === user._id || r.user === user.id))
        );

        return (
          <div className="event-card" key={event._id}>
            <div className="event-main">
              <div className="event-info">
                <h2>{event.name}</h2>
                <div className="event-meta-row">
                  <span><strong>Date:</strong> {event.date ? event.date.substring(0, 10) : ""}</span>
                  <span><strong>Time:</strong> {event.time}</span>
                  <span><strong>Location:</strong> {event.location}</span>
                  <span><strong>Fee:</strong> {event.fee ? `$${event.fee}` : "Free"}</span>
                </div>
                <p><strong>Description:</strong> {event.description}</p>
                <div className="event-actions">
                  {user ? (
                    isRegistered ? (
                      <button className="registered-btn" disabled>
                        Registered!
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRegister(event._id)}
                        disabled={registering === event._id}
                      >
                        {registering === event._id ? "Registering..." : "Register"}
                      </button>
                    )
                  ) : (
                    <span style={{ color: "#888" }}>Sign in to register</span>
                  )}
                </div>
              </div>
              <div className="event-extra">
                <div className="event-prize">
                  <strong>Prize:</strong>
                  <div>{event.prize}</div>
                </div>
                <div className="event-results">
                  <strong>Results:</strong>
                  <div>{event.results}</div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Event;

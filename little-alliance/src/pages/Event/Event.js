import React, { useState } from "react";
import "./Event.css";

const initialEvents = [
  {
    id: 1,
    name: "Spring Invitational",
    date: "2024-06-15",
    description: "A friendly 18-hole tournament for all skill levels.",
    prize: "1st Place: $500 Pro Shop Gift Card",
    results: "Winner: Jane Smith - 68 (-4)",
    registered: false,
  },
  {
    id: 2,
    name: "Junior Golf Camp",
    date: "2024-07-10",
    description: "A week-long camp for young golfers ages 8-16.",
    prize: "Top Junior: Free Private Lesson",
    results: "Registration open. Results after event.",
    registered: false,
  },
  {
    id: 3,
    name: "Night Golf Scramble",
    date: "2024-08-05",
    description: "Fun 9-hole scramble under the lights!",
    prize: "Winning Team: Custom Club Covers",
    results: "Registration open. Results after event.",
    registered: false,
  },
];


function Event() {
  const [events, setEvents] = useState(initialEvents);

  const handleRegister = (id) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === id ? { ...event, registered: true } : event
      )
    );
  };

  return (
    <div className="events-list">
  {events.map((event) => (
    <div className="event-card" key={event.id}>
      <div className="event-main">
        <div className="event-info">
          <h2>{event.name}</h2>
          <p><strong>Date:</strong> {event.date}</p>
          <p>{event.description}</p>
          <div className="event-actions">
            {event.registered ? (
              <button className="registered-btn" disabled>
                Registered!
              </button>
            ) : (
              <button onClick={() => handleRegister(event.id)}>
                Register
              </button>
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
  ))}
</div>
  );
}

export default Event;

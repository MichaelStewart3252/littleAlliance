import { useEffect, useState } from "react";
import "./Admin.css";

const API_URL = "http://localhost:5000/api/events";

function Admin({ user }) {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    location: "",
    date: "",
    time: "",
    fee: "",
    prize: "",
    results: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  // Fetch events
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(setEvents);
  }, []);

  // Handle form input
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Create or update event
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const token = localStorage.getItem("token");
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;

    // Ensure fee is a number
    const payload = { ...form, fee: Number(form.fee) };

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.message || "Error saving event");
      return;
    }
    // Refresh event list
    fetch(API_URL)
      .then(res => res.json())
      .then(setEvents);
    setForm({
      name: "",
      description: "",
      location: "",
      date: "",
      time: "",
      fee: "",
      prize: "",
      results: ""
    });
    setEditingId(null);
  }

  // Edit event
  function handleEdit(event) {
    setForm({
      name: event.name,
      description: event.description,
      location: event.location,
      date: event.date ? event.date.substring(0, 10) : "",
      time: event.time,
      fee: event.fee,
      prize: event.prize,
      results: event.results || ""
    });
    setEditingId(event._id);
  }

  // Delete event
  async function handleDelete(id) {
    if (!window.confirm("Delete this event?")) return;
    const token = localStorage.getItem("token");
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    setEvents(events => events.filter(e => e._id !== id));
    if (editingId === id) {
      setEditingId(null);
      setForm({
        name: "",
        description: "",
        location: "",
        date: "",
        time: "",
        fee: "",
        prize: "",
        results: ""
      });
    }
  }

  if (!user || !user.isAdmin) {
    return <div style={{ textAlign: "center", marginTop: "2rem", color: "#d32f2f" }}>Access denied. Admins only.</div>;
  }

  return (
    <div className="admin-container">
      <h2>Admin Event Management</h2>
      <form className="admin-form" onSubmit={handleSubmit}>
        <h3>{editingId ? "Edit Event" : "Create Event"}</h3>
        <div className="admin-form-row">
          <div>
            <label>Name<br />
              <input name="name" value={form.name} onChange={handleChange} required />
            </label>
          </div>
          <div>
            <label>Location<br />
              <input name="location" value={form.location} onChange={handleChange} required />
            </label>
          </div>
          <div>
            <label>Date<br />
              <input name="date" type="date" value={form.date} onChange={handleChange} required />
            </label>
          </div>
          <div>
            <label>Time<br />
              <input name="time" value={form.time} onChange={handleChange} required />
            </label>
          </div>
          <div>
            <label>Fee<br />
              <input name="fee" type="number" value={form.fee} onChange={handleChange} required />
            </label>
          </div>
          <div>
            <label>Prize<br />
              <input name="prize" value={form.prize} onChange={handleChange} required />
            </label>
          </div>
        </div>
        <div style={{ marginTop: "1rem" }}>
          <label>Description<br />
            <textarea name="description" value={form.description} onChange={handleChange} required rows={2} />
          </label>
        </div>
        <div style={{ marginTop: "1rem" }}>
          <label>Results<br />
            <textarea name="results" value={form.results} onChange={handleChange} rows={2} />
          </label>
        </div>
        {error && <div className="admin-error">{error}</div>}
        <button type="submit">
          {editingId ? "Update Event" : "Create Event"}
        </button>
        {editingId && (
          <button
            type="button"
            className="cancel-btn"
            onClick={() => {
              setEditingId(null);
              setForm({
                name: "",
                description: "",
                location: "",
                date: "",
                time: "",
                fee: "",
                prize: "",
                results: ""
              });
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <h3>All Events</h3>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Date</th>
            <th>Location</th>
            <th>Fee</th>
            <th>Prize</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map(ev => (
            <tr key={ev._id}>
              <td>{ev.name}</td>
              <td>{ev.date ? ev.date.substring(0, 10) : ""}</td>
              <td>{ev.location}</td>
              <td>${ev.fee}</td>
              <td>{ev.prize}</td>
              <td>
                <button onClick={() => handleEdit(ev)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(ev._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Admin;

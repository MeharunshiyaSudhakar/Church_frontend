import { useEffect, useState } from "react";

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
  });
  const [editId, setEditId] = useState(null);
  const token = localStorage.getItem("token");

  const fetchEvents = async () => {
    const res = await fetch("http://localhost:5000/api/events");
    const data = await res.json();
    setEvents(data);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const saveEvent = async () => {
    const method = editId ? "PUT" : "POST";
    const url = editId
      ? `http://localhost:5000/api/events/${editId}`
      : "http://localhost:5000/api/events";

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    setForm({ title: "", description: "", date: "" });
    setEditId(null);
    fetchEvents();
  };

  const deleteEvent = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    await fetch(`http://localhost:5000/api/events/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchEvents();
  };

  const editEvent = (item) => {
    setEditId(item.id);
    setForm({
      title: item.title,
      description: item.description,
      date: item.date,
    });
  };

  return (
    <div className="admin-container">
      <h2>Manage Upcoming Events</h2>

      <div className="admin-form">
        <input
          type="text"
          placeholder="Event Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <textarea
          placeholder="Short Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />

        <button onClick={saveEvent}>{editId ? "Update" : "Add Event"}</button>
      </div>

      <ul>
        {events.map((item) => (
          <li key={item.id}>
            <strong>{item.title}</strong> — {item.date}
            <br />
            {item.description}
            <button onClick={() => editEvent(item)}>Edit</button>
            <button onClick={() => deleteEvent(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

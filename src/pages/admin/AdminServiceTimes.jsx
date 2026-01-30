import { useEffect, useState } from "react";

export default function AdminServiceTimes() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: "", time: "" });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/service-times");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error("Fetch service-times error:", err);
      alert("Failed to load service times. Check server logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const saveItem = async () => {
    if (!token) return alert("You must be logged in as admin to perform this action.");
    if (!form.name || !form.time) return alert("Please enter a name and time.");

    try {
      const method = editId ? "PUT" : "POST";
      const url = editId
        ? `http://localhost:5000/api/service-times/${editId}`
        : "http://localhost:5000/api/service-times";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          time: form.time
        }),
      });

      const data = await res.json();
      if (!res.ok) return alert(data.error || "Failed to save");

      if (editId) {
        setItems((prev) => prev.map((p) => (p.id === editId ? data.item : p)));
      } else {
        setItems((prev) => [...prev, data.item]);
      }

      setForm({ name: "", time: "" });
      setEditId(null);
    } catch (err) {
      console.error("Save exception:", err);
      alert("Server error while saving.");
    }
  };

  const deleteItem = async (id) => {
    if (!token) return alert("You must be logged in as admin to perform this action.");
    if (!window.confirm("Delete this service time?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/service-times/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) return alert(data.error || "Failed to delete");

      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      console.error("Delete exception:", err);
      alert("Server error while deleting.");
    }
  };

  const editItem = (item) => {
    setEditId(item.id);

    const parts = item.time.split(" ");
    if (parts.length === 2) {
      let [hhmm] = parts;
      let [hh, mm] = hhmm.split(":");
      const ampm = parts[1];
      hh = parseInt(hh, 10);
      if (ampm === "PM" && hh !== 12) hh += 12;
      if (ampm === "AM" && hh === 12) hh = 0;
      setForm({ name: item.name, time: `${String(hh).padStart(2,"0")}:${mm}` });
    } else {
      const raw = item.time.split(":");
      setForm({ name: item.name, time: `${raw[0]}:${raw[1]}` });
    }
  };

  return (
    <div className="admin-container">
      <h2>Manage Service Times</h2>

      <div className="admin-form">
        <input
          type="text"
          placeholder="Service Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          type="time"
          value={form.time}
          onChange={(e) => setForm({ ...form, time: e.target.value })}
        />

        <button onClick={saveItem}>{editId ? "Update" : "Add"}</button>
        {editId && (
          <button onClick={() => {
            setEditId(null);
            setForm({ name: "", time: "" });
          }}>
            Cancel
          </button>
        )}
      </div>

      {loading && <p>Loading...</p>}

      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <strong>{item.name}</strong> — {item.time}
            <button onClick={() => editItem(item)}>Edit</button>
            <button onClick={() => deleteItem(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

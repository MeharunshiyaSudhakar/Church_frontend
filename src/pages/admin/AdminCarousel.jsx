import { useEffect, useState } from "react";
import "./AdminCommon.css"; // optional shared admin styles

export default function AdminCarousel() {
  const [slides, setSlides] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    image_url: "",
  });

  const token = localStorage.getItem("token");

  /* ================= LOAD ================= */
  const load = async () => {
    const r = await fetch("http://localhost:5000/api/carousel");
    setSlides(await r.json());
  };

  useEffect(() => {
    load();
  }, []);

  /* ================= ADD ================= */
  const add = async () => {
    if (!form.title || !form.image_url) {
      alert("Title and Image URL required");
      return;
    }

    await fetch("http://localhost:5000/api/carousel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    setForm({ title: "", description: "", image_url: "" });
    load();
  };

  /* ================= DELETE ================= */
  const del = async (id) => {
    if (!window.confirm("Delete this slide?")) return;

    await fetch(`http://localhost:5000/api/carousel/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    load();
  };

  return (
    <div className="admin-container">
      <h2>Manage Carousel</h2>

      <div className="admin-form">
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <input
          placeholder="Image URL"
          value={form.image_url}
          onChange={(e) =>
            setForm({ ...form, image_url: e.target.value })
          }
        />

        <button onClick={add}>Add Slide</button>
      </div>

      <ul className="admin-list">
        {slides.map((s) => (
          <li key={s.id}>
            <strong>{s.title}</strong>
            <button onClick={() => del(s.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

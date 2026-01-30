import { useState } from "react";
import "./SubscriptionsPopup.css";

export default function SubscriptionsPopup({ isOpen, onClose }) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.target);
    const categories = form.getAll("categories"); // ✅ array

    const payload = {
      name: form.get("name"),
      email: form.get("email"),
      phone: form.get("phone"),
      categories,
    };

    const res = await fetch("http://localhost:5000/api/subscriptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);

    if (res.ok) {
      alert("Subscribed successfully!");
      onClose();
    } else {
      alert("Subscription failed");
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <h2>Subscribe</h2>

        <form onSubmit={handleSubscribe}>
          <input name="name" placeholder="Name" required />
          <input name="email" type="email" placeholder="Email" required />
          <input name="phone" placeholder="Phone" />

          <h4>Select subscriptions</h4>

          <label>
            <input type="checkbox" name="categories" value="daily_verse" />
            Daily Bible Verse
          </label>

          <label>
            <input type="checkbox" name="categories" value="daily_message" />
            Daily Message
          </label>

          <label>
            <input type="checkbox" name="categories" value="sunday_message" />
            Sunday Message
          </label>

          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>

        <button className="close-btn" onClick={onClose}>X</button>
      </div>
    </div>
  );
}

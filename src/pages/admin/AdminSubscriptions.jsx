import { useState } from "react";
import AdminHeader from "../../components/admin/AdminHeader";

export default function AdminSubscriptions() {
  const token = localStorage.getItem("token");

  const [category, setCategory] = useState("daily_message");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const sendMessage = async () => {
    if (!subject || !message) {
      alert("Fill subject and message");
      return;
    }

    const res = await fetch("http://localhost:5000/api/subscriptions/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        category,
        subject,
        message,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setStatus("✅ Message sent successfully");
      setSubject("");
      setMessage("");
    } else {
      setStatus(`❌ ${data.error || "Send failed"}`);
    }
  };

  return (
    <>
      <AdminHeader />

      <div className="admin-container">
        <h2>Subscription Broadcast</h2>
        <p>Send message to subscribed users</p>

        <div className="admin-form">
          <label>Subscription Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="daily_message">Daily Message</option>
            <option value="daily_verse">Daily Bible Verse</option>
            <option value="sunday_message">Sunday Message</option>
          </select>

          <label>Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Email subject"
          />

          <label>Message</label>
          <textarea
            rows="6"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter message"
          />

          <button onClick={sendMessage}>Send Broadcast</button>

          {status && <p style={{ marginTop: 10 }}>{status}</p>}
        </div>
      </div>
    </>
  );
}

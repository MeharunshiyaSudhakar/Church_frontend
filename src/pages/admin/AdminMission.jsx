import { useState, useEffect } from "react";
import AdminHeader from "../../components/admin/AdminHeader";

export default function AdminMission() {
  const [intro, setIntro] = useState("");
  const [verse, setVerse] = useState("");
  const [verseRef, setVerseRef] = useState("");
  const [goals, setGoals] = useState([]);
  const [goalForm, setGoalForm] = useState({ title: "", description: "" });
  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem("token");

  const loadMission = async () => {
    const res = await fetch("http://localhost:5000/api/mission");
    const data = await res.json();

    if (data.intro) {
      setIntro(data.intro.intro);
      setVerse(data.intro.verse);
      setVerseRef(data.intro.verse_ref);
    }

    setGoals(data.goals);
  };

  useEffect(() => {
    loadMission();
  }, []);

  const updateIntro = async () => {
    await fetch("http://localhost:5000/api/mission/intro", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ intro, verse, verse_ref: verseRef }),
    });

    alert("Mission section updated");
  };

  const addGoal = async () => {
    await fetch("http://localhost:5000/api/mission/goal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(goalForm),
    });

    setGoalForm({ title: "", description: "" });
    loadMission();
  };

  const editGoal = (goal) => {
    setEditId(goal.id);
    setGoalForm({ title: goal.title, description: goal.description });
  };

  const updateGoal = async () => {
    await fetch(`http://localhost:5000/api/mission/goal/${editId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(goalForm),
    });

    setEditId(null);
    setGoalForm({ title: "", description: "" });
    loadMission();
  };

  const deleteGoal = async (id) => {
    await fetch(`http://localhost:5000/api/mission/goal/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    loadMission();
  };

  return (
    <>
      {/* ✅ ADMIN HEADER ADDED */}
      <AdminHeader />

      <div className="admin-container">
        <h2>Mission Page Editor</h2>

        <h3>Mission Intro & Verse</h3>

        <textarea
          value={intro}
          onChange={(e) => setIntro(e.target.value)}
          placeholder="Mission introduction..."
        />

        <input
          value={verse}
          onChange={(e) => setVerse(e.target.value)}
          placeholder="Bible Verse text"
        />

        <input
          value={verseRef}
          onChange={(e) => setVerseRef(e.target.value)}
          placeholder="Verse Reference (e.g., Mark 16:15)"
        />

        <button onClick={updateIntro}>Save Intro</button>

        <h3>Mission Goals</h3>

        <input
          placeholder="Goal Title"
          value={goalForm.title}
          onChange={(e) =>
            setGoalForm({ ...goalForm, title: e.target.value })
          }
        />

        <textarea
          placeholder="Goal Description"
          value={goalForm.description}
          onChange={(e) =>
            setGoalForm({ ...goalForm, description: e.target.value })
          }
        />

        <button onClick={editId ? updateGoal : addGoal}>
          {editId ? "Update Goal" : "Add Goal"}
        </button>

        <ul>
          {goals.map((goal) => (
            <li key={goal.id}>
              <strong>{goal.title}</strong> — {goal.description}
              <button onClick={() => editGoal(goal)}>Edit</button>
              <button onClick={() => deleteGoal(goal.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

import "./Mission.css";
import Layout from "../components/Layout";
import missionImg from "../assets/mission-church.jpg";
import { useEffect, useState } from "react";

export default function Mission() {
  const [intro, setIntro] = useState("");
  const [goals, setGoals] = useState([]);
  const [verse, setVerse] = useState("");
  const [verseRef, setVerseRef] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/mission")
      .then(res => res.json())
      .then(data => {
        setIntro(data.intro?.intro || "");
        setVerse(data.intro?.verse || "");
        setVerseRef(data.intro?.verse_ref || "");
        setGoals(data.goals || []);
      });
  }, []);

  return (
    <Layout>
      <div className="mission-page">

        {/* Header Image */}
        <div className="mission-hero">
          <img src={missionImg} alt="Mission" />
          <div className="mission-overlay">
            <h1>Our Mission</h1>
            <p>Growing Together in Faith & Service</p>
          </div>
        </div>

        {/* Mission Vision Section */}
        <section className="mission-body container">

          <p className="mission-intro">{intro}</p>

          <div className="mission-goals">
            {goals.map(goal => (
              <div className="goal-card" key={goal.id}>
                <h3>{goal.title}</h3>
                <p>{goal.description}</p>
              </div>
            ))}
          </div>

        </section>

        {/* Scripture Highlight */}
        <section className="mission-verse">
          <h2>"{verse}"</h2>
          <p>- {verseRef}</p>
        </section>

      </div>
    </Layout>
  );
}

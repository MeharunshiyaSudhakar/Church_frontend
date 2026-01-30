// src/pages/ChildrenMinistry.jsx
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./ChildrenMinistry.css";
import { useNavigate } from "react-router-dom";

export default function ChildrenMinistry() {
  const [activities, setActivities] = useState([]);
  const [worship, setWorship] = useState([]);
  const [videos, setVideos] = useState([]);
  const [folders, setFolders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/children-admin/images/activities").then(r => r.json()).then(setActivities).catch(()=>[]);
    fetch("http://localhost:5000/api/children-admin/images/worship").then(r => r.json()).then(setWorship).catch(()=>[]);
    fetch("http://localhost:5000/api/children-admin/videos").then(r => r.json()).then(setVideos).catch(()=>[]);
    fetch("http://localhost:5000/api/children-admin/folders").then(r => r.json()).then(async (f) => {
      setFolders(f);
      const map = {};
      await Promise.all(f.map(async (folder) => {
        const files = await fetch(`http://localhost:5000/api/children-admin/folders/${folder.id}/files`).then(r => r.json());
        map[folder.id] = files;
      }));
    }).catch(()=>[]);
  }, []);

  const getEmbed = (url) => {
    if (!url) return "";
    if (url.includes("embed/")) return url;
    if (url.includes("watch?v=")) return url.replace("watch?v=", "embed/");
    // fallback: return as-is
    return url;
  };


  return (
    <>
      <Header />
      <div className="children-container public-children">
        <h2>Children's Ministry</h2>
        <p className="page-subtitle">Helping kids grow in God's love!</p>

        {/* Section 1 */}
        <section className="image-section">
          <h3>Sunday School Activities</h3>
          <div className="images-grid">
            {activities.map(a => <img key={a.id} src={a.url} alt="activity" />)}
            {activities.length === 0 && (
              <>
                <img src="https://via.placeholder.com/300x200" alt="placeholder" />
                <img src="https://via.placeholder.com/300x200" alt="placeholder" />
                <img src="https://via.placeholder.com/300x200" alt="placeholder" />
              </>
            )}
          </div>
        </section>

        {/* Section 2 */}
        <section className="image-section">
          <h3>Kids Worship Moments</h3>
          <div className="images-grid">
            {worship.map(a => <img key={a.id} src={a.url} alt="worship" />)}
            {worship.length === 0 && (
              <>
                <img src="https://via.placeholder.com/300x200" alt="placeholder" />
                <img src="https://via.placeholder.com/300x200" alt="placeholder" />
                <img src="https://via.placeholder.com/300x200" alt="placeholder" />
              </>
            )}
          </div>
        </section>

        {/* Videos */}
        <section className="video-section">
  <h3>Sunday School Videos</h3>

  <div className="video-grid">
    {videos.map(v => (
      <div className="video-card" key={v.id}>
        <h4>{v.title}</h4>

        {/* VIDEO EMBED */}
        <iframe
          width="100%"
          height="260"
          src={
            v.youtube_url.includes("watch?v=")
              ? v.youtube_url.replace("watch?v=", "embed/")
              : v.youtube_url
          }
          title={v.title}
          allowFullScreen
        />

        {/* COPY LINK – HYPERTEXT ONLY */}
        <p
          className="copy-link"
          onClick={() => {
            navigator.clipboard.writeText(v.youtube_url);
            alert("YouTube link copied!");
          }}
          style={{
            cursor: "pointer",
            color: "#1a73e8",
            textDecoration: "underline",
            marginTop: "8px",
          }}
        >
          Copy video link
        </p>
      </div>
    ))}

    {videos.length === 0 && <p>No videos published yet.</p>}
  </div>
</section>



        {/* Folders */}
        <section className="syllabus-section">
  <h3>Sunday School Syllabus</h3>

  <div className="folders-grid public-folders">
    {folders.map(folder => (
      <div
        key={folder.id}
        className="flower-folder"
        onClick={() => navigate(`/children/folder/${folder.id}`)}
      >
        <div className="flower-outer">
          <div className="folder-name">{folder.name}</div>
        </div>
      </div>
    ))}

    {folders.length === 0 && <p>No folders yet.</p>}
  </div>
</section>

      </div>
      <Footer />
    </>
  );
}

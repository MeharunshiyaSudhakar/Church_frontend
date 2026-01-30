import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./ChildrenMinistry.css";

export default function ChildrenFolder() {
  const { id } = useParams();
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/children-admin/folders/${id}/files`)
      .then(res => res.json())
      .then(data => setFiles(data))
      .catch(err => console.error(err));
  }, [id]);

  // 🔹 SPLIT BY CATEGORY
  const pdfs = files.filter(f => f.file_type === "pdf");
  const images = files.filter(f => f.file_type === "image");
  const videos = files.filter(f => f.file_type === "video");

  return (
    <>
      <Header />

      <div className="children-container">
        <h2>Sunday School Folder</h2>

        {/* ================= PDF SECTION ================= */}
        <section className="folder-section">
          <h3>📄 PDF Documents</h3>

          {pdfs.length === 0 ? (
            <p>No PDF files available.</p>
          ) : (
            <ul className="pdf-list">
              {pdfs.map(file => (
                <li key={file.id}>
                  <a href={file.file_url} download>
                    {file.filename}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* ================= IMAGE SECTION ================= */}
        <section className="folder-section">
          <h3>🖼 Images</h3>

          {images.length === 0 ? (
            <p>No images available.</p>
          ) : (
            <div className="image-grid">
              {images.map(file => (
                <img
                  key={file.id}
                  src={file.file_url}
                  alt={file.filename}
                />
              ))}
            </div>
          )}
        </section>

        {/* ================= VIDEO SECTION ================= */}
        <section className="folder-section">
          <h3>🎬 Videos</h3>

          {videos.length === 0 ? (
            <p>No videos available.</p>
          ) : (
            <div className="video-grid">
              {videos.map(file => (
                <video key={file.id} controls width="300">
                  <source src={file.file_url} />
                </video>
              ))}
            </div>
          )}
        </section>
      </div>

      <Footer />
    </>
  );
}

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./MessageFolder.css";


export default function MessageFolder() {
  const { id } = useParams();
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/messages/folders/${id}/files`)
      .then(r=>r.json())
      .then(setFiles);
  }, [id]);

  return (
  <div className="message-folder-page">
    <h2 className="folder-title">📂 Messages</h2>

    {/* PDFs */}
    <section className="file-section">
      <h3>📄 PDFs</h3>
      <div className="pdf-list">
        {files.filter(f => f.file_type === "pdf").map(f => (
          <a key={f.id} href={f.file_url} download className="pdf-item">
            {f.filename}
          </a>
        ))}
      </div>
    </section>

    {/* Images */}
    <section className="file-section">
      <h3>🖼 Images</h3>
      <div className="image-grid">
        {files.filter(f => f.file_type === "image").map(f => (
          <img key={f.id} src={f.file_url} alt="" />
        ))}
      </div>
    </section>

    {/* Videos */}
    <section className="file-section">
      <h3>🎬 Videos</h3>
      <div className="video-grid">
        {files.filter(f => f.file_type === "video").map(f => (
          <video key={f.id} controls src={f.file_url} />
        ))}
      </div>
    </section>
  </div>
);

}

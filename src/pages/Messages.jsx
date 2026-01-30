import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Messages() {
  const [folders, setFolders] = useState([]);
  const [openFolder, setOpenFolder] = useState(null);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/messages/folders")
      .then(res => res.json())
      .then(setFolders);
  }, []);

  const open = async (folder) => {
    setOpenFolder(folder);
    const res = await fetch(
      `http://localhost:5000/api/messages/folders/${folder.id}/files`
    );
    setFiles(await res.json());
  };

  return (
    <>
      <Header />

      <div className="messages-container">

        <h2>Messages</h2>

        {!openFolder && (
          <div className="folders-grid">
  {folders.map((f) => (
    <div
      key={f.id}
      className="folder-card"
      onClick={() => open(f)}
    >
      <div className="flower-border">
        <div className="folder-center">
          <div className="folder-name">{f.name}</div>
          <div className="folder-open">Open</div>
        </div>
      </div>
    </div>
  ))}
</div>

        )}

        {openFolder && (
          <>
            <button onClick={() => setOpenFolder(null)}>← Back</button>

            <h3>{openFolder.name}</h3>

            <h4>📄 PDFs</h4>
            <ul>
              {files.filter(f => f.file_type === "pdf").map(f => (
                <li key={f.id}>
                  <a href={f.file_url} download>
                    {f.filename}
                  </a>
                </li>
              ))}
            </ul>

            <h4>🖼 Images</h4>
            <div className="image-grid">
              {files.filter(f => f.file_type === "image").map(f => (
                <img key={f.id} src={f.file_url} alt="" />
              ))}
            </div>

            <h4>🎬 Videos</h4>
            {files.filter(f => f.file_type === "video").map(f => (
              <video key={f.id} controls width="320">
                <source src={f.file_url} />
              </video>
            ))}
          </>
        )}
      </div>

      <Footer />
    </>
  );
}

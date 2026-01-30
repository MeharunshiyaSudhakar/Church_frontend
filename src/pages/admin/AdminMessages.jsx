import { useEffect, useState } from "react";
import AdminHeader from "../../components/admin/AdminHeader";
import "./AdminChildrenFolders.css";

export default function AdminMessages() {
  const token = localStorage.getItem("token");

  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [newMonth, setNewMonth] = useState("");
  const [newYear, setNewYear] = useState("");
  const [openFolder, setOpenFolder] = useState(null);
  const [fileCategory, setFileCategory] = useState("pdf");
  const [uploadFile, setUploadFile] = useState(null);

  const headers = { Authorization: `Bearer ${token}` };

  const loadFolders = async () => {
    const r = await fetch("http://localhost:5000/api/messages/folders");
    setFolders(await r.json());
  };

  const loadFiles = async (id) => {
    setOpenFolder(id);
    const r = await fetch(`http://localhost:5000/api/messages/folders/${id}/files`);
    setFiles(await r.json());
  };

  useEffect(() => {
    loadFolders();
  }, []);

  const createFolder = async () => {
  if (!newMonth || !newYear) {
    alert("Month & Year required");
    return;
  }

  const res = await fetch("http://localhost:5000/api/messages/folders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      month: newMonth,
      year: newYear,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Create folder error:", err);
    alert("Folder creation failed");
    return;
  }

  setNewMonth("");
  setNewYear("");
  loadFolders();
};


const deleteFolder = async (id) => {
  if (!window.confirm("Delete this folder and all its files?")) return;

  const res = await fetch(
    `http://localhost:5000/api/messages/folders/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    alert("Delete failed");
    return;
  }

  // reset state
  setOpenFolder(null);
  setFiles([]);
  loadFolders();
};


  const handleFileUpload = async () => {
  if (!uploadFile || !openFolder) {
    alert("Please select a file and folder");
    return;
  }

  const fd = new FormData();
  fd.append("file", uploadFile);
  fd.append("folder_id", openFolder);

  const res = await fetch("http://localhost:5000/api/messages/upload", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: fd,
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Upload failed:", err);
    alert("Upload failed");
    return;
  }

  setUploadFile(null);
  loadFiles(openFolder);
};


  return (
    <>
      <AdminHeader />

      <div className="admin-container">
        <h2>Messages — Folder Manager</h2>

        <div className="admin-form">
          <input
            placeholder="Month"
            value={newMonth}
            onChange={(e) => setNewMonth(e.target.value)}
          />
          <input
            placeholder="Year"
            value={newYear}
            onChange={(e) => setNewYear(e.target.value)}
          />
          <button onClick={createFolder}>Create Folder</button>
        </div>

        <div className="folders-grid">
  {folders.map((f) => (
    <div
      key={f.id}
      className="folder-card"
      onClick={() => loadFiles(f.id)}
    >
      <div className="flower-border">
        <div className="folder-center">
          <div className="folder-name">{f.name}</div>
          <div className="folder-open">{f.year}</div>
        </div>
      </div>

      <button
        className="delete-folder-btn"
        onClick={(e) => {
          e.stopPropagation();
          deleteFolder(f.id);
        }}
      >
        ✕
      </button>
    </div>
  ))}
</div>


        {openFolder && (
          <div className="files-panel">
            <h3>Upload Files</h3>

            <select
              value={fileCategory}
              onChange={(e) => setFileCategory(e.target.value)}
            >
              <option value="pdf">PDF</option>
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>

            <input
              type="file"
              accept={
                fileCategory === "pdf"
                  ? ".pdf"
                  : fileCategory === "image"
                  ? ".jpg,.jpeg,.png"
                  : ".mp4,.webm"
              }
              onChange={(e) => setUploadFile(e.target.files[0])}
            />

            <button onClick={handleFileUpload}>Upload</button>

            <ul>
              {files.map((f) => (
                <li key={f.id}>
                  <a href={f.file_url} target="_blank" rel="noreferrer">
                    {f.filename}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}

import { useEffect, useState } from "react";
import AdminHeader from "../../components/admin/AdminHeader";
import "./AdminChildrenFolders.css";

export default function AdminChildrenFolders() {
  const token = localStorage.getItem("token");

  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [newFolder, setNewFolder] = useState("");
  const [openFolder, setOpenFolder] = useState(null);
  const [fileCategory, setFileCategory] = useState("pdf");
  const [uploadFile, setUploadFile] = useState(null);

  const loadFolders = async () => {
    const res = await fetch("http://localhost:5000/api/children-admin/folders");
    setFolders(await res.json());
  };

  const loadFiles = async (folderId) => {
    setOpenFolder(folderId);
    const res = await fetch(
      `http://localhost:5000/api/children-admin/folders/${folderId}/files`
    );
    setFiles(await res.json());
  };

  useEffect(() => {
    loadFolders();
  }, []);

  const createFolder = async () => {
    if (!newFolder) return alert("Enter folder name");

    await fetch("http://localhost:5000/api/children-admin/folders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: newFolder }),
    });

    setNewFolder("");
    loadFolders();
  };

  const deleteFolder = async (id) => {
  if (!window.confirm("Delete folder and all files?")) return;

  const res = await fetch(
    `http://localhost:5000/api/children-admin/folders/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  if (!res.ok) {
    alert("Delete failed");
    return;
  }

  setOpenFolder(null);
  setFiles([]);
  loadFolders();
};


  const handleFileUpload = async () => {
    if (!uploadFile || !openFolder) {
      alert("Select folder and file");
      return;
    }

    const fd = new FormData();
    fd.append("file", uploadFile);
    fd.append("folder_id", openFolder);

    const res = await fetch(
      "http://localhost:5000/api/children-admin/upload-file",
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      }
    );

    if (!res.ok) {
      alert("File upload failed");
      return;
    }

    setUploadFile(null);
    loadFiles(openFolder);
  };

  const deleteFile = async (id) => {
    await fetch(`http://localhost:5000/api/children-admin/files/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    loadFiles(openFolder);
  };

  return (
    <>
      <AdminHeader />

      <div className="admin-container">
        <h2>Children’s Ministry — Folder Manager</h2>

        <div className="admin-form">
          <input
            placeholder="Folder name (eg. MAY 2025)"
            value={newFolder}
            onChange={(e) => setNewFolder(e.target.value)}
          />
          <button onClick={createFolder}>Create Folder</button>
        </div>

        <div className="folder-grid">
          {folders.map((f) => (
            <div
              key={f.id}
              className="flower-folder"
              onClick={() => loadFiles(f.id)}
            >
              <div className="folder-center">{f.name}</div>

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
            <h3>Upload File to Folder</h3>

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
                  ? ".jpg,.jpeg,.png,.webp"
                  : ".mp4,.webm"
              }
              onChange={(e) => setUploadFile(e.target.files[0])}
            />

            <button onClick={handleFileUpload}>Upload</button>

            <h4>Files</h4>
            <ul>
              {files.map((f) => (
                <li key={f.id}>
                  <a href={f.file_url} target="_blank" rel="noreferrer">
                    {f.filename}
                  </a>
                  <button onClick={() => deleteFile(f.id)}>Delete</button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}

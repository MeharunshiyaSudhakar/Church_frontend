import { useEffect, useState } from "react";
import AdminHeader from "../../components/admin/AdminHeader";
import "../../pages/ChildrenMinistry.css"; // reuse styling (or create admin-specific CSS)

export default function AdminChildren() {
  const token = localStorage.getItem("token");
  const [activities, setActivities] = useState([]);
  const [worship, setWorship] = useState([]);
  const [videos, setVideos] = useState([]);
  const [folders, setFolders] = useState([]);
  const [folderFiles, setFolderFiles] = useState({}); // {folderId: [files]}

  // upload form states
  const [imageSection, setImageSection] = useState("activities");
  const [imageFile, setImageFile] = useState(null);

  const [videoForm, setVideoForm] = useState({ title: "", youtube_url: "" });

  const [newFolderName, setNewFolderName] = useState("");
  const [uploadFolderId, setUploadFolderId] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [fileCategory, setFileCategory] = useState("pdf"); // pdf | image | video

  const headersAuth = token ? { Authorization: `Bearer ${token}` } : {};

  const fetchAll = async () => {
    const [a, w, v, f] = await Promise.all([
      fetch("http://localhost:5000/api/children-admin/images/activities").then((r) => r.json()),
      fetch("http://localhost:5000/api/children-admin/images/worship").then((r) => r.json()),
      fetch("http://localhost:5000/api/children-admin/videos").then((r) => r.json()),
      fetch("http://localhost:5000/api/children-admin/folders").then((r) => r.json()),
    ]);

    setActivities(a);
    setWorship(w);
    setVideos(v);
    setFolders(f);

    // load files for each folder
    const filesMap = {};
    await Promise.all(
      f.map(async (folder) => {
        const files = await fetch(
          `http://localhost:5000/api/children-admin/folders/${folder.id}/files`
        ).then((r) => r.json());
        filesMap[folder.id] = files;
      })
    );
    setFolderFiles(filesMap);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // ---------- Images ----------
  const handleImageUpload = async () => {
    if (!imageFile) return alert("Choose an image");

    const fd = new FormData();
    fd.append("image", imageFile);
    fd.append("section", imageSection);

    const res = await fetch("http://localhost:5000/api/children-admin/images", {
      method: "POST",
      headers: { ...headersAuth }, // multer uses form-data
      body: fd,
    });

    if (res.ok) {
      setImageFile(null);
      fetchAll();
    } else {
      alert("Upload failed");
    }
  };

  const deleteImage = async (id) => {
    if (!window.confirm("Delete image?")) return;

    await fetch(`http://localhost:5000/api/children-admin/images/${id}`, {
      method: "DELETE",
      headers: headersAuth,
    });

    fetchAll();
  };

  // ---------- Videos ----------
  const addOrUpdateVideo = async () => {
    if (!videoForm.title || !videoForm.youtube_url) return alert("Fill fields");

    const method = videoForm.id ? "PUT" : "POST";
    const url = videoForm.id
      ? `http://localhost:5000/api/children-admin/videos/${videoForm.id}`
      : "http://localhost:5000/api/children-admin/videos";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headersAuth,
      },
      body: JSON.stringify({
        title: videoForm.title,
        youtube_url: videoForm.youtube_url,
      }),
    });

    if (res.ok) {
      setVideoForm({ title: "", youtube_url: "" });
      fetchAll();
    } else {
      alert("Video save failed");
    }
  };

  const editVideo = (v) =>
    setVideoForm({ id: v.id, title: v.title, youtube_url: v.youtube_url });

  const deleteVideo = async (id) => {
    if (!window.confirm("Delete video?")) return;

    await fetch(`http://localhost:5000/api/children-admin/videos/${id}`, {
      method: "DELETE",
      headers: headersAuth,
    });

    fetchAll();
  };

  // ---------- Folders ----------
  const createFolder = async () => {
    if (!newFolderName) return alert("Enter folder name");

    const res = await fetch("http://localhost:5000/api/children-admin/folders", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headersAuth },
      body: JSON.stringify({ name: newFolderName }),
    });

    if (res.ok) {
      setNewFolderName("");
      fetchAll();
    } else {
      alert("Create failed");
    }
  };

  const deleteFolder = async (id) => {
    if (!window.confirm("Delete folder and its files?")) return;

    await fetch(`http://localhost:5000/api/children-admin/folders/${id}`, {
      method: "DELETE",
      headers: headersAuth,
    });

    fetchAll();
  };

  // ---------- Files ----------
  const handleFileUpload = async () => {
    if (!uploadFolderId || !uploadFile)
      return alert("Select folder and file");

    const fd = new FormData();
    fd.append("file", uploadFile);
    fd.append("folder_id", uploadFolderId);

    const res = await fetch(
      "http://localhost:5000/api/children-admin/upload-file",
      {
        method: "POST",
        headers: headersAuth,
        body: fd,
      }
    );

    if (res.ok) {
      setUploadFile(null);
      fetchAll();
    } else {
      alert("File upload failed");
    }
  };

  const deleteFile = async (id) => {
    if (!window.confirm("Delete file?")) return;

    await fetch(`http://localhost:5000/api/children-admin/files/${id}`, {
      method: "DELETE",
      headers: headersAuth,
    });

    fetchAll();
  };

  return (
    <>
      {/* ✅ ADMIN HEADER */}
      <AdminHeader />

      <div className="admin-children admin-container">
        <h2>Manage Children's Ministry</h2>

        {/* IMAGES */}
        <section className="admin-section">
          <h3>Images — Upload</h3>
          <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
            <select
              value={imageSection}
              onChange={(e) => setImageSection(e.target.value)}
            >
              <option value="activities">Activities</option>
              <option value="worship">Worship</option>
            </select>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
            />

            <button onClick={handleImageUpload}>Upload Image</button>
          </div>

          <div className="images-grid">
            <div>
              <h4>Activities</h4>
              <div className="images-row">
                {activities.map((img) => (
                  <div key={img.id} className="image-card">
                    <img src={img.url} alt="" />
                    <button onClick={() => deleteImage(img.id)}>Delete</button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4>Worship</h4>
              <div className="images-row">
                {worship.map((img) => (
                  <div key={img.id} className="image-card">
                    <img src={img.url} alt="" />
                    <button onClick={() => deleteImage(img.id)}>Delete</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* VIDEOS */}
        <section className="admin-section">
          <h3>YouTube Videos</h3>
          <div className="admin-form">
            <input
              placeholder="Title"
              value={videoForm.title}
              onChange={(e) =>
                setVideoForm({ ...videoForm, title: e.target.value })
              }
            />
            <input
              placeholder="YouTube URL"
              value={videoForm.youtube_url}
              onChange={(e) =>
                setVideoForm({ ...videoForm, youtube_url: e.target.value })
              }
            />
            <button onClick={addOrUpdateVideo}>
              {videoForm.id ? "Update" : "Add Video"}
            </button>
            {videoForm.id && (
              <button onClick={() => setVideoForm({ title: "", youtube_url: "" })}>
                Cancel
              </button>
            )}
          </div>

          <ul className="admin-list">
            {videos.map((v) => (
              <li key={v.id}>
                <strong>{v.title}</strong>
                <button onClick={() => editVideo(v)}>Edit</button>
                <button onClick={() => deleteVideo(v.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </section>

        {/* FOLDERS & FILES */}
        <section className="admin-section">
          <h3>Folders</h3>

          <input
            placeholder="New folder name"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
          />
          <button onClick={createFolder}>Create Folder</button>

          <select
            value={uploadFolderId || ""}
            onChange={(e) => setUploadFolderId(e.target.value)}
          >
            <option value="">Select folder</option>
            {folders.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
                
              </option>
            ))}
          </select>

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

          <button onClick={handleFileUpload}>Upload File</button>

          {folders.map((f) => (
  <div key={f.id} style={{ marginBottom: "16px" }}>
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <h4 style={{ margin: 0 }}>{f.name}</h4>
      <button
        style={{ background: "red", color: "#fff" }}
        onClick={() => deleteFolder(f.id)}
      >
        Delete Folder
      </button>
    </div>

    <ul>
      {(folderFiles[f.id] || []).map((file) => (
        <li key={file.id}>
          <a href={file.file_url} target="_blank" rel="noreferrer">
            {file.filename}
          </a>
          <button onClick={() => deleteFile(file.id)}>Delete</button>
        </li>
      ))}
    </ul>
  </div>
))}

        </section>
      </div>
    </>
  );
}

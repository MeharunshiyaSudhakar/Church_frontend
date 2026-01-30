import { useNavigate } from "react-router-dom";
import "./AdminHeader.css";

export default function AdminHeader() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/admin-login");
  };

  return (
    <div className="admin-header">
      <h3>Admin Panel</h3>

      <nav>
        <button onClick={() => navigate("/admin")}>Dashboard</button>
        <button onClick={() => navigate("/admin/mission")}>Mission</button>
        <button onClick={() => navigate("/admin/messages")}>Messages</button>
        <button onClick={() => navigate("/admin/children")}>Children</button>
        <button onClick={() => navigate("/admin/subscriptions")}>Subscriptions</button>
        <button onClick={logout}>Logout</button>
      </nav>
    </div>
  );
}

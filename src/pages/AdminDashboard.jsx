import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../components/admin/AdminHeader";

import AdminCarousel from "../pages/admin/AdminCarousel";
import AdminEvents from "../pages/admin/AdminEvents";
import AdminServiceTimes from "../pages/admin/AdminServiceTimes";

import "./AdminDashboard.css";

export default function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    if (!token || role !== "admin") {
      navigate("/admin-login");
    }
  }, [navigate]);

  return (
    <>
      {/* ✅ SINGLE ADMIN HEADER */}
      <AdminHeader />

      <div className="admin-container">
        <h2 className="admin-title">Admin Dashboard</h2>
        <p className="admin-subtitle">Manage website content</p>

        {/* ✅ SECTIONS */}
        <AdminCarousel />
        <AdminServiceTimes />
        <AdminEvents />
      </div>
    </>
  );
}

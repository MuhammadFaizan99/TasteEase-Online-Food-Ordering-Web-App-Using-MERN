import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminHome from "./Home/AdminHome";
import "./MainAdminHome.css";

export default function MainAdminHome() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className={`main-admin-home ${isSidebarOpen ? "sidebar-open" : ""}`}>
      <div className="sidebar">
        <AdminHome />
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}

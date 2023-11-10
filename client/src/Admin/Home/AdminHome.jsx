import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./AdminHome.css";

const AdminHome = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <div className="admin-home">
      <button className={`hamburger-icon ${isNavOpen ? "hidden" : ""}`} onClick={() => setIsNavOpen(true)}>
        ☰
      </button>
      <h1 className={`admin-panel-heading ${isNavOpen ? "hidden" : ""}`}>Admin Panel</h1>
      <ul className={`nav ${isNavOpen ? "open" : ""}`}>
        <li>
          <span className={`close-icon ${isNavOpen ? "" : "hidden"}`} onClick={() => setIsNavOpen(false)}>
            ×
          </span>
          <Link to="/admin">
            <span className="icon">&#x1F464;</span>
            Manage Users
          </Link>
        </li>
        <li>
          <Link to="/admin/menu">
            <span className="icon">&#x1F374;</span>
            Menu
          </Link>
        </li>
        <li>
          <Link to="/admin/teams">
            <span className="icon">&#x1F6E0;</span>
            Teams
          </Link>
        </li>
        <li>
          <Link to="/admin/orders">
            <span className="icon">&#x1F6D2;</span>
            Orders
          </Link>
        </li>
        <li>
          <Link to="/admin/support">
            <span className="icon">&#x1F4DE;</span>
            Customer Support
          </Link>
        </li>
        <li>
          <Link to="/admin/analytics">
            <span className="icon">&#x1F4C8;</span>
            Analytics
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminHome;

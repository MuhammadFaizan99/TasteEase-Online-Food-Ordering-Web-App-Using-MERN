import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchProfileImage(token);
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, []);

  const fetchProfileImage = async (token) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BASE_URL}/users/profileImage`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProfileImage(response.data.profileImage);
    } catch (error) {
      console.error("Error fetching profile image:", error);
    }
  };

  const handleToggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId"); // Remove userId from localStorage
    setIsLoggedIn(false);
    navigate("/");
  };

  const handleDashboard = () => {
    navigate("/dashboard");
  };

  const handleLogin = () => {
    navigate("/signIn");
  };

  return (
    <nav className="navbar">
      <div className="top-center">
        <img src="../../../images/logo.png" alt="Logo" />
      </div>
      <div className={`navbar-content ${showMenu ? "active" : ""}`}>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/menu">Menu</Link>
          </li>
          <li>
            <Link to="/order">Order</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
        {isLoggedIn && (
          <div className="user-options">
            <div className="user-profile" onClick={handleToggleMenu}>
              <img
                src={`http://localhost:5173/uploads/${profileImage}`}
                alt="User"
              />
              <div className="dropdown-icon">
                <i
                  className={`fas ${
                    showMenu ? "fa-caret-up" : "fa-caret-down"
                  }`}
                ></i>
              </div>
            </div>
            {showMenu && (
              <div className="dropdown-menu">
                <button className="btn" onClick={handleDashboard}>
                  Dashboard
                </button>
                <button className="btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
        {!isLoggedIn && (
          <div className="buttons">
            <button className="btn" onClick={handleLogin}>
              Login
            </button>
          </div>
        )}
      </div>
      <div
        className={`menu-toggle ${showMenu ? "active" : ""}`}
        onClick={handleToggleMenu}
      >
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>
    </nav>
  );
};

export default Navbar;

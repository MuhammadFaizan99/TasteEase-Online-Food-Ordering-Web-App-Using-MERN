import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          Taste <span>Ease</span>
        </div>
        <div className="footer-info">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
            facilisi. Praesent euismod justo non tortor gravida, in interdum
            augue viverra.
          </p>
        </div>
        <div className="social-and-search">
          <div className="search-box">
            <input
              type="text"
              className="search-input"
              placeholder="Search..."
            />
            <button className="search-icon">
              <i className="fas fa-search"></i>
            </button>
          </div>
          <div className="social-icons">
            <a href="#" className="social-icon">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="#" className="social-icon">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="social-icon">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
        <p className="footer-text">
          &copy; {new Date().getFullYear()} TasteEase. All rights reserved. |
          Designed by <a href="#">Team</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;

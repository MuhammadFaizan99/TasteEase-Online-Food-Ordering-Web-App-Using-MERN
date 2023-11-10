import React, { useState } from "react";
import { FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Contact.css";

const Contact = ({ userRole }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [query, setQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BASE_URL}/customers/createQueries`,
        {
          Name: name,
          Email: email,
          Query: query,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);
      setName("");
      setEmail("");
      setQuery("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewResolvedQueries = () => {
    navigate("resolvequery");
  };

  return (
    <div className="contact-us">
      <div className="contact-header">
        <h2>Contact Us</h2>
        <p>We'd love to hear from you!</p>
      </div>
      <div className="contact-details">
        <div className="contact-item">
          <FaEnvelope className="icon" />
          <div className="info">
            <h3>Email</h3>
            <p>info@example.com</p>
          </div>
        </div>
        <div className="contact-item">
          <FaPhoneAlt className="icon" />
          <div className="info">
            <h3>Phone</h3>
            <p>+1 (123) 456-7890</p>
          </div>
        </div>
      </div>
      <div className="contact-form">
        <h3>Get in Touch</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <textarea
            placeholder="Your Query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            required
          ></textarea>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Query"}
          </button>
          {userRole === "admin" && (
            <button type="button" onClick={handleViewResolvedQueries}>
              View Resolved Queries
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Contact;

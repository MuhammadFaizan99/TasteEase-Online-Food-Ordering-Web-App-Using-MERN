import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./SignUpForm.css";

const SignUpForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Name: "",
    Email: "",
    Password: "",
    ConfirmPassword: "",
    Role: "user",
    AdminPassword: "",
    ProfileImage: null,
  });

  const handleSignUp = async () => {
    try {
      if (formData.Password !== formData.ConfirmPassword) {
        alert("Passwords do not match. Please confirm your password.");
        return;
      }

      if (
        formData.Role === "admin" &&
        formData.AdminPassword !== "food@1234"
      ) {
        alert("Invalid admin password");
        return;
      }

      const data = new FormData();
      data.append("Name", formData.Name);
      data.append("Email", formData.Email);
      data.append("Password", formData.Password);
      data.append("ConfirmPassword", formData.ConfirmPassword);
      data.append("Role", formData.Role);
      data.append("AdminPassword", formData.AdminPassword);
      data.append("ProfileImage", formData.ProfileImage);

      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BASE_URL}/users/signUp`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        alert("User registered successfully!");
        navigate("/signIn");
      } else {
        alert("An error occurred while signing up.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while signing up.");
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleImageUpload = (event) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      ProfileImage: event.target.files[0],
    }));
  };

  return (
    <div className="center-container">
      <div className="form-container">
        <div className="logo-container">
          <img src="../../../images/logo.png" alt="Sign Up Logo" />
        </div>
        <h2>Sign Up</h2>
        <div className="input-group">
          <span className="input-icon">👤</span>
          <input
            type="text"
            name="Name"
            placeholder="Name"
            value={formData.Name}
            onChange={handleInputChange}
          />
        </div>
        <div className="input-group">
          <span className="input-icon">✉️</span>
          <input
            type="email"
            name="Email"
            placeholder="Email"
            value={formData.Email}
            onChange={handleInputChange}
          />
        </div>
        <div className="input-group">
          <span className="input-icon">🔒</span>
          <input
            type="password"
            name="Password"
            placeholder="Password"
            value={formData.Password}
            onChange={handleInputChange}
          />
        </div>
        <div className="input-group">
          <span className="input-icon">🔒</span>
          <input
            type="password"
            name="ConfirmPassword"
            placeholder="Confirm Password"
            value={formData.ConfirmPassword}
            onChange={handleInputChange}
          />
        </div>
        <div className="input-group">
          <span className="input-icon">👥</span>
          <select
            name="Role"
            value={formData.Role}
            onChange={handleInputChange}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        {formData.Role === "admin" && (
          <div className="input-group">
            <span className="input-icon">🔑</span>
            <input
              type="password"
              name="AdminPassword"
              placeholder="Admin Password"
              value={formData.AdminPassword}
              onChange={handleInputChange}
            />
          </div>
        )}
        <div className="input-group">
          <span className="input-icon">📸</span>
          <input
            type="file"
            accept="image/*"
            name="ProfileImage"
            onChange={handleImageUpload}
          />
        </div>
        <button onClick={handleSignUp}>Sign Up</button>
        <p className="already-member">
          Already a member? <Link to="/signIn">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;

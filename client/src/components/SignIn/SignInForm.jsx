import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SignInForm.css";
import axios from "axios";

const SignInForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Email: "",
    Password: "",
  });

  const handleSignIn = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BASE_URL}/users/signIn`,
        formData
      );
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.userId);
      localStorage.setItem("userRole", response.data.role); // Store user role

      if (response.data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  return (
    <div className="center-container">
      <div className="form-container">
        <div className="logo-container">
          <img src="../../../images/logo.png" alt="Sign In Logo" />
        </div>
        <h2>Sign In</h2>
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
        <button onClick={handleSignIn}>Sign In</button>
        <p className="new-member">
          New here? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default SignInForm;

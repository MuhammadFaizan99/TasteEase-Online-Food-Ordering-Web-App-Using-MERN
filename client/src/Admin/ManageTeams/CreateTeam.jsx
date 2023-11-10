import React, { useState } from "react";
import axios from "axios";
import "./CreateTeam.css";

const CreateTeam = () => {
  const [name, setName] = useState("");
  const [experience, setExperience] = useState("");
  const [role, setRole] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("Name", name);
    formData.append("Experience", experience);
    formData.append("Role", role);
    formData.append("Speciality", speciality);
    formData.append("image", image);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to create a team.");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      await axios.post(
        `${import.meta.env.VITE_REACT_APP_BASE_URL}/team/createTeam`,
        formData,
        config
      );
      alert("Team created successfully!");
      setName("");
      setExperience("");
      setRole("");
      setSpeciality("");
      setImage(null);
    } catch (error) {
      console.error("Error creating team:", error);
      alert("Error creating team. Please try again.");
    }
  };

  return (
    <div className="menu-creation-container">
      <h2>Create Team</h2>
      <form className="menu-form" onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <label htmlFor="experience">Experience</label>
        <input
          type="text"
          id="experience"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          required
        />
        <label htmlFor="role">Role</label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        >
          <option value="">Select Role</option>
          <option value="Head Chef">Head Chef</option>
          <option value="French Pastries">French Pastries</option>
          <option value="BBQ Delights">BBQ Delights</option>
        </select>
        <label htmlFor="speciality">Speciality</label>
        <input
          type="text"
          id="speciality"
          value={speciality}
          onChange={(e) => setSpeciality(e.target.value)}
          required
        />
        <label htmlFor="image">Image</label>
        <input
          type="file"
          id="image"
          onChange={(e) => setImage(e.target.files[0])}
          accept="image/*"
          required
        />
        <button type="submit">Create Team</button>
      </form>
    </div>
  );
};

export default CreateTeam;

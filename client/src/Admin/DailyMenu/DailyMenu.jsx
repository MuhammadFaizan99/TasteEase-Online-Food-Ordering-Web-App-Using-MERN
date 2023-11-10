import React, { useState } from "react";
import axios from "axios";
import "./DailyMenu.css";

const DailyMenu = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [time, setTime] = useState("Breakfast");
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const convertedPrice = parseFloat(price);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", convertedPrice);
    formData.append("time", time);
    formData.append("image", image);

    try {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage
      await axios.post(`${import.meta.env.VITE_REACT_APP_BASE_URL}/menu/createMenu`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Menu item created successfully!");
      // Clear form fields after successful submission
      setName("");
      setDescription("");
      setPrice("");
      setTime("Breakfast");
      setImage(null);
    } catch (error) {
      console.error(error);
      alert("An error occurred while creating the menu item.");
    }
  };

  return (
    <div className="menu-creation-container">
      <h2>Create Menu Item</h2>
      <div className="menu-form">
        <form onSubmit={handleSubmit}>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <label>Price:</label>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          <label>Time:</label>
          <select value={time} onChange={(e) => setTime(e.target.value)}>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
          </select>
          <label>Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            required
          />
          <button type="submit">Create Menu Item</button>
        </form>
      </div>
    </div>
  );
};

export default DailyMenu;

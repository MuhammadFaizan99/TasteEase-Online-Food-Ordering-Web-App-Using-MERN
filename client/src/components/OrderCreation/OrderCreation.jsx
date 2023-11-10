import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "./OrderCreation.css";

const OrderCreation = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [isSuccessAlertVisible, setIsSuccessAlertVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState("0.00");

  const navigate = useNavigate();
  const { category } = useParams();
  const location = useLocation();
  const initialItemName = location.state ? location.state.itemName : "";

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }

    setItemName(initialItemName);
    fetchMenu();
  }, [isLoggedIn, initialItemName]);

  const fetchMenu = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BASE_URL}/menu/getMenu`);
      setMenuItems(response.data);
    } catch (error) {
      console.error("Error fetching menu:", error);
    }
  };

  const handleViewOrders = () => {
    if (!isLoggedIn) {
      alert("Please sign in to view all orders.");
    } else {
      navigate("/order/getOrder");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      alert("Please sign in to create an order.");
      return;
    }

    const selectedMenuItem = menuItems.find((item) => item.name === itemName);

    if (!selectedMenuItem) {
      alert("Please go to the menu and choose a specific item.");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BASE_URL}/orders/createOrder`,
        {
          name,
          address,
          items: [{ name: itemName, quantity: parseInt(quantity) }],
        }
      );

      const itemPrice = selectedMenuItem.price;
      const calculatedTotalPrice = itemPrice * parseInt(quantity);
      setTotalPrice(calculatedTotalPrice.toFixed(2));

      console.log("Order created:", response.data);

      setIsSuccessAlertVisible(true);
      setName("");
      setAddress("");
      setItemName("");
      setQuantity("");
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  const handleQuantityChange = (e) => {
    const newQuantity = e.target.value;
    setQuantity(newQuantity);
  };

  useEffect(() => {
    if (isSuccessAlertVisible) {
      const timer = setTimeout(() => {
        setIsSuccessAlertVisible(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isSuccessAlertVisible]);

  return (
    <div className="center-container">
      <div className="content">
        <h1 className="tagline">
          Your Culinary Desires, Our Delightful Creations
        </h1>
        <p className="content-text">
          Embark on a journey of flavors as you compose your ideal order. Let us
          craft a culinary masterpiece tailored to your taste, and experience
          the joy of exceptional dining delivered right to your doorstep.
        </p>
        <button className="submit-button" onClick={handleViewOrders}>
          View All Orders
        </button>
      </div>
      <div className="form-container">
        <h2>Create New Order</h2>
        <p className="order-description">
          Please provide the following information to create a new order.
        </p>
        <form className="order-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <span className="input-icon">👤</span>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="input-group">
            <span className="input-icon">🏠</span>
            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="input-group">
            <span className="input-icon">📦</span>
            <input
              type="text"
              placeholder="Item Name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
          </div>
          <div className="input-group">
            <span className="input-icon">🔢</span>
            <input
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={handleQuantityChange}
            />
          </div>
          <button className="submit-button" type="submit">
            Create Order
          </button>
        </form>
        <h3>Total Price: ${totalPrice}</h3>
      </div>
      {isSuccessAlertVisible && (
        <div className="success-alert">Order submitted successfully!</div>
      )}
    </div>
  );
};

export default OrderCreation;
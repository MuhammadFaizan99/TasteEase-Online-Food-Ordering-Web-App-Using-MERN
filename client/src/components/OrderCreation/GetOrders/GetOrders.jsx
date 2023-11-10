// GetOrders.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./GetOrders.css";

function GetOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await axios.get(
          "http://localhost:5173/orders/getLoginUserOrder",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Replace with your actual token storage logic
            },
          }
        );

        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  return (
    <div className="page-container">
      {loading ? (
        <div className="loading-container">
          <div className="loading-message">
            <p>Loading...</p>
            <div className="loading-spinner"></div>
          </div>
        </div>
      ) : (
        <div className="orders-container">
          <h2>Your Orders</h2>
          {orders.length === 0 ? (
            <p className="empty-message-bottom">No orders found.</p>
          ) : (
            <ul className="order-list">
              {orders.map((order, index) => (
                <li key={order._id} className="order-item">
                  <h3>Order #{String(index + 1).padStart(2, "0")}</h3>
                  <p>Name: {order.name}</p>
                  <p>Address: {order.address}</p>
                  <p>
                    Items:{" "}
                    {order.items
                      .map((item) => `${item.name} (${item.quantity})`)
                      .join(", ")}
                  </p>
                  <p className={`status ${order.status.toLowerCase()}`}>
                    Status: {order.status}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default GetOrders;

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ClientDashboard.css";

const ClientDashboard = () => {
  const [totalCompletedOrders, setTotalCompletedOrders] = useState(0);
  const [lastPurchaseItem, setLastPurchaseItem] = useState("");
  const [lastPurchaseQuantity, setLastPurchaseQuantity] = useState(0);
  const [lastPurchasePrice, setLastPurchasePrice] = useState(0);
  const [totalPurchase, setTotalPurchase] = useState("0.00");
  const [favoriteItemsWithQuantities, setFavoriteItemsWithQuantities] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [userName, setUserName] = useState("");
  const [mostOrderedItems, setMostOrderedItems] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_REACT_APP_BASE_URL}/orders/getTotalUserOrders`)
      .then(response => {
        setTotalCompletedOrders(response.data.totalCompletedOrders);
      })
      .catch(error => {
        console.error("Error fetching total completed orders:", error);
      });

    axios.get("http://localhost:5173/orders/getLastUserOrder")
      .then(response => {
        const lastOrder = response.data;

        if (lastOrder) {
          setLastPurchaseItem(lastOrder.items[0].name);
          setLastPurchaseQuantity(lastOrder.items[0].quantity);
          fetchItemPriceAndCalculateTotal(lastOrder.items[0].name, lastOrder.items[0].quantity);
          setTotalPurchase(lastOrder.totalPrice);
        }
      })
      .catch(error => {
        console.error("Error fetching last user order:", error);
      });

    axios.get("http://localhost:5173/orders/getUserFavoriteItems")
      .then(response => {
        setFavoriteItemsWithQuantities(response.data);
      })
      .catch(error => {
        console.error("Error fetching user's favorite items with quantities:", error);
      });

    axios.get("http://localhost:5173/orders/getLastThreeUserOrders")
      .then(response => {
        const latestOrders = response.data;
        setRecentOrders(latestOrders);
        localStorage.setItem("latestOrders", JSON.stringify(latestOrders));
      })
      .catch(error => {
        console.error("Error fetching last three user orders:", error);
      });

    axios.get("http://localhost:5173/users/userInfo", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(response => {
        setUserName(response.data.userName);
      })
      .catch(error => {
        console.error("Error fetching user info:", error);
      });

    axios.get("http://localhost:5173/orders/getMostOrderedMenuItems")
      .then(response => {
        setMostOrderedItems(response.data);
      })
      .catch(error => {
        console.error("Error fetching most ordered menu items:", error);
      });
  }, []);

  const fetchItemPriceAndCalculateTotal = async (itemName, quantity) => {
    try {
      const response = await axios.get("http://localhost:5173/menu/getMenu");
      const menuItems = response.data;

      const selectedItem = menuItems.find(item => item.name === itemName);

      if (selectedItem) {
        setLastPurchasePrice(selectedItem.price * quantity);
      }
    } catch (error) {
      console.error("Error fetching menu items:", error);
      setLastPurchasePrice(0);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Welcome, {userName}!</h2>
        <p>Your Dashboard Overview</p>
      </div>
      <div className="dashboard-summary">
        <div className="summary-item">
          <h3>Total Completed Orders</h3>
          <p className="summary-value">{totalCompletedOrders}</p>
        </div>
        <div className="summary-item">
          <h3>Last Purchase</h3>
          {lastPurchaseItem ? (
            <p className="summary-value">${lastPurchasePrice.toFixed(2)}</p>
          ) : (
            <p className="summary-value">No recent purchase</p>
          )}
        </div>
        <div className="summary-item">
          <h3>Favorite Products</h3>
          <ul className="favorite-products-list">
            {favoriteItemsWithQuantities.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="dashboard-details">
        <div className="details-section">
          <h3>Recent Orders</h3>
          <ul className="recent-orders-list">
            {recentOrders.map(order => (
              <li key={order._id}>
                Order #{order._id} -{" "}
                <span className={`order-status ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="summary-item">
          <h3>Recommended Products</h3>
          <div className="recommended-products">
            {mostOrderedItems.map((item, index) => (
              <div key={index} className="product-card">
                <img src={`http://localhost:5173/${item.image}`} alt={item.name} />
                <p>{item.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;

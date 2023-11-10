import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ManageOrders.css";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [timeFilter, setTimeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");
  const itemsPerPage = 6;

  useEffect(() => {
    fetchOrders();
  }, [token, timeFilter, statusFilter]);

  const fetchOrders = async () => {
    try {
      let url = `${import.meta.env.VITE_REACT_APP_BASE_URL}/orders/getAllUsersOrder`;
      const params = { timeFilter, statusFilter };
      url += `?${new URLSearchParams(params).toString()}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Role: userRole,
        },
      });

      if (response.status === 200) {
        setOrders(response.data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const isTimeFilterMatch = (filter, orderDate) => {
    const today = new Date();
    const orderDateObj = new Date(orderDate);

    if (filter === "today") {
      return isSameDate(today, orderDateObj);
    } else if (filter === "yesterday") {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return isSameDate(yesterday, orderDateObj);
    } else if (filter === "1week") {
      const oneWeekAgo = new Date(today);
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return orderDateObj >= oneWeekAgo && orderDateObj <= today;
    } else if (filter === "1month") {
      const oneMonthAgo = new Date(today);
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      return orderDateObj >= oneMonthAgo && orderDateObj <= today;
    } else if (filter === "1year") {
      const oneYearAgo = new Date(today);
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      return orderDateObj >= oneYearAgo && orderDateObj <= today;
    } else {
      return true;
    }
  };

  const isSameDate = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_REACT_APP_BASE_URL}/orders/updateOrderStatus/${orderId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Role: userRole,
          },
        }
      );

      if (response.status === 200) {
        fetchOrders(); // Refresh orders after status update
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const statusMatch = statusFilter === "all" || order.status === statusFilter;
    const timeMatch =
      timeFilter === "all" || isTimeFilterMatch(timeFilter, order.createdAt);
    return statusMatch && timeMatch;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="manage-orders">
      <h2>Manage Orders</h2>
      <div className="filter-options">
        <div className="time-filter">
          <label htmlFor="timeFilter">Time Filter:</label>
          <select
            id="timeFilter"
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="1week">Last 1 Week</option>
            <option value="1month">Last 1 Month</option>
            <option value="1year">Last 1 Year</option>
          </select>
        </div>

        <div className="status-filter">
          <label htmlFor="statusFilter">Status Filter:</label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="progress">Progress</option>
            <option value="delivered">Delivered</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
      <table className="order-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Address</th>
            <th>Items</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.length === 0 ? (
            <tr>
              <td colSpan="6">No orders found.</td>
            </tr>
          ) : (
            filteredOrders.slice(startIndex, endIndex).map((order, index) => (
              <tr key={index}>
                <td>{startIndex + index + 1}</td>
                <td>{order.name}</td>
                <td>{order.address}</td>
                <td>
                  <ul className="item-list">
                    {order.items.map((item, idx) => (
                      <li className="item" key={idx}>
                        {item.name} (Quantity: {item.quantity})
                      </li>
                    ))}
                  </ul>
                </td>
                <td>
                  {order.status === "progress" && (
                    <span
                      className="status-badge status-progress"
                      onClick={() => handleStatusUpdate(order._id, "delivered")}
                    >
                      Progress
                    </span>
                  )}
                  {order.status === "delivered" && (
                    <span
                      className="status-badge status-delivered"
                      onClick={() => handleStatusUpdate(order._id, "completed")}
                    >
                      Delivered
                    </span>
                  )}
                  {order.status === "completed" && (
                    <span className="status-badge status-completed">
                      Completed
                    </span>
                  )}
                </td>
                <td>
                  {order.status === "progress" && (
                    <button
                      className="action-button"
                      onClick={() => handleStatusUpdate(order._id, "delivered")}
                    >
                      Mark Delivered
                    </button>
                  )}
                  {order.status === "delivered" && (
                    <button
                      className="action-button"
                      onClick={() => handleStatusUpdate(order._id, "completed")}
                    >
                      Mark Completed
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className="pagination">
        <button
          className={`pagination-button ${currentPage === 1 ? "disabled" : ""}`}
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          <i className="fas fa-chevron-left"></i>
        </button>
        <div className="pagination-text">
          Page {currentPage} of {totalPages}
        </div>
        <button
          className={`pagination-button ${
            currentPage === totalPages ? "disabled" : ""
          }`}
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  );
};

export default ManageOrders;

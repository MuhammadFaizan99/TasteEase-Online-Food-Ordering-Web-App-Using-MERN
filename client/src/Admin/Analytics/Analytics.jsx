import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Analytics.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const Analytics = () => {
  const [timeRange, setTimeRange] = useState("today");
  const [analyticsType, setAnalyticsType] = useState("users");
  const [analyticsData, setAnalyticsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        analyticsType === "users"
          ? `${import.meta.env.VITE_REACT_APP_BASE_URL}/users/analytics`
          : analyticsType === "orders"
          ? `${import.meta.env.VITE_REACT_APP_BASE_URL}/orders/analytics`
          : `${import.meta.env.VITE_REACT_APP_BASE_URL}/customers/analytics`,
        {
          params: {
            timeRange: timeRange,
            analyticsType: analyticsType,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAnalyticsData(response.data);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeRange, analyticsType]);

  const handleTimeRangeChange = (e) => {
    setTimeRange(e.target.value);
  };

  const handleAnalyticsTypeChange = (e) => {
    setAnalyticsType(e.target.value);
  };

  const getXAxisTicks = () => {
    switch (timeRange) {
      case "today":
      case "yesterday": {
        const xAxisLabels = [
          "12:00 AM", "3:00 AM", "6:00 AM", "9:00 AM",
          "12:00 PM", "3:00 PM", "6:00 PM", "9:00 PM"
        ];
        return xAxisLabels.map((label, index) => ({
          Name: label,
          Total: analyticsData[index] ? analyticsData[index].Total : 0,
        }));
      }
      case "week": {
        const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        return weekDays.map((day, index) => ({
          Name: day,
          Total: analyticsData[index] ? analyticsData[index].Total : 0,
        }));
      }
      case "month": {
        const daysInMonth = new Date(
          new Date().getFullYear(),
          new Date().getMonth() + 1,
          0
        ).getDate();
        const weeksInMonth = Math.ceil(daysInMonth / 7);
        return Array.from({ length: weeksInMonth }, (_, weekIndex) => ({
          Name: `Week ${weekIndex + 1}`,
          Total: analyticsData[weekIndex] ? analyticsData[weekIndex].Total : 0,
        }));
      }
      case "year": {
        const monthNames = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        return monthNames.map((month, index) => ({
          Name: month,
          Total: analyticsData[index] ? analyticsData[index].Total : 0,
        }));
      }
      default:
        return [];
    }
  };
  

  let chartTitle = "";
  if (analyticsType === "users") {
    chartTitle = "User Analytics";
  } else if (analyticsType === "orders") {
    chartTitle = "Order Analytics";
  } else if (analyticsType === "customers") {
    chartTitle = "Customer Analytics";
  }

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h1>{chartTitle}</h1>
      </div>
      <div className="select-container">
        <label className="select-item">
          Time Range:
          <select value={timeRange} onChange={handleTimeRangeChange}>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="week">1 Week</option>
            <option value="month">1 Month</option>
            <option value="year">1 Year</option>
          </select>
        </label>
        <label className="select-item">
          Analytics Type:
          <select value={analyticsType} onChange={handleAnalyticsTypeChange}>
            <option value="users">Users</option>
            <option value="orders">Orders</option>
            <option value="customers">Customers</option>
          </select>
        </label>
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="chart-container">
          <BarChart width={800} height={400} data={getXAxisTicks()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Total" fill="#8884d8" />
          </BarChart>
        </div>
      )}
    </div>
  );
};

export default Analytics;

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ManageUsers.css";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token")); // Initialize isLoggedIn state
  const token = localStorage.getItem("token");

  const itemsPerPage = 4; // Display 4 users per page

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BASE_URL}/users/getRegisteredUser`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          // Filter out admin users and set only normal users
          const normalUsers = response.data.users.filter(
            (user) => user.Role !== "admin"
          );
          setUsers(normalUsers);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        // Handle unauthorized access or other errors here
        if (error.response && error.response.status === 401) {
          // Handle unauthorized access, e.g., redirect to login page
        }
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.Email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
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

  const handleDeleteUser = async (userId) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_REACT_APP_BASE_URL}/users/deleteIndividualRegisteredUser?userId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // Check if the deleted user is the currently logged-in user
        const deletedUserId = localStorage.getItem("userId");
        if (deletedUserId === userId) {
          // Remove token and userId from local storage
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          setIsLoggedIn(false); // Set isLoggedIn state to false
        }

        // Update the list of users after successful deletion
        const updatedUsers = users.filter((user) => user._id !== userId);
        setUsers(updatedUsers);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="manage-users">
      <h2>Manage Users</h2>
      <input
        type="text"
        placeholder="Search users"
        className="search-input-users"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Profile Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length === 0 ? (
            <tr>
              <td colSpan="5">No users found.</td>
            </tr>
          ) : (
            filteredUsers.slice(startIndex, endIndex).map((user, index) => (
              <tr key={index}>
                <td>{startIndex + index + 1}</td>
                <td>{user.Name}</td>
                <td>{user.Email}</td>
                <td>
                  <img
                    src={`${import.meta.env.VITE_REACT_APP_BASE_URL}/uploads/${user.ProfileImage}`}
                    alt={`Profile of ${user.Name}`}
                    className="profile-image"
                  />
                </td>
                <td>
                  <button
                    className="delete-button-new"
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    <i className="fas fa-trash-alt"></i> Delete
                  </button>
                  <button className="read-button-new">
                    <i className="fas fa-eye"></i> Read
                  </button>
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

export default ManageUsers;

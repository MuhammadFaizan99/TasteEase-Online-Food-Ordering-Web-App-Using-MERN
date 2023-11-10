import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ResolvedQueries.css";

const ResolvedQueries = () => {
  const [resolvedQueries, setResolvedQueries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchResolvedQueries = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BASE_URL}/customers/getResolvedQueries`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // Reverse the resolvedQueries array to display the most recent queries at the top
        setResolvedQueries(response.data.reverse());
      } catch (error) {
        console.error("Error fetching resolved queries:", error);
      }
    };

    fetchResolvedQueries();
  }, []);

  const totalPages = Math.ceil(resolvedQueries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/contact");
  };

  return (
    <div className="resolved-queries">
      <h2>Resolved Queries</h2>
      <div className="query-list">
        {resolvedQueries.length === 0 ? (
          <p className="no-queries">No resolved queries found.</p>
        ) : (
          resolvedQueries.slice(startIndex, endIndex).map((query, index) => (
            <div className="query-item" key={index}>
              <h4>Query:</h4>
              <p>{query.Query}</p>
              {query.ResolvedAnswer && (
                <div>
                  <h4>Resolved Answer:</h4>
                  <p>{query.ResolvedAnswer}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      <div className="pagination">
        <button
          className={`pagination-button ${currentPage === 1 ? "disabled" : ""}`}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <div className="pagination-text">
          Page {currentPage} of {totalPages}
        </div>
        <button
          className={`pagination-button ${
            currentPage === totalPages ? "disabled" : ""
          }`}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
      <button className="back-button" onClick={handleGoBack}>
        Go Back
      </button>
    </div>
  );
};

export default ResolvedQueries;

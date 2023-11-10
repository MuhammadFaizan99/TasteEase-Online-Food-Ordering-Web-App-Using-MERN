import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import "./CustomerSupport.css";

Modal.setAppElement("#root");

const CustomerSupport = () => {
  const [queries, setQueries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedQueryId, setSelectedQueryId] = useState("");
  const [answer, setAnswer] = useState("");
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BASE_URL}/customers/getQueries`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setQueries(response.data);
      } catch (error) {
        console.error("Error fetching queries:", error);
      }
    };

    fetchQueries();
  }, []);

  const sortedQueries = [...queries].sort((a, b) => {
    if (a.Resolved !== b.Resolved) {
      return a.Resolved ? 1 : -1;
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const filteredQueries = sortedQueries.filter(
    (query) =>
      query.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.Email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.Query.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredQueries.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const openModal = (queryId) => {
    setSelectedQueryId(queryId);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setAnswer("");
  };

  const handleResolve = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BASE_URL}/customers/resolveQuery`,
        {
          queryId: selectedQueryId,
          Answer: answer,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const updatedQueries = queries.map((query) =>
          query._id === selectedQueryId
            ? { ...query, Resolved: true, ResolvedAnswer: answer }
            : query
        );

        setQueries(updatedQueries);
        closeModal();
      }
    } catch (error) {
      console.error("Error resolving query:", error);
    }
  };

  return (
    <div className="get-customer-support">
      <h2>Customer Support Queries</h2>
      <input
        type="text"
        placeholder="Search queries"
        className="search-input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <table className="query-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Query</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredQueries.length === 0 ? (
            <tr>
              <td colSpan="5">No queries found.</td>
            </tr>
          ) : (
            filteredQueries.slice(startIndex, endIndex).map((query, index) => (
              <tr key={index}>
                <td>{startIndex + index + 1}</td>
                <td>{query.Name}</td>
                <td>{query.Email}</td>
                <td>{query.Query}</td>
                <td>
                  {query.Resolved ? (
                    <button className="resolved-button">Resolved</button>
                  ) : (
                    <button
                      className="resolve-button"
                      onClick={() => openModal(query._id)}
                    >
                      <i className="fas fa-check-circle"></i> Resolve
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
          Page {currentPage} of{" "}
          {Math.ceil(filteredQueries.length / itemsPerPage)}
        </div>
        <button
          className={`pagination-button ${
            currentPage === Math.ceil(filteredQueries.length / itemsPerPage)
              ? "disabled"
              : ""
          }`}
          onClick={handleNextPage}
          disabled={
            currentPage === Math.ceil(filteredQueries.length / itemsPerPage)
          }
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Resolve Query"
        className="modal"
      >
        <h2>Resolve Query</h2>
        {queries.find((query) => query._id === selectedQueryId)?.Resolved ? (
          <div>
            <p>Resolved Answer:</p>
            <p>
              {
                queries.find((query) => query._id === selectedQueryId)
                  ?.ResolvedAnswer
              }
            </p>
          </div>
        ) : (
          <div>
            <textarea
              placeholder="Write your answer..."
              rows="5"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            ></textarea>
            <button className="submit-button" onClick={handleResolve}>
              Submit
            </button>
            <button className="cancel-button" onClick={closeModal}>
              Cancel
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CustomerSupport;

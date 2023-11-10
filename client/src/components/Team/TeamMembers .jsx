import React, { useEffect, useRef, useState } from "react";
import "./TeamMembers.css";
import axios from "axios";

const TeamMembers = () => {
  const sectionRef = useRef(null);
  const [teamMembers, setTeamMembers] = useState([]);

  const handleIntersection = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in");
        observer.unobserve(entry.target);
      }
    });
  };

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.01,
    };

    const observer = new IntersectionObserver(handleIntersection, options);

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    // Fetch team data from the server
    axios
      .get(`${import.meta.env.VITE_REACT_APP_BASE_URL}/team/getTeam`)
      .then((response) => {
        setTeamMembers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching team members:", error);
      });
  }, []);

  return (
    <div className="team-members" ref={sectionRef}>
      <h2>Meet Our Talented Chefs</h2>
      <div className="team-members-list">
        {teamMembers.map((member, index) => (
          <div className="team-member" key={index}>
            <div className="member-image">
              <img
                src={`${import.meta.env.VITE_REACT_APP_BASE_URL}/uploads/${member.Image}`}
                alt={member.Name}
              />
            </div>
            <div className="member-details">
              <h3>{member.Name}</h3>
              <p>{member.Role}</p>
              <p>{member.Experience}</p>
              <p>Speciality: {member.Speciality}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamMembers;

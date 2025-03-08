import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Navbar.css"; // Ensure this import path is correct

const Navbar = () => {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the current user's name from the session
    const fetchUserName = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users/current-user", {
          withCredentials: true,
        });

        if (response.data && response.data.name) {
          setUserName(response.data.name);
        } else {
          console.error("No user logged in");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserName();
  }, []);

  const handleProfileClick = () => {
    navigate("/profile"); // Redirect to the profile page
  };

  return (
    <div className="navbar">
      <div className="logo">
        <span className="logo-text">3R</span>
      </div>
      <div className="app-name">3R - Generative Garbage Segregation App</div>
      <div className="welcome-message" onClick={handleProfileClick}>
        <span style={{ cursor: "pointer" }}>Welcome, {userName}</span>
      </div>
    </div>
  );
};

export default Navbar;
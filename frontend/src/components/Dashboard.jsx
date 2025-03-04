import React from "react";
import "./Dashboard.css"; // Import Dashboard CSS
import Navbar from "./Navbar"; // Import Navbar component

const Dashboard = () => {
  return (
    <div className="dashboard-wrapper">
      <Navbar /> {/* Navbar at the top */}
      <div className="dashboard-container">
        <h1>Dashboard</h1>
        <div className="dashboard-content">
            <h1>Dashboard!</h1>
          <p>Welcome to the 3R - Generative Garbage Segregation App Dashboard.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
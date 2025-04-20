import React from "react";
import "./Dashboard.css"; // Import the CSS for the dashboard
import Navbar from "./Navbar"; // Import the Navbar
import Calendar from "./Calendar"; // Import the new Calendar component

const Dashboard = () => {
  return (
    <div className="dashboard-wrapper">
      <Navbar /> 
      <div className="dashboard-content">
        <Calendar /> 
        <div className="dashboard-buttons">
          <button className="dashboard-button make-money">Make Money</button>
          <button className="dashboard-button provide-feedback">Provide Feedback</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
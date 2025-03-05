import React from "react";
import "./Dashboard.css"; // Import the CSS for the dashboard
import Navbar from "./Navbar"; // Import the Navbar
import Calendar from "./Calendar"; // Import the new Calendar component

const Dashboard = () => {
  return (
    < div className="dashboard-wrapper">
      <Navbar /> {/* Navbar at the top */}
        <Calendar /> {/* Use the Calendar component */}
      
    </div>
  );
};

export default Dashboard;
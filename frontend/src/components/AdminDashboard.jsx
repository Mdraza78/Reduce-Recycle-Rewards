import React from 'react';
import './AdminDashboard.css'; // CSS file for styling

export default function AdminDashboard() {
  const totalUsers = 120;
  const userComplaints = 15;

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Admin Dashboard</h1>

      <div className="cards-container">
        <div className="card card-blue">
          <h2>Total Users</h2>
          <p>{totalUsers}</p>
        </div>

        <div className="card card-red">
          <h2>User Complaints</h2>
          <p>{userComplaints}</p>
        </div>
      </div>
    </div>
  );
}

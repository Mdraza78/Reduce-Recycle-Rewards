import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";
import Navbar from "./Navbar";
import { div } from "@tensorflow/tfjs";
export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", mobile: "" });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users/profile", {
          withCredentials: true,
        });
  
        if (response.data) {
          setUserData(response.data);
          setFormData({
            name: response.data.name,
            email: response.data.email,
            mobile: response.data.mobile || "",
          });
        } else {
          setError("User not found");
        }
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError("Error fetching user data");
      }
    };
  
    fetchProfileData();
  }, []);

  const handleEditClick = () => setIsEditing(true);
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSaveClick = async () => {
    try {
      const response = await axios.put("http://localhost:5000/api/users/profile", formData, {
        withCredentials: true,
      });

      if (response.data) {
        setUserData(response.data);
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Error updating profile");
    }
  };

  if (error) return <div className="error">{error}</div>;
  if (!userData) return <div className="loading">Loading...</div>;

  return (
    <div>
        <Navbar/>
        <br />
        <br />
        <br />
        <br />
    <div className="profile-container">
      <div className="sidebar">
        <div className="avatar">{userData.name.charAt(0)}</div>
        <h2>{userData.name}</h2>
      </div>
      <div className="profile-content">
        <h2>My Profile</h2>
        <div className="profile-line"></div>

        <div className="content">
          <p>Name:</p>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={!isEditing}
            className="profile-input"
          />
          <p>Email:</p>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={!isEditing}
            className="profile-input"
          />
          <p>Phone number:</p>
          <input
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            disabled={!isEditing}
            className="profile-input"
            maxLength="10"
            pattern="[0-9]{10}"
            title="Enter a valid 10-digit phone number"
          />
          <br /><br />
          {isEditing ? (
            <button className="save-btn" onClick={handleSaveClick}>
              Save
            </button>
          ) : (
            <button className="edit-btn" onClick={handleEditClick}>
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}

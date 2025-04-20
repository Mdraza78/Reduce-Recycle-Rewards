import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MainPage.css'; // Import the custom CSS for the page

export default function MainPage() {
  const [image, setImage] = useState(null);
  const navigate = useNavigate(); // Initialize navigate

  // Get the current date and format it
  const today = new Date();
  const currentDate = today.toLocaleDateString(); // Format the date as MM/DD/YYYY

  // Handle image upload
  const handleImageUpload = (e) => {
    setImage(URL.createObjectURL(e.target.files[0])); // Set the selected image
  };

  // Handle navigation back to the calendar
  const handleBackToCalendar = () => {
    navigate('/dashboard'); // Navigate to the /dashboard route
  };

  // Handle the "Money Make" button click
  const handleMoneyMake = () => {
    // Add your logic for the "Money Make" button here
    alert('You clicked on Money Make!');
  };

  // Handle the "Provide Feedback" button click
  const handleFeedback = () => {
    // Add your logic for the "Provide Feedback" button here
    alert('Feedback section will be displayed soon!');
  };

  // Handle navigation to the map
  const handleFindMunicipality = () => {
    navigate('/map'); // Navigate to the /map route
  };

  return (
    <div className="main-container">
      <div className="content">

        <div className="date-container">
          <p className="date-text">You selected: <span className="current-date">{currentDate}</span></p>
        </div>

        <div className="upload-container">
          <label className="upload-label">Upload Garbage Image:</label>
          <input type="file" className="upload-input" onChange={handleImageUpload} />
          {image && <div className="image-preview"><img src={image} alt="Garbage" /></div>}
        </div>

        <button className="back-button" onClick={handleBackToCalendar}>
          Back to Calendar
        </button>

        <div className="button-container">
          <button className="money-make-button" onClick={handleMoneyMake}>
            Money Make
          </button>
          <button className="feedback-button" onClick={handleFeedback}>
            Provide Feedback
          </button>
        </div>

        {/* New Button to find municipality */}
        <button className="find-municipality-button" onClick={handleFindMunicipality}>
          Find Municipality
        </button>
      </div>
    </div>
  );
}

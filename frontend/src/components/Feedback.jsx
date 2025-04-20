import React, { useState } from 'react';
import './Feedback.css';

export default function Feedback() {
  const [formData, setFormData] = useState({
    workerId: '',
    name: '',
    email: '',
    phone: '',
    problem: '',
    comments: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: '',
    message: '',
    isError: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:5000/api/users/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit feedback');
      }

      setModalContent({
        title: 'Success!',
        message: 'Your feedback has been submitted successfully.',
        isError: false
      });
      setShowModal(true);
      
      setFormData({
        workerId: '',
        name: '',
        email: '',
        phone: '',
        problem: '',
        comments: ''
      });
    } catch (err) {
      setModalContent({
        title: 'Error',
        message: err.message || 'An error occurred while submitting your feedback.',
        isError: true
      });
      setShowModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="feedback-container">
      <h2>Worker Feedback Form</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Worker ID:</label>
          <input
            type="text"
            name="workerId"
            value={formData.workerId}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label>Phone Number:</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label>Select Problem:</label>
          <select
            name="problem"
            value={formData.problem}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          >
            <option value="">-- Select a Problem --</option>
            <option value="Demanded for Money">Demanded for Money</option>
            <option value="Used Harsh Words">Used Harsh Words</option>
            <option value="Inconvenient Collection Time">Inconvenient Collection Time</option>
            <option value="Demanded Festive Money (Baksheesh)">Demanded Festive Money (Baksheesh)</option>
            <option value="Skipped Collection">Skipped Collection</option>
            <option value="Partial Waste Collection">Partial Waste Collection</option>
            <option value="Unhygienic Handling">Unhygienic Handling</option>
            <option value="Delayed Pickup">Delayed Pickup</option>
            <option value="Overcharging for Extra Waste">Overcharging for Extra Waste</option>
            <option value="Unresponsive to Complaints">Unresponsive to Complaints</option>
          </select>
        </div>

        <div className="form-group">
          <label>Additional Comments:</label>
          <textarea
            name="comments"
            value={formData.comments}
            onChange={handleChange}
            rows="4"
            disabled={isSubmitting}
          />
        </div>

        <button 
          type="submit" 
          className="submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="spinner"></span>
              Submitting...
            </>
          ) : (
            'Submit Feedback'
          )}
        </button>
      </form>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div 
            className={`modal ${modalContent.isError ? 'error' : 'success'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>{modalContent.title}</h3>
              <button onClick={closeModal} className="modal-close">&times;</button>
            </div>
            <div className="modal-body">
              <p>{modalContent.message}</p>
            </div>
            <div className="modal-footer">
              <button onClick={closeModal} className="modal-button">
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
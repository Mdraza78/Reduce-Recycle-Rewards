import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', mobile: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation for mobile number (10 digits)
    if (!/^[0-9]{10}$/.test(formData.mobile)) {
      setMessage('Mobile number must be exactly 10 digits');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/users/register', formData);
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-image"></div>
      <div className="register-container">
        <h2>REGISTRATION INFO</h2>
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label>Mobile Number</label>
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Enter 10-digit mobile number"
              required
              pattern="[0-9]{10}" // Ensures 10-digit number input
              title="Please enter exactly 10 digits"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="register-btn">Register</button>
        </form>
        <p>
          Already have an account?{' '}
          <b><Link to="/login">Login</Link></b>
        </p>
        <div className="google-login">
          <div className="or-divider">
            <span></span>
            <p>OR</p>
            <span></span>
          </div>
          <a className="xyz" href="http://localhost:5000/api/users/auth/google">
            <button type="button" className="google-btn">
              <img
                src="https://w7.pngwing.com/pngs/506/509/png-transparent-google-company-text-logo-thumbnail.png"
                alt="Google"
                className="google-icon"
              />
              Continue with Google
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Register;

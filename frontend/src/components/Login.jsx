import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css'; // Reuse the same CSS

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setMessage('Please fill in all fields');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setMessage('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) return;
  
    setIsLoading(true);
  
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', formData, {
        withCredentials: true,
      });
  
      setMessage('Login successful! Redirecting to dashboard...');
  
      // Store user info in sessionStorage
      sessionStorage.setItem('user', JSON.stringify({
        email: formData.email,
        name: response.data.name,
        userId: response.data.userId,
      }));
  
      // Redirect to the dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000); // Redirect after 2 seconds
    } catch (error) {
      console.error('Login error:', error);
      if (error.response) {
        if (error.response.status === 401) {
          setMessage('Invalid email or password');
        } else {
          setMessage('Something went wrong. Please try again later.');
        }
      } else {
        setMessage('Network error. Please check your connection.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-image"></div>
      <div className="register-container">
        <h2>LOGIN</h2>
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleSubmit}>
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
          <button type="submit" className="register-btn" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p>
          Don't have an account? <Link to="/register">Register</Link>
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

export default Login;
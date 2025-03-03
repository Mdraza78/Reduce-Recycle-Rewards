import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} /> {/* Pass as JSX element */}
        <Route path="/login" element={<Login />} /> {/* Pass as JSX element */}
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
         {/* Pass as JSX element */}
      </Routes>
    </Router>
  );
}

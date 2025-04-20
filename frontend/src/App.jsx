import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import GarbageDetection from './components/GarbageDetection'
import LocationMap from './components/LocationMap';
import MainPage from './components/MainPage';
import Feedback from './components/Feedback';
//import Navbar from './components/Navbar'; // Import the Navbar component
import 'leaflet/dist/leaflet.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function App() {
  return (
    <Router>
      
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/garbage-detection" element={<GarbageDetection />} />
        <Route path="/map" element={<LocationMap/>}/>
        <Route path="/main" element={<MainPage/>}/>     
        <Route path="/feedback" element={<Feedback/>}/>     
      </Routes>
    </Router>
  );
}
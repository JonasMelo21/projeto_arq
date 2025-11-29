import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VehicleDetails from './pages/VehicleDetails';
import Booking from './pages/Booking';
import MyRentals from './pages/MyRentals';
import AdminDashboard from './pages/AdminDashboard';
import RegisterEmployee from './pages/RegisterEmployee';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        <Route path="/vehicle/:id" element={<VehicleDetails />} />
        <Route path="/book/:id" element={<Booking />} />
        
        <Route path="/meus-alugueis" element={<MyRentals />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/register-employee" element={<RegisterEmployee />} />
      </Routes>
    </Router>
  );
}

export default App;
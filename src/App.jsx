import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import TouristDashboard from './pages/TouristDashboard';
import GuideDashboard from './pages/GuideDashboard';
import HotelDashboard from './pages/HotelDashboard';
import './index.css';

function Home() {
  const [health, setHealth] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/health')
      .then(res => res.json())
      .then(data => setHealth(data))
      .catch(err => console.error('Error fetching health:', err));
  }, []);

  return (
    <div className="flex flex-col bg-white">
      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-semibold text-gray-900 tracking-tight leading-tight mb-6">
          Explore Nepal. Connect with local people. Travel better.
        </h1>
        <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl leading-relaxed">
          YatraVerse is a clean, simple tourism platform designed to help you discover beautiful destinations and connect with the best local guides.
        </p>
        <Link to="/register" className="bg-gray-900 text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm">
          Start Exploring
        </Link>
      </main>

      {/* Footer and Status */}
      <footer className="py-8 text-center text-sm text-gray-400 flex flex-col items-center gap-4 border-t border-gray-100 mt-auto">
        <div>&copy; {new Date().getFullYear()} YatraVerse. All rights reserved.</div>
        {health ? (
          <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Backend Connected: {health.status}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
            <span className="w-2 h-2 rounded-full bg-gray-400"></span>
            Backend Disconnected
          </div>
        )}
      </footer>
    </div>
  );
}

import Destinations from './pages/Destinations';
import DestinationDetails from './pages/DestinationDetails';
import Guides from './pages/Guides';
import Hotels from './pages/Hotels';
import Leaderboard from './pages/Leaderboard';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/destinations/:id" element={<DestinationDetails />} />
            <Route path="/guides" element={<Guides />} />
            <Route path="/hotels" element={<Hotels />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            
            <Route 
              path="/tourist" 
              element={
                <ProtectedRoute allowedRoles={['tourist']}>
                  <TouristDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/guide" 
              element={
                <ProtectedRoute allowedRoles={['guide']}>
                  <GuideDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/hotel" 
              element={
                <ProtectedRoute allowedRoles={['hotel']}>
                  <HotelDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

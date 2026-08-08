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
    <div className="flex flex-col flex-1 relative bg-gray-900 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/bg.png" 
          alt="Nepal Tourism Background" 
          className="w-full h-full object-cover animate-fade-in-up"
          style={{ animationDuration: '2s' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 via-gray-900/40 to-gray-900/90"></div>
      </div>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center max-w-4xl mx-auto relative z-10 w-full mt-20">
        <div className="backdrop-blur-md bg-white/10 p-10 md:p-14 rounded-3xl border border-white/20 shadow-2xl animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight mb-6 drop-shadow-lg">
            Explore Nepal.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Connect with locals.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-md">
            YatraVerse is a premium tourism platform designed to help you discover beautiful destinations and connect seamlessly with the best local guides and hotels.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="bg-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-500 hover:scale-105 hover:shadow-indigo-500/50 shadow-lg transition-all duration-300">
              Start Exploring
            </Link>
            <Link to="/destinations" className="bg-white/20 backdrop-blur text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/30 hover:scale-105 transition-all duration-300 border border-white/30">
              View Destinations
            </Link>
          </div>
        </div>
      </main>

      {/* Footer and Status */}
      <footer className="py-6 text-center text-sm text-gray-300 flex flex-col items-center gap-3 relative z-10 bg-black/40 backdrop-blur-sm mt-auto">
        <div className="font-medium">&copy; {new Date().getFullYear()} YatraVerse. All rights reserved.</div>
        {health ? (
          <div className="flex items-center gap-2 text-xs text-green-300 bg-green-900/40 px-4 py-1.5 rounded-full border border-green-500/30 backdrop-blur shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            Backend Connected: {health.status}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-800/60 px-4 py-1.5 rounded-full border border-gray-600/50 backdrop-blur shadow-sm">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
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
import Profile from './pages/Profile';
import Chat from './pages/Chat';
import GuideJobs from './pages/GuideJobs';
import HotelLedger from './pages/HotelLedger';
import AIAssistant from './components/AIAssistant';

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
            
            <Route path="/profile" element={<Profile />} />
            <Route path="/chat" element={<Chat />} />
            <Route 
              path="/jobs" 
              element={
                <ProtectedRoute allowedRoles={['guide']}>
                  <GuideJobs />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/reservations" 
              element={
                <ProtectedRoute allowedRoles={['hotel']}>
                  <HotelLedger />
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

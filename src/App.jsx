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

import EarthIntro from './components/EarthIntro';

function Home() {
  const [health, setHealth] = useState(null);

  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/health')
      .then(res => res.json())
      .then(data => setHealth(data))
      .catch(err => console.error('Error fetching health:', err));
  }, []);

  return (
    <div className="flex flex-col flex-1 w-full relative">
      {/* 3D Earth Intro Screen */}
      {showIntro && <EarthIntro onExplore={() => setShowIntro(false)} />}
      
      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center max-w-5xl mx-auto w-full mt-10">
        <div className="animate-fade-in-up">
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tight leading-[1.1] mb-8 drop-shadow-2xl">
            Explore Nepal.<br/>
            <span className="text-white drop-shadow-xl">Connect with locals.</span>
          </h1>
          <p className="text-xl md:text-2xl text-white mb-12 max-w-3xl mx-auto leading-relaxed font-medium drop-shadow-lg shadow-black">
            Experience the Himalayas like never before. Discover breathtaking destinations, book expert local guides, and find the perfect stay.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link to="/register" className="bg-blue-700 text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-blue-800 hover:scale-105 shadow-[0_0_40px_rgba(37,99,235,0.4)] transition-all duration-300">
              Start Exploring
            </Link>
            <Link to="/destinations" className="text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-white/10 hover:scale-105 transition-all duration-300 border-2 border-white/50 backdrop-blur-sm shadow-xl">
              View Destinations
            </Link>
          </div>
        </div>
      </main>

      {/* Footer and Status */}
      <footer className="py-6 text-center text-sm text-gray-300 flex flex-col items-center gap-3 bg-black/40 backdrop-blur-sm mt-auto">
        <div className="font-medium">&copy; {new Date().getFullYear()} YatraVerse. All rights reserved.</div>
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
        <div className="min-h-screen flex flex-col relative bg-gray-900 overflow-x-hidden">
          {/* Global Background Image with Overlay */}
          <div className="fixed inset-0 z-0">
            <img 
              src="/images/bg.png" 
              alt="Nepal Tourism Background" 
              className="w-full h-full object-cover animate-fade-in-up"
              style={{ animationDuration: '2s' }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900/40 via-gray-900/60 to-gray-900/90"></div>
          </div>
          
          {/* App Content Layer */}
          <div className="relative z-10 flex flex-col flex-1 text-white">
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
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

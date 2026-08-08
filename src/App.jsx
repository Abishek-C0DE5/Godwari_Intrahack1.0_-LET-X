import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import TouristDashboard from './pages/TouristDashboard';
import GuideDashboard from './pages/GuideDashboard';
import HotelDashboard from './pages/HotelDashboard';
import { LogOut } from 'lucide-react';
import './index.css';

function Home() {
  const [health, setHealth] = useState(null);
  const { user, profile, logout } = useAuth();

  useEffect(() => {
    fetch('http://localhost:5000/api/health')
      .then(res => res.json())
      .then(data => setHealth(data))
      .catch(err => console.error('Error fetching health:', err));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="text-xl font-medium tracking-tight text-gray-900">YatraVerse</div>
        <div className="flex gap-6 text-sm text-gray-600 items-center">
          <Link to="#" className="hover:text-gray-900 transition-colors">Destinations</Link>
          <Link to="#" className="hover:text-gray-900 transition-colors">Guides</Link>
          {user ? (
            <>
              <Link to={`/${profile?.role || ''}`} className="hover:text-gray-900 transition-colors font-medium">Dashboard</Link>
              <button onClick={() => logout()} className="hover:text-gray-900 transition-colors flex items-center gap-1">
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </>
          ) : (
            <Link to="/login" className="hover:text-gray-900 transition-colors">Sign In</Link>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-semibold text-gray-900 tracking-tight leading-tight mb-6">
          Explore Nepal. Connect with local people. Travel better.
        </h1>
        <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl leading-relaxed">
          YatraVerse is a clean, simple tourism platform designed to help you discover beautiful destinations and connect with the best local guides.
        </p>
        <button className="bg-gray-900 text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm">
          Start Exploring
        </button>
      </main>

      {/* Footer and Status */}
      <footer className="py-8 text-center text-sm text-gray-400 flex flex-col items-center gap-4">
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

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
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
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

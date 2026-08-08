import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User } from 'lucide-react';

export function Navbar() {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const role = profile?.role || 'tourist'; // Default to tourist if not logged in

  return (
    <nav className="flex items-center justify-between px-8 py-1 max-w-7xl mx-auto w-full bg-white/80 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 shadow-sm">
      <Link to="/" className="flex items-center gap-2 text-2xl font-bold tracking-tight text-slate-900 group">
        <img src="/images/logo.png" alt="YatraVerse Logo" className="h-10 md:h-12 w-auto group-hover:scale-105 transition-transform duration-300" />
      </Link>
      <div className="flex gap-6 text-sm text-slate-600 items-center">
        
        {/* Dynamic Links Based on Role */}
        {(!profile || role === 'tourist') && (
          <>
            <Link to="/destinations" className="hover:text-slate-900 transition-colors font-medium">Destinations</Link>
            <Link to="/guides" className="hover:text-slate-900 transition-colors font-medium">Guides</Link>
            <Link to="/hotels" className="hover:text-slate-900 transition-colors font-medium">Hotels</Link>
          </>
        )}

        {role === 'guide' && (
          <>
            <Link to="/guide" className="hover:text-slate-900 transition-colors font-medium">My Schedule</Link>
            <Link to="/jobs" className="hover:text-slate-900 transition-colors font-medium">Job Board</Link>
          </>
        )}

        {role === 'hotel' && (
          <>
            <Link to="/hotel" className="hover:text-slate-900 transition-colors font-medium">PMS Dashboard</Link>
            <Link to="/reservations" className="hover:text-slate-900 transition-colors font-medium">Reservations Ledger</Link>
          </>
        )}
        
        {user ? (
          <div className="flex items-center gap-4 ml-4 pl-4 border-l border-white/10">
            <Link to="/chat" className="flex items-center gap-2 text-slate-900 hover:text-gray-700 transition-colors font-medium">
              Messages
            </Link>
            <Link to="/profile" className="flex items-center gap-2 text-slate-900 hover:text-gray-700 transition-colors font-medium">
              <User className="w-4 h-4" />
              Profile
            </Link>
            <button 
              onClick={handleLogout} 
              className="text-slate-500 hover:text-red-600 transition-colors flex items-center gap-1"
            >
              <LogOut className="w-4 h-4" /> 
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4 ml-4 pl-4 border-l border-white/10">
            <Link to="/login" className="hover:text-slate-900 transition-colors font-medium">Sign In</Link>
            <Link to="/register" className="bg-blue-600 text-white shadow-md shadow-blue-500/20 px-5 py-2 rounded-full font-medium hover:bg-blue-100 transition-colors">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

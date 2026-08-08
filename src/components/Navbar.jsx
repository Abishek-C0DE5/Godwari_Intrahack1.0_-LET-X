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

  return (
    <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full bg-white">
      <Link to="/" className="text-2xl font-bold tracking-tight text-gray-900">
        YatraVerse
      </Link>
      <div className="flex gap-6 text-sm text-gray-600 items-center">
        <Link to="/destinations" className="hover:text-gray-900 transition-colors font-medium">Destinations</Link>
        <Link to="/guides" className="hover:text-gray-900 transition-colors font-medium">Guides</Link>
        <Link to="/hotels" className="hover:text-gray-900 transition-colors font-medium">Hotels</Link>
        
        {user ? (
          <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-200">
          <Link to="/profile" className="flex items-center gap-2 text-gray-900 hover:text-gray-700 transition-colors font-medium">
                <User className="w-4 h-4" />
                Profile
              </Link>
            <button 
              onClick={handleLogout} 
              className="text-gray-500 hover:text-red-600 transition-colors flex items-center gap-1"
            >
              <LogOut className="w-4 h-4" /> 
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-200">
            <Link to="/login" className="hover:text-gray-900 transition-colors font-medium">Sign In</Link>
            <Link to="/register" className="bg-gray-900 text-white px-5 py-2 rounded-full font-medium hover:bg-gray-800 transition-colors">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

export default function TouristDashboard() {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full border-b border-gray-100">
        <div className="text-xl font-medium tracking-tight text-gray-900">YatraVerse</div>
        <div className="flex items-center gap-6 text-sm">
          <span className="text-gray-500 capitalize">{profile?.role}</span>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full px-8 py-12">
        <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight mb-2">
            Welcome, {profile?.name || 'Explorer'}
          </h1>
          <p className="text-gray-500">
            This is the tourist dashboard placeholder. We will build destinations and discovery features here soon.
          </p>
        </div>
      </main>
    </div>
  );
}

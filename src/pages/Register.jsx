import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('tourist');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { register, logout, user, profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && profile) {
      if (profile.role === 'tourist') navigate('/tourist');
      else if (profile.role === 'guide') navigate('/guide');
      else if (profile.role === 'hotel') navigate('/hotel');
      else navigate('/');
    }
  }, [user, profile, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const { data, error } = await register(email, password, name, role);
    
    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

    if (!data.session) {
      setError("Registration successful! Please check your email to confirm your account, then log in.");
      setIsLoading(false);
      return;
    }

    // Force sign out so they have to sign in manually as requested
    await logout();
    
    navigate('/login', { state: { message: 'Account created successfully! Please log in to continue.' } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent px-6 py-12">
      <div className="max-w-md w-full bg-black/20 backdrop-blur-md border border-white/20 shadow-xl p-8 rounded-2xl shadow-sm border border-white/10">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-white tracking-tight">Create an account</h2>
          <p className="text-sm text-gray-300 mt-2">Join YatraVerse to start exploring.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-black/20 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-black/20 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter your email"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-black/20 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Create a password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">I am a...</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-black/20 text-white"
            >
              <option value="tourist" className="bg-gray-900 text-white">Tourist</option>
              <option value="guide" className="bg-gray-900 text-white">Guide</option>
              <option value="hotel" className="bg-gray-900 text-white">Hotel / Restaurant</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-700 text-white shadow-md shadow-blue-900/50 shadow-xl font-medium py-2.5 rounded-xl hover:bg-blue-800 transition-colors disabled:opacity-50 mt-4"
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-300">
          Already have an account?{' '}
          <Link to="/login" className="text-white font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

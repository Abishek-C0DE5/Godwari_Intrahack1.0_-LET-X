import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login, user, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // To get state messages

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
    
    const { data, error } = await login(email, password);
    
    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }
    
    // We don't navigate here anymore, the useEffect will handle it once the profile loads
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent px-6 py-12">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-md border border-white/20 shadow-xl p-8 rounded-2xl shadow-sm border border-white/10">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-white tracking-tight">Welcome back</h2>
          <p className="text-sm text-gray-300 mt-2">Please enter your details to sign in.</p>
        </div>

        {location.state?.message && (
          <div className="mb-6 p-4 rounded-xl bg-green-50 text-green-700 text-sm border border-green-100 font-medium">
            {location.state.message}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
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
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-700 text-white shadow-md shadow-blue-900/50 shadow-xl font-medium py-2.5 rounded-xl hover:bg-blue-800 transition-colors disabled:opacity-50 mt-4"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-300">
          Don't have an account?{' '}
          <Link to="/register" className="text-white font-medium hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

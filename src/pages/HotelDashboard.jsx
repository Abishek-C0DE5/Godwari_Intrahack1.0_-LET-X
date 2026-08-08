import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { LogOut, Save, Home, MapPin, CheckSquare, DollarSign, Image as ImageIcon, Calendar } from 'lucide-react';

export default function HotelDashboard() {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    specialties: '', // Reusing this for Facilities
    description: '',
    price: '',
    avatar_url: '' // Reusing this for Hotel Photo
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Load existing profile data
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        location: profile.location || '',
        specialties: profile.specialties || '',
        description: profile.description || '',
        price: profile.price || '',
        avatar_url: profile.avatar_url || ''
      });
    }
  }, [profile]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');
    
    const { error } = await supabase
      .from('profiles')
      .update(formData)
      .eq('id', profile.id);

    setIsSaving(false);
    
    if (error) {
      setMessage('Error updating profile: ' + error.message);
    } else {
      setMessage('Profile updated successfully!');
      // Hide message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    }
  };

  // Mock Data for hackathon MVP
  const mockRequests = [
    { id: 1, tourist: 'Prakash Sharma', date: 'Aug 12 - Aug 15', details: '1 Deluxe Room (2 Adults)', status: 'pending' },
    { id: 2, tourist: 'Sarah Chen', date: 'Oct 01 - Oct 04', details: '2 Standard Rooms (4 Adults)', status: 'accepted' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full bg-white border-b border-gray-100">
        <div className="text-xl font-bold tracking-tight text-gray-900">YatraVerse</div>
        <div className="flex items-center gap-6 text-sm">
          <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium capitalize">
            {profile?.role} Account
          </span>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Welcome, {profile?.name || 'Hotel'}
          </h1>
          <p className="text-gray-500 mt-1">Manage your hotel's details and booking requests.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Your Business Profile</h2>
                {message && (
                  <span className={`text-sm font-medium ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
                    {message}
                  </span>
                )}
              </div>

              <form onSubmit={handleSave} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                      <Home className="w-4 h-4" /> Business Name
                    </label>
                    <input 
                      type="text" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange}
                      className="w-full border-gray-300 rounded-xl px-4 py-2.5 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                      required
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> Location
                    </label>
                    <input 
                      type="text" 
                      name="location" 
                      value={formData.location} 
                      onChange={handleChange}
                      placeholder="e.g. Kathmandu"
                      className="w-full border-gray-300 rounded-xl px-4 py-2.5 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Specialties / Facilities */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                      <CheckSquare className="w-4 h-4" /> Facilities & Amenities
                    </label>
                    <input 
                      type="text" 
                      name="specialties" 
                      value={formData.specialties} 
                      onChange={handleChange}
                      placeholder="e.g. WiFi, Pool, Breakfast"
                      className="w-full border-gray-300 rounded-xl px-4 py-2.5 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                      <DollarSign className="w-4 h-4" /> Price Per Night
                    </label>
                    <input 
                      type="text" 
                      name="price" 
                      value={formData.price} 
                      onChange={handleChange}
                      placeholder="e.g. NPR 4500/night"
                      className="w-full border-gray-300 rounded-xl px-4 py-2.5 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                    />
                  </div>
                </div>

                {/* Avatar URL (Hotel Photo) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" /> Hotel Cover Photo URL
                  </label>
                  <input 
                    type="url" 
                    name="avatar_url" 
                    value={formData.avatar_url} 
                    onChange={handleChange}
                    placeholder="https://example.com/your-hotel.jpg"
                    className="w-full border-gray-300 rounded-xl px-4 py-2.5 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea 
                    name="description" 
                    value={formData.description} 
                    onChange={handleChange}
                    rows="4"
                    placeholder="Describe your hotel, rooms, and surroundings..."
                    className="w-full border-gray-300 rounded-xl px-4 py-3 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={isSaving}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-300"
                  >
                    <Save className="w-5 h-5" />
                    {isSaving ? 'Saving...' : 'Save Business Profile'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column - Booking Requests (Mock) */}
          <div className="space-y-6">
            <div className="bg-gray-900 rounded-3xl p-6 text-white shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
                  <Calendar className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold">Booking Requests</h2>
              </div>

              <div className="space-y-4">
                {mockRequests.map((req) => (
                  <div key={req.id} className="bg-white/10 rounded-2xl p-4 border border-white/5">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-semibold text-lg">{req.tourist}</div>
                      {req.status === 'pending' ? (
                        <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2.5 py-1 rounded-md font-medium uppercase tracking-wider border border-yellow-500/30">
                          Pending
                        </span>
                      ) : (
                        <span className="text-xs bg-green-500/20 text-green-300 px-2.5 py-1 rounded-md font-medium uppercase tracking-wider border border-green-500/30">
                          Approved
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-300 mb-1">{req.date}</div>
                    <div className="text-sm text-gray-400 mb-4">{req.details}</div>
                    
                    {req.status === 'pending' && (
                      <div className="flex gap-2">
                        <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2 rounded-lg transition-colors">
                          Approve
                        </button>
                        <button className="flex-1 bg-white/5 hover:bg-white/10 text-white text-sm font-medium py-2 rounded-lg transition-colors">
                          Message
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { LogOut, CalendarDays, Navigation, MessageSquare, Check, X, Save, Edit3, MapPin, DollarSign, Briefcase } from 'lucide-react';
import AIAssistant from '../components/AIAssistant';

export default function GuideDashboard() {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('schedule');
  const [formData, setFormData] = useState({
    name: '', location: '', specialties: '', description: '', price: '', avatar_url: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '', location: profile.location || '',
        specialties: profile.specialties || '', description: profile.description || '',
        price: profile.price || '', avatar_url: profile.avatar_url || ''
      });
    }
  }, [profile]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const { error } = await supabase.from('profiles').update(formData).eq('id', profile.id);
    setIsSaving(false);
    setMessage(error ? 'Error updating profile' : 'Profile saved successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  // Mock Freelancer Data
  const upcomingTours = [
    { date: 'Aug 10', duration: '3 Days', location: 'Annapurna Base Camp', tourist: 'Prakash Sharma', status: 'upcoming' },
    { date: 'Aug 15', duration: '1 Day', location: 'Pokhara City Tour', tourist: 'Maya Rai', status: 'upcoming' },
    { date: 'Aug 22', duration: '5 Days', location: 'Mardi Himal Trek', tourist: 'John Doe', status: 'upcoming' },
  ];

  const incomingRequests = [
    { id: 1, tourist: 'Anna Smith', dates: 'Sep 05 - Sep 06', type: 'Photography Tour', details: 'Looking for a 2-day temple tour in Kathmandu.' },
    { id: 2, tourist: 'David Miller', dates: 'Oct 12 - Oct 25', type: 'Everest Trek', details: 'Need an experienced guide for EBC.' },
  ];

  return (
    <div className="flex flex-col flex-1 text-white font-sans">
      {/* Top Navbar */}
      <nav className="bg-white/10 backdrop-blur-md px-6 py-4 border-b border-white/20 flex items-center justify-between sticky top-0 z-10 border-b border-white/10">
        <div className="flex items-center gap-8">
          <div className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Navigation className="w-5 h-5 text-gray-200" />
            Guide Portal
          </div>
          <div className="hidden md:flex gap-1">
            <button 
              onClick={() => setActiveTab('schedule')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === 'schedule' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'text-gray-300 hover:bg-slate-100 hover:text-white'}`}
            >
              My Schedule
            </button>
            <button 
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === 'profile' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'text-gray-300 hover:bg-slate-100 hover:text-white'}`}
            >
              Public Profile
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
            {profile?.name ? profile.name.charAt(0) : 'G'}
          </div>
          <button onClick={handleLogout} className="p-2 text-gray-300 hover:text-red-500 transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        
        {activeTab === 'schedule' && (
          <>
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-violet-600 rounded-3xl p-8 text-white mb-8 shadow-md relative overflow-hidden">
              <div className="absolute right-0 top-0 w-64 h-full bg-white opacity-5 transform skew-x-12"></div>
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-center">
                <div>
                  <div className="uppercase tracking-widest text-gray-300 text-xs font-bold mb-2">Next Upcoming Tour</div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">Annapurna Base Camp</h1>
                  <div className="text-gray-300 flex items-center gap-2">
                    <CalendarDays className="w-4 h-4" /> Starts August 10 (3 Days)
                  </div>
                </div>
                <div className="mt-6 md:mt-0 text-right">
                  <div className="text-gray-300 text-sm mb-1">Total Earned This Month</div>
                  <div className="text-3xl font-bold">NPR 45,000</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Tour Calendar */}
              <div className="lg:col-span-2">
                <div className="bg-blue-900/30 backdrop-blur-xl border-blue-400/20 rounded-3xl shadow-sm border border-white/10 p-8">
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <CalendarDays className="w-5 h-5 text-gray-200" /> Upcoming Schedule
                  </h2>
                  
                  <div className="space-y-4">
                    {upcomingTours.map((tour, i) => (
                      <div key={i} className="flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-2xl border border-white/10 hover:border-white/40 hover:bg-white/5 transition-all group">
                        <div className="bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold px-4 py-3 rounded-xl text-center min-w-[80px]">
                          <div className="text-xs uppercase">Date</div>
                          <div>{tour.date}</div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-white text-lg group-hover:text-blue-700 transition-colors">{tour.location}</h3>
                          <div className="text-sm text-gray-300 flex items-center gap-3 mt-1">
                            <span>{tour.duration} Trip</span>
                            <span className="w-1 h-1 rounded-full bg-gray-500"></span>
                            <span>Client: {tour.tourist}</span>
                          </div>
                        </div>
                        <div>
                          <button className="text-gray-200 bg-white/10 border border-white/20 px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/20 transition-colors">
                            View Itinerary
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                {/* Job Offers */}
                <div className="bg-blue-900/60 rounded-3xl shadow-sm p-6 text-white">
                  <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-blue-400" /> Incoming Requests
                  </h2>
                  
                  <div className="space-y-4">
                    {incomingRequests.map((req) => (
                      <div key={req.id} className="bg-white/10 rounded-2xl p-5 border border-white/5 hover:bg-white/20 transition-colors">
                        <div className="text-gray-300 text-xs font-bold uppercase tracking-wider mb-2">{req.type}</div>
                        <div className="font-bold text-lg mb-1">{req.tourist}</div>
                        <div className="text-sm text-gray-300 mb-3">{req.dates}</div>
                        <p className="text-sm text-gray-300 mb-5 leading-relaxed">{req.details}</p>
                        
                        <div className="flex gap-2">
                          <button className="flex-1 bg-blue-500 hover:bg-blue-800 text-white shadow-md shadow-blue-900/50 shadow-xl flex justify-center items-center py-2.5 rounded-xl transition-colors">
                            <Check className="w-4 h-4" />
                          </button>
                          <button className="flex-1 bg-white/10 hover:bg-red-500/20 hover:text-red-400 text-white flex justify-center items-center py-2.5 rounded-xl transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* AI Assistant */}
                <div className="bg-blue-900/30 backdrop-blur-xl border-blue-400/20 rounded-3xl shadow-sm border border-white/10 overflow-hidden">
                  <AIAssistant />
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'profile' && (
          <div className="max-w-4xl mx-auto bg-blue-900/30 backdrop-blur-xl border-blue-400/20 rounded-3xl p-8 shadow-sm border border-white/10">
            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/10">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-gray-200">
                <Edit3 className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Guide Profile</h2>
                <p className="text-gray-300">This information is shown publicly to tourists looking for a guide.</p>
              </div>
            </div>

            {message && (
              <div className="mb-6 p-4 rounded-xl bg-green-50 text-green-700 font-medium">
                {message}
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2">Display Name</label>
                  <input type="text" name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 text-white border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-500" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2 flex items-center gap-1"><MapPin className="w-4 h-4"/> Base Location</label>
                  <input type="text" name="location" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full bg-white/5 text-white border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-500" required />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2 flex items-center gap-1"><Briefcase className="w-4 h-4"/> Specialties</label>
                  <input type="text" name="specialties" value={formData.specialties} onChange={(e) => setFormData({...formData, specialties: e.target.value})} className="w-full bg-white/5 text-white border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2 flex items-center gap-1"><DollarSign className="w-4 h-4"/> Daily Rate</label>
                  <input type="text" name="price" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full bg-white/5 text-white border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-500" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">About Me (Bio)</label>
                <textarea name="description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows="5" className="w-full bg-white/5 text-white border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-500"></textarea>
              </div>

              <div className="pt-4 flex justify-end">
                <button type="submit" disabled={isSaving} className="bg-blue-700 text-white shadow-md shadow-blue-900/50 shadow-xl px-8 py-3 rounded-xl font-semibold hover:bg-blue-800 transition-colors flex items-center gap-2">
                  <Save className="w-5 h-5" />
                  {isSaving ? 'Saving...' : 'Update Public Profile'}
                </button>
              </div>
            </form>
          </div>
        )}

      </main>
    </div>
  );
}

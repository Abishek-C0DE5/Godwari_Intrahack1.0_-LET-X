import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { User, Mail, Shield, MapPin, Award, Settings, Save, Briefcase, DollarSign, ImageIcon, BedDouble, Navigation, Star, Heart, Camera, Globe, Activity } from 'lucide-react';

export default function Profile() {
  const { user, profile } = useAuth();
  
  if (!user || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-transparent">
        <p className="text-slate-600 font-medium">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent flex flex-col font-sans">
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-12">
        {profile.role === 'tourist' && <TouristProfile user={user} profile={profile} />}
        {profile.role === 'guide' && <GuideProfile user={user} profile={profile} />}
        {profile.role === 'hotel' && <HotelProfile user={user} profile={profile} />}
      </main>
    </div>
  );
}

function TouristProfile({ user, profile }) {
  const [formData, setFormData] = useState({ name: profile.name || '' });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [rank, setRank] = useState(null);

  useEffect(() => {
    if (profile.points !== undefined) {
      const fetchRank = async () => {
        const { count } = await supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'tourist').gt('points', profile.points || 0);
        setRank((count || 0) + 1);
      };
      fetchRank();
    }
  }, [profile]);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const { error } = await supabase.from('profiles').update({ name: formData.name }).eq('id', profile.id);
    setIsSaving(false);
    setMessage(error ? 'Error updating profile' : 'Profile updated successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="space-y-8">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
          <Globe className="w-8 h-8 text-blue-600" />
          Explorer Hub
        </h1>
        <p className="text-slate-500 mt-1">Manage your traveler identity and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-blue-600 text-white shadow-md shadow-blue-500/20 rounded-3xl p-8 shadow-md relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-10"><Award className="w-40 h-40" /></div>
            <div className="w-16 h-16 bg-white/80 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60/20 rounded-2xl flex items-center justify-center text-slate-900 mb-6 backdrop-blur-sm">
              <User className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold mb-1 relative z-10">{profile.name}</h2>
            <h3 className="font-medium text-slate-600 mb-6 relative z-10 uppercase tracking-widest text-xs">YatraVerse Explorer</h3>
            
            <div className="flex justify-between items-end relative z-10 pt-6 border-t border-blue-500/50">
              <div>
                <div className="text-xs text-slate-600 uppercase tracking-wider mb-1">Total Points</div>
                <div className="text-3xl font-black">{profile.points?.toLocaleString() || 0}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-600 uppercase tracking-wider mb-1">Global Rank</div>
                <div className="text-3xl font-black">#{rank || '-'}</div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 rounded-3xl p-6 shadow-sm border border-white/10 space-y-4">
            <h3 className="font-bold text-slate-900">Travel Stats</h3>
            <div className="flex justify-between items-center py-2 border-b border-gray-50">
              <span className="text-slate-500 flex items-center gap-2"><MapPin className="w-4 h-4"/> Places Visited</span>
              <span className="font-bold text-slate-900">4</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-50">
              <span className="text-slate-500 flex items-center gap-2"><Navigation className="w-4 h-4"/> Guides Hired</span>
              <span className="font-bold text-slate-900">2</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-500 flex items-center gap-2"><Activity className="w-4 h-4"/> Active Bookings</span>
              <span className="font-bold text-slate-900">1</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-white/80 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 rounded-3xl p-8 shadow-sm border border-white/10">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Settings className="w-5 h-5 text-slate-600" /> Account Settings
            </h2>
            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Display Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500" placeholder="Enter your name" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <input type="email" value={user.email} disabled className="w-full bg-gray-100 border border-white/10 text-slate-500 rounded-xl px-4 py-3 cursor-not-allowed" />
                <p className="text-xs text-slate-600 mt-2 flex items-center gap-1"><Shield className="w-3 h-3"/> Email is verified and secured.</p>
              </div>
              {message && <div className="p-3 rounded-xl bg-green-50 text-green-700 text-sm font-medium">{message}</div>}
              <div className="pt-2">
                <button type="submit" disabled={isSaving} className="flex items-center gap-2 bg-blue-600 text-white shadow-md shadow-blue-500/20 px-8 py-3 rounded-xl font-bold hover:bg-blue-100 transition-colors disabled:bg-blue-300">
                  <Save className="w-5 h-5" /> {isSaving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white/80 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 rounded-3xl p-8 shadow-sm border border-white/10">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500" /> Travel Preferences
            </h2>
            <div className="flex flex-wrap gap-3">
              {['Trekking', 'Cultural Heritage', 'Photography', 'Wildlife Safari', 'Local Cuisine', 'Homestays'].map(tag => (
                <span key={tag} className="px-5 py-2.5 bg-transparent border border-white/10 rounded-xl text-sm font-medium text-gray-700 cursor-pointer hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors shadow-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GuideProfile({ user, profile }) {
  const [formData, setFormData] = useState({
    name: profile.name || '', location: profile.location || '',
    specialties: profile.specialties || '', description: profile.description || '',
    price: profile.price || '', avatar_url: profile.avatar_url || ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const { error } = await supabase.from('profiles').update(formData).eq('id', profile.id);
    setIsSaving(false);
    setMessage(error ? 'Error updating profile' : 'Portfolio updated successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="space-y-8">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
          <Camera className="w-8 h-8 text-blue-600" />
          Portfolio Manager
        </h1>
        <p className="text-slate-500 mt-1">Design how tourists see you on the platform.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Live Preview */}
        <div>
          <h2 className="text-sm font-bold text-slate-600 uppercase tracking-widest mb-4">Live Preview</h2>
          <div className="bg-white/80 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 rounded-3xl shadow-lg border border-white/10 overflow-hidden sticky top-8">
            <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
              <img 
                src={formData.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'Guide')}&background=random&size=400`} 
                alt="Profile Preview" 
                className="w-full h-full object-cover"
                onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'Guide')}&background=random&size=400`; }}
              />
              <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60/90 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-bold text-slate-900 uppercase tracking-wider">
                Local Guide
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-2xl font-black text-slate-900">{formData.name || 'Your Name'}</h3>
                <div className="flex items-center gap-1 text-sm font-bold text-gray-700 bg-yellow-50 text-yellow-700 px-2.5 py-1 rounded-md">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> 5.0
                </div>
              </div>
              <p className="text-blue-600 font-medium text-sm mb-4">{formData.specialties || 'Your Specialties'}</p>
              <div className="flex items-center gap-2 text-sm text-slate-500 mb-6 font-medium">
                <MapPin className="w-4 h-4 text-slate-600" /> {formData.location || 'Your Location'}
              </div>
              <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                <div className="font-bold text-slate-900 text-lg">{formData.price || 'Your Rate'}</div>
                <button disabled className="bg-gray-100 text-slate-600 font-bold px-6 py-2.5 rounded-xl text-sm">Contact Me</button>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div>
          <h2 className="text-sm font-bold text-slate-600 uppercase tracking-widest mb-4">Edit Details</h2>
          <div className="bg-white/80 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 rounded-3xl p-8 shadow-sm border border-white/10">
            {message && <div className="mb-6 p-4 rounded-xl bg-green-50 text-green-700 font-medium">{message}</div>}
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Display Name</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 font-medium" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Base Location</label>
                  <input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 font-medium" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Specialties / Tags</label>
                <input type="text" value={formData.specialties} onChange={(e) => setFormData({...formData, specialties: e.target.value})} placeholder="e.g. Hiking, History, Food" className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 font-medium" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Daily Rate</label>
                <input type="text" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} placeholder="e.g. NPR 2500/day" className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 font-medium" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Profile Photo URL</label>
                <input type="url" value={formData.avatar_url} onChange={(e) => setFormData({...formData, avatar_url: e.target.value})} className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 font-medium" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Full Bio</label>
                <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows="4" className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 font-medium"></textarea>
              </div>
              <div className="pt-4">
                <button type="submit" disabled={isSaving} className="w-full bg-blue-900 text-slate-900 px-8 py-4 rounded-xl font-bold hover:bg-blue-800 transition-colors flex items-center justify-center gap-2 shadow-sm">
                  <Save className="w-5 h-5" /> {isSaving ? 'Updating...' : 'Publish Profile Updates'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function HotelProfile({ user, profile }) {
  const [formData, setFormData] = useState({
    name: profile.name || '', location: profile.location || '',
    specialties: profile.specialties || '', description: profile.description || '',
    price: profile.price || '', avatar_url: profile.avatar_url || ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const { error } = await supabase.from('profiles').update(formData).eq('id', profile.id);
    setIsSaving(false);
    setMessage(error ? 'Error updating listing' : 'Property details saved!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="mb-4 text-center">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center justify-center gap-3">
          <BedDouble className="w-8 h-8 text-blue-600" />
          Property Listing Editor
        </h1>
        <p className="text-slate-500 mt-2">Manage how your hotel appears in the YatraVerse directory.</p>
      </div>

      <div className="bg-white/80 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 rounded-3xl p-8 shadow-sm border border-white/10">
        
        {/* Cover Photo Area */}
        <div className="w-full h-48 bg-gray-100 rounded-2xl mb-8 relative overflow-hidden group">
          <img 
            src={formData.avatar_url || `https://picsum.photos/seed/${encodeURIComponent(formData.name || 'Hotel')}/800/400`}
            alt="Cover"
            className="w-full h-full object-cover"
            onError={(e) => { e.target.onerror = null; e.target.src = `https://picsum.photos/seed/${encodeURIComponent(formData.name || 'Hotel')}/800/400`; }}
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-slate-900 font-bold flex items-center gap-2"><ImageIcon className="w-5 h-5"/> Update Photo via URL below</span>
          </div>
        </div>

        {message && <div className="mb-6 p-4 rounded-xl bg-green-50 text-green-700 font-medium text-center">{message}</div>}

        <form onSubmit={handleSave} className="space-y-8">
          
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 border-b border-white/10 pb-2">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Property Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 font-medium" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Location Address</label>
                <input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 font-medium" />
              </div>
            </div>
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Cover Photo URL</label>
                <input type="url" value={formData.avatar_url} onChange={(e) => setFormData({...formData, avatar_url: e.target.value})} className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 font-medium" />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 border-b border-white/10 pb-2">Details & Amenities</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Amenities</label>
                <input type="text" value={formData.specialties} onChange={(e) => setFormData({...formData, specialties: e.target.value})} placeholder="WiFi, Pool, Spa" className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 font-medium" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Starting Price (NPR)</label>
                <input type="text" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 font-medium" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Property Description</label>
              <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows="4" className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 font-medium"></textarea>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 text-center">
            <button type="submit" disabled={isSaving} className="bg-blue-600 text-white shadow-md shadow-blue-500/20 px-12 py-4 rounded-xl font-bold hover:bg-blue-100 transition-colors inline-flex items-center gap-2 shadow-sm">
              <Save className="w-5 h-5" /> {isSaving ? 'Saving...' : 'Update Property Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

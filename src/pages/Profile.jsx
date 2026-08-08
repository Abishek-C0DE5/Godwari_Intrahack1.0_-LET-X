import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { User, Mail, Shield, MapPin, Award, Settings, Save, Navigation } from 'lucide-react';

export default function Profile() {
  const { user, profile } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [rank, setRank] = useState(null);

  useEffect(() => {
    if (profile) {
      setFormData({ name: profile.name || '' });
      
      // Fetch rank if tourist
      if (profile.role === 'tourist' && profile.points !== undefined) {
        const fetchRank = async () => {
          const { count } = await supabase
            .from('profiles')
            .select('id', { count: 'exact', head: true })
            .eq('role', 'tourist')
            .gt('points', profile.points || 0);
          setRank((count || 0) + 1);
        };
        fetchRank();
      }
    }
  }, [profile]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-600">You must be logged in to view your profile.</p>
      </div>
    );
  }

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');
    
    const { error } = await supabase
      .from('profiles')
      .update({ name: formData.name })
      .eq('id', profile.id);

    setIsSaving(false);
    
    if (error) {
      setMessage('Error updating profile: ' + error.message);
    } else {
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            <User className="w-8 h-8 text-indigo-600" />
            Account Settings
          </h1>
          <p className="text-gray-500 mt-1">Manage your personal information and preferences.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Sidebar / Overview */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mb-4 border-4 border-white shadow-sm">
                <User className="w-10 h-10" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">{profile?.name || 'User'}</h2>
              <p className="text-gray-500 text-sm mb-4 capitalize">{profile?.role} Account</p>
              
              <div className="w-full pt-4 border-t border-gray-100 flex flex-col gap-2 text-left">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Mail className="w-4 h-4 text-gray-400" /> {user.email}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Shield className="w-4 h-4 text-gray-400" /> Secure Account
                </div>
              </div>
            </div>

            {profile?.role === 'tourist' && (
              <div className="bg-indigo-600 text-white rounded-3xl p-6 shadow-sm relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 opacity-10">
                  <Award className="w-32 h-32" />
                </div>
                <h3 className="font-semibold mb-1 relative z-10">YatraVerse Explorer</h3>
                <p className="text-indigo-200 text-sm mb-4 relative z-10">Keep traveling to earn points!</p>
                <div className="flex justify-between items-end relative z-10">
                  <div>
                    <div className="text-xs text-indigo-200 uppercase tracking-wider mb-1">Points</div>
                    <div className="text-2xl font-bold">{profile?.points?.toLocaleString() || 0}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-indigo-200 uppercase tracking-wider mb-1">Rank</div>
                    <div className="text-2xl font-bold">#{rank || '-'}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Main Forms */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Personal Info */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h2>
              
              <form onSubmit={handleSave} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter your name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    value={user.email}
                    disabled
                    className="w-full bg-gray-100 text-gray-500 border-none rounded-xl px-4 py-3 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1.5">Email cannot be changed directly.</p>
                </div>

                {message && (
                  <div className={`p-3 rounded-xl text-sm font-medium ${message.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                    {message}
                  </div>
                )}

                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:bg-indigo-300"
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>

            {/* Travel Preferences (UI Mock) */}
            {profile?.role === 'tourist' && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Travel Preferences</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Favorite Activities</label>
                    <div className="flex flex-wrap gap-2">
                      {['Hiking', 'Culture', 'Photography', 'Wildlife', 'Food'].map(tag => (
                        <span key={tag} className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm font-medium text-gray-600 cursor-pointer hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 pt-2">These preferences help our AI Assistant recommend better destinations for you.</p>
                </div>
              </div>
            )}

          </div>

        </div>
      </main>
    </div>
  );
}

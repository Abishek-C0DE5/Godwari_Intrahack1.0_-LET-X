import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { LogOut, BedDouble, CalendarCheck, TrendingUp, Users, CheckCircle, Clock, Save, Settings } from 'lucide-react';
import AIAssistant from '../components/AIAssistant';

export default function HotelDashboard() {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('inventory');
  
  // Profile state for settings tab
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
    setMessage(error ? 'Error updating profile' : 'Settings saved successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  // Mock PMS Data
  const roomInventory = [
    { type: 'Deluxe Suite', total: 10, booked: 8, available: 2, price: 'NPR 8000' },
    { type: 'Standard Double', total: 25, booked: 15, available: 10, price: 'NPR 4500' },
    { type: 'Single Room', total: 15, booked: 5, available: 10, price: 'NPR 2500' },
  ];

  const recentReservations = [
    { id: 'RES-091', guest: 'Prakash Sharma', room: 'Standard Double', checkIn: 'Today', status: 'arriving' },
    { id: 'RES-092', guest: 'Sarah Chen', room: 'Deluxe Suite', checkIn: 'Tomorrow', status: 'confirmed' },
    { id: 'RES-093', guest: 'John Doe', room: 'Standard Double', checkIn: 'Aug 14', status: 'pending' },
    { id: 'RES-094', guest: 'Maya Rai', room: 'Single Room', checkIn: 'Aug 15', status: 'pending' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-8">
          <div className="text-xl font-bold text-blue-900 tracking-tight flex items-center gap-2">
            <BedDouble className="w-6 h-6 text-blue-600" />
            YatraVerse PMS
          </div>
          <div className="hidden md:flex gap-1 bg-gray-100 p-1 rounded-lg">
            <button 
              onClick={() => setActiveTab('inventory')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'inventory' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'settings' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Property Settings
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-right hidden sm:block">
            <div className="font-semibold text-gray-900">{profile?.name || 'Hotel'}</div>
            <div className="text-gray-500 text-xs">Property Manager</div>
          </div>
          <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        
        {activeTab === 'inventory' && (
          <>
            {/* KPI Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Available Rooms', value: '22', icon: BedDouble, color: 'blue' },
                { label: 'Today\'s Check-ins', value: '1', icon: CalendarCheck, color: 'green' },
                { label: 'Pending Requests', value: '2', icon: Clock, color: 'yellow' },
                { label: 'Monthly Revenue', value: 'NPR 1.2M', icon: TrendingUp, color: 'indigo' },
              ].map((kpi, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${kpi.color}-50 text-${kpi.color}-600`}>
                    <kpi.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500">{kpi.label}</div>
                    <div className="text-2xl font-bold text-gray-900">{kpi.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Room Inventory */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h2 className="font-bold text-gray-900 text-lg">Room Inventory & Status</h2>
                  </div>
                  <div className="p-6">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                            <th className="pb-3 px-2">Room Type</th>
                            <th className="pb-3 px-2 text-center">Total</th>
                            <th className="pb-3 px-2 text-center">Booked</th>
                            <th className="pb-3 px-2 text-center">Available</th>
                            <th className="pb-3 px-2 text-right">Base Rate</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {roomInventory.map((room, i) => (
                            <tr key={i} className="hover:bg-gray-50 transition-colors">
                              <td className="py-4 px-2 font-medium text-gray-900">{room.type}</td>
                              <td className="py-4 px-2 text-center text-gray-600">{room.total}</td>
                              <td className="py-4 px-2 text-center text-blue-600 font-medium">{room.booked}</td>
                              <td className="py-4 px-2 text-center">
                                <span className={`px-2.5 py-1 rounded-md text-sm font-medium ${room.available > 5 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                  {room.available}
                                </span>
                              </td>
                              <td className="py-4 px-2 text-right text-gray-600">{room.price}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                {/* Recent Reservations */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h2 className="font-bold text-gray-900 text-lg">Recent Reservations</h2>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {recentReservations.map((res, i) => (
                      <div key={i} className="p-5 hover:bg-gray-50 transition-colors flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                          <Users className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline mb-1">
                            <h4 className="font-semibold text-gray-900 truncate">{res.guest}</h4>
                            <span className="text-xs font-medium text-gray-400">{res.id}</span>
                          </div>
                          <p className="text-sm text-gray-500 mb-2">{res.room}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                              In: {res.checkIn}
                            </span>
                            {res.status === 'arriving' && <span className="flex items-center gap-1 text-xs font-medium text-blue-600"><Clock className="w-3.5 h-3.5"/> Arriving</span>}
                            {res.status === 'confirmed' && <span className="flex items-center gap-1 text-xs font-medium text-green-600"><CheckCircle className="w-3.5 h-3.5"/> Confirmed</span>}
                            {res.status === 'pending' && <span className="flex items-center gap-1 text-xs font-medium text-yellow-600"><Clock className="w-3.5 h-3.5"/> Pending</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 border-t border-gray-100 bg-gray-50/50 text-center">
                    <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">View All Ledger →</button>
                  </div>
                </div>

                {/* AI Assistant */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                  <AIAssistant />
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600">
                <Settings className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Property Settings</h2>
                <p className="text-gray-500 text-sm">Update your public hotel listing details.</p>
              </div>
            </div>

            {message && (
              <div className="mb-6 p-4 rounded-xl bg-green-50 text-green-700 font-medium text-sm">
                {message}
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Property Name</label>
                  <input type="text" name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                  <input type="text" name="location" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Amenities</label>
                  <input type="text" name="specialties" value={formData.specialties} onChange={(e) => setFormData({...formData, specialties: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Starting Price (NPR)</label>
                  <input type="text" name="price" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Cover Photo URL</label>
                <input type="url" name="avatar_url" value={formData.avatar_url} onChange={(e) => setFormData({...formData, avatar_url: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea name="description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows="4" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
              </div>
              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button type="submit" disabled={isSaving} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2">
                  <Save className="w-5 h-5" />
                  {isSaving ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </form>
          </div>
        )}

      </main>
    </div>
  );
}

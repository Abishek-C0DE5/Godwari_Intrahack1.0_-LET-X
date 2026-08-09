import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { MapPin, Navigation, MessageSquare, Award, Compass } from 'lucide-react';
import AIAssistant from '../components/AIAssistant';

export default function TouristDashboard() {
  const { profile } = useAuth();
  const [trips, setTrips] = useState([]);
  const [rank, setRank] = useState(null);

  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      // Fetch 6 destinations for the grid
      const { data: destData } = await supabase
        .from('destinations')
        .select('*')
        .limit(6);
        
      if (destData) setDestinations(destData);

      if (!profile?.id) return;

      // Fetch upcoming trips
      const { data: tripData } = await supabase
        .from('trips')
        .select('*, destinations(name)')
        .eq('tourist_id', profile.id)
        .order('start_date', { ascending: true })
        .limit(1);

      if (tripData && tripData.length > 0) {
        setTrips(tripData);
      }

      // Fetch rank
      // Since SQL doesn't have an easy RANK() without RPC, we just count how many users have MORE points than this user.
      if (profile.points !== undefined) {
        const { count } = await supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true })
          .eq('role', 'tourist')
          .gt('points', profile.points || 0);
          
        setRank((count || 0) + 11);
      }
    };

    fetchDashboardData();
  }, [profile]);

  return (
    <div className="bg-transparent flex flex-col text-white">
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Welcome, {profile?.name || 'Explorer'}
            </h1>
            <p className="text-gray-300 mt-1 font-medium">Ready for your next adventure?</p>
          </div>
          <div className="flex gap-4">
            <Link to="/leaderboard" className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl shadow-xl border border-white/20 flex items-center gap-3 hover:border-blue-400 hover:bg-white/20 transition-all group">
              <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center text-white group-hover:bg-blue-500 transition-colors shadow-md">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-gray-300 font-medium uppercase tracking-wider">Your Points</div>
                <div className="font-bold text-white leading-tight">
                  {profile?.points?.toLocaleString() || 0} 
                  <span className="text-sm font-medium text-gray-300 ml-2">Rank #{rank || '-'} →</span>
                </div>
              </div>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content - Left Column (2/3 width) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Explore Section */}
            <section className="bg-blue-900/30 backdrop-blur-xl border-blue-400/20 p-6 rounded-3xl shadow-xl border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Compass className="w-5 h-5 text-blue-400" /> Explore Destinations
                </h2>
                <Link to="/destinations" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">View All 15+ Places →</Link>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {destinations.map(dest => (
                  <Link to={`/destinations/${dest.id}`} key={dest.name} className="group block relative overflow-hidden rounded-2xl aspect-[4/3] border border-white/10 shadow-lg">
                    <img 
                      src={dest.image_url} 
                      alt={dest.name} 
                      onError={(e) => {
                        e.target.onerror = null;
                        const placeholder = `https://picsum.photos/seed/${encodeURIComponent(dest.name)}/400/300`;
                        e.target.src = placeholder;
                      }}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-blue-950/30 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="text-white font-medium flex items-center gap-1.5 drop-shadow-md">
                        <MapPin className="w-3.5 h-3.5" /> {dest.name}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

          </div>

          {/* Sidebar - Right Column (1/3 width) */}
          <div className="space-y-6">
            
            {/* Upcoming Trip */}
            <div className="bg-blue-900/60 backdrop-blur-sm text-white p-6 rounded-3xl shadow-xl border border-white/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-20">
                <Navigation className="w-24 h-24" />
              </div>
              <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4 relative z-10">Upcoming Trip</h3>
              
              {trips.length > 0 ? (
                <div className="relative z-10">
                  <div className="text-2xl font-bold mb-1">{trips[0].title}</div>
                  <div className="text-gray-300 mb-6 font-medium">{trips[0].destinations?.name} — {trips[0].days} Days Experience</div>
                  <Link to={`/destinations/${trips[0].destination_id}`} className="inline-flex items-center justify-center w-full bg-blue-700 text-white shadow-md shadow-blue-900/50 shadow-xl font-bold py-3 rounded-xl hover:bg-blue-50 hover:scale-[1.02] transition-all shadow-lg">
                    View Destination Details
                  </Link>
                </div>
              ) : (
                <div className="relative z-10">
                  <div className="text-xl font-bold mb-2">No trips booked yet</div>
                  <div className="text-gray-300 text-sm mb-6 font-medium">Find a destination and book a local guide to start your journey.</div>
                  <Link to="/destinations" className="inline-flex items-center justify-center w-full bg-blue-700 text-white shadow-md shadow-blue-900/50 shadow-xl font-bold py-3 rounded-xl hover:bg-blue-50 hover:scale-[1.02] transition-all shadow-lg">
                    Find a Destination
                  </Link>
                </div>
              )}
            </div>

            {/* AI Assistant */}
            <div className="bg-blue-900/30 backdrop-blur-xl border-blue-400/20 rounded-3xl shadow-xl border border-white/10 overflow-hidden">
              <AIAssistant />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { MapPin, Navigation, MessageSquare, Award, Compass } from 'lucide-react';

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
          
        setRank((count || 0) + 1);
      }
    };

    fetchDashboardData();
  }, [profile]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Welcome, {profile?.name || 'Explorer'}
            </h1>
            <p className="text-gray-500 mt-1">Ready for your next adventure?</p>
          </div>
          <div className="flex gap-4">
            <Link to="/leaderboard" className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3 hover:border-indigo-200 hover:shadow-md transition-all group">
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Your Points</div>
                <div className="font-bold text-gray-900 leading-tight">
                  {profile?.points?.toLocaleString() || 0} 
                  <span className="text-sm font-medium text-indigo-600 ml-2">Rank #{rank || '-'} →</span>
                </div>
              </div>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content - Left Column (2/3 width) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Explore Section */}
            <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-indigo-500" /> Explore Destinations
                </h2>
                <Link to="/destinations" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">View All 15+ Places →</Link>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {destinations.map(dest => (
                  <Link to={`/destinations/${dest.id}`} key={dest.name} className="group block relative overflow-hidden rounded-2xl aspect-[4/3]">
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="text-white font-medium flex items-center gap-1.5">
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
            <div className="bg-gray-900 text-white p-6 rounded-3xl shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Navigation className="w-24 h-24" />
              </div>
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4 relative z-10">Upcoming Trip</h3>
              
              {trips.length > 0 ? (
                <div className="relative z-10">
                  <div className="text-2xl font-bold mb-1">{trips[0].title}</div>
                  <div className="text-gray-300 mb-6">{trips[0].destinations?.name} — {trips[0].days} Days Experience</div>
                  <Link to={`/destinations/${trips[0].destination_id}`} className="inline-flex items-center justify-center w-full bg-white text-gray-900 font-medium py-2.5 rounded-xl hover:bg-gray-100 transition-colors">
                    View Destination Details
                  </Link>
                </div>
              ) : (
                <div className="relative z-10">
                  <div className="text-xl font-medium mb-2">No trips booked yet</div>
                  <div className="text-gray-400 text-sm mb-6">Find a destination and book a local guide to start your journey.</div>
                  <Link to="/destinations" className="inline-flex items-center justify-center w-full bg-indigo-500 text-white font-medium py-2.5 rounded-xl hover:bg-indigo-600 transition-colors">
                    Find a Destination
                  </Link>
                </div>
              )}
            </div>

            {/* AI Assistant */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">AI Travel Assistant</h3>
              <p className="text-gray-500 text-sm mb-6">
                Not sure where to go? Ask our smart assistant to plan a personalized trip for you.
              </p>
              <button className="w-full bg-indigo-600 text-white font-medium py-2.5 rounded-xl hover:bg-indigo-700 transition-colors">
                Start Chat (Coming Soon)
              </button>
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
}

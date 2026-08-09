import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Trophy, Medal, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const DUMMY_USERS = [
  { name: 'Sarah Chen', location: 'Singapore', points: 15420 },
  { name: 'David Miller', location: 'Australia', points: 12850 },
  { name: 'Emma Watson', location: 'United Kingdom', points: 10500 },
  { name: 'Kenji Sato', location: 'Japan', points: 8900 },
  { name: 'Maria Garcia', location: 'Spain', points: 7200 },
  { name: 'Alex Johnson', location: 'USA', points: 5100 },
  { name: 'Priya Patel', location: 'India', points: 4300 },
  { name: 'Lucas Silva', location: 'Brazil', points: 3800 },
  { name: 'Sophie Martin', location: 'France', points: 2900 },
  { name: 'Liam O\'Connor', location: 'Ireland', points: 1500 }
];

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('name, points, location')
        .eq('role', 'tourist')
        .order('points', { ascending: false })
        .limit(20);
        
      if (error) {
        console.error('Error fetching leaderboard:', error);
      } else {
        const merged = [...DUMMY_USERS, ...(data || [])].sort((a, b) => (b.points || 0) - (a.points || 0));
        setLeaders(merged);
      }
      setLoading(false);
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="max-w-4xl mx-auto w-full px-6 py-12">
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <div className="w-16 h-16 rounded-full bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center text-yellow-300 mx-auto mb-6 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
          <Trophy className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-bold text-white tracking-tight mb-4">Tourism Leaderboard</h1>
        <p className="text-lg text-gray-300">
          Explore destinations, complete trips, and leave reviews to earn points and climb the ranks!
        </p>
      </div>

      <div className="bg-black/20 backdrop-blur-md border border-white/20 shadow-xl rounded-3xl overflow-hidden">
        {loading ? (
          <div className="text-center py-20 text-gray-300">Loading rankings...</div>
        ) : leaders.length === 0 ? (
          <div className="text-center py-20 text-gray-300">No rankings available yet.</div>
        ) : (
          <div className="divide-y divide-white/10">
            {leaders.map((user, index) => (
              <div 
                key={index} 
                className={`flex items-center justify-between p-6 transition-colors hover:bg-white/5 ${index < 3 ? 'bg-blue-500/10' : ''}`}
              >
                <div className="flex items-center gap-6">
                  <div className={`w-10 text-center font-bold text-lg ${
                    index === 0 ? 'text-yellow-400' : 
                    index === 1 ? 'text-gray-300' : 
                    index === 2 ? 'text-amber-500' : 'text-gray-500'
                  }`}>
                    {index < 3 ? <Medal className="w-8 h-8 mx-auto" /> : `#${index + 1}`}
                  </div>
                  
                  <div>
                    <div className="font-bold text-white text-lg">{user.name}</div>
                    {user.location && (
                      <div className="flex items-center gap-1 text-sm text-gray-400 mt-1">
                        <MapPin className="w-3.5 h-3.5" /> {user.location}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-bold text-blue-400 text-xl">{user.points?.toLocaleString() || 0}</div>
                  <div className="text-xs font-medium text-gray-400 uppercase tracking-wider">Points</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="mt-8 text-center">
        <Link to="/tourist" className="text-sm font-medium text-gray-300 hover:text-white">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

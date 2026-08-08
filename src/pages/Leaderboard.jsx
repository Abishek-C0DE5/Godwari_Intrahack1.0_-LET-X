import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Trophy, Medal, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

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
        setLeaders(data);
      }
      setLoading(false);
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="max-w-4xl mx-auto w-full px-6 py-12">
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <div className="w-16 h-16 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-500 mx-auto mb-6">
          <Trophy className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">Tourism Leaderboard</h1>
        <p className="text-lg text-gray-500">
          Explore destinations, complete trips, and leave reviews to earn points and climb the ranks!
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading rankings...</div>
        ) : leaders.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No rankings available yet.</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {leaders.map((user, index) => (
              <div 
                key={index} 
                className={`flex items-center justify-between p-6 transition-colors hover:bg-gray-50 ${index < 3 ? 'bg-blue-50/30' : ''}`}
              >
                <div className="flex items-center gap-6">
                  <div className={`w-10 text-center font-bold text-lg ${
                    index === 0 ? 'text-yellow-500' : 
                    index === 1 ? 'text-gray-400' : 
                    index === 2 ? 'text-amber-700' : 'text-gray-400'
                  }`}>
                    {index < 3 ? <Medal className="w-8 h-8 mx-auto" /> : `#${index + 1}`}
                  </div>
                  
                  <div>
                    <div className="font-bold text-gray-900 text-lg">{user.name}</div>
                    {user.location && (
                      <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                        <MapPin className="w-3.5 h-3.5" /> {user.location}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-bold text-blue-600 text-xl">{user.points?.toLocaleString() || 0}</div>
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Points</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="mt-8 text-center">
        <Link to="/tourist" className="text-sm font-medium text-gray-500 hover:text-gray-900">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

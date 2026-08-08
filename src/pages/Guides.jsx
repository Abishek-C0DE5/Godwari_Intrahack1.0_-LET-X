import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Card } from '../components/Card';
import { Users } from 'lucide-react';

export default function Guides() {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuides = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'guide');
        
      if (error) {
        console.error('Error fetching guides:', error);
      } else {
        setGuides(data);
      }
      setLoading(false);
    };

    fetchGuides();
  }, []);

  return (
    <div className="max-w-7xl mx-auto w-full px-6 py-12">
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mx-auto mb-4">
          <Users className="w-6 h-6" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">Local Guides</h1>
        <p className="text-lg text-gray-500">
          Connect with experienced local guides to make your journey unforgettable.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading guides...</div>
      ) : guides.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No guides found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {guides.map(guide => (
            <Card 
              key={guide.id}
              type="guide"
              title={guide.name}
              subtitle={guide.specialties || 'General Tourism'}
              image={guide.avatar_url || 'https://images.unsplash.com/photo-1544168190-79c15427008f?auto=format&fit=crop&q=80'}
              rating={guide.rating}
              location={guide.location}
              price={guide.price}
              linkTo="#"
              actionText="View Profile"
            />
          ))}
        </div>
      )}
    </div>
  );
}

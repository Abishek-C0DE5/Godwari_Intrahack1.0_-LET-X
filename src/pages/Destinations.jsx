import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Card } from '../components/Card';
import { Compass } from 'lucide-react';

export default function Destinations() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchDestinations = async () => {
      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .order('name');
        
      if (error) {
        console.error('Error fetching destinations:', error);
      } else {
        setDestinations(data);
      }
      setLoading(false);
    };

    fetchDestinations();
  }, []);

  return (
    <div className="max-w-7xl mx-auto w-full px-6 py-12">
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mx-auto mb-4">
          <Compass className="w-6 h-6" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">Explore Destinations</h1>
        <p className="text-lg text-gray-500">
          Discover the most beautiful places to visit. Find your next adventure and connect with local experts.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading destinations...</div>
      ) : destinations.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No destinations found. Please run the SQL migration.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.slice(0, showAll ? destinations.length : 5).map(dest => (
              <Card 
                key={dest.id}
                type="destination"
                title={dest.name}
                subtitle={dest.description.length > 100 ? dest.description.substring(0, 100) + '...' : dest.description}
                image={dest.image_url}
                location={dest.location}
                linkTo={`/destinations/${dest.id}`}
                actionText="Explore"
              />
            ))}
          </div>
          {destinations.length > 5 && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setShowAll(!showAll)}
                className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
              >
                {showAll ? 'Show Less' : 'Explore More'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Card } from '../components/Card';
import { Home as HomeIcon } from 'lucide-react';

export default function Hotels() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotels = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'hotel');
        
      if (error) {
        console.error('Error fetching hotels:', error);
      } else {
        setHotels(data);
      }
      setLoading(false);
    };

    fetchHotels();
  }, []);

  return (
    <div className="max-w-7xl mx-auto w-full px-6 py-12">
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mx-auto mb-4">
          <HomeIcon className="w-6 h-6" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">Stays & Hotels</h1>
        <p className="text-lg text-gray-500">
          Find the perfect place to rest during your adventures.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading hotels...</div>
      ) : hotels.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No hotels found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hotels.map(hotel => (
            <Card 
              key={hotel.id}
              type="hotel"
              title={hotel.name}
              subtitle={hotel.description || 'Accommodation'}
              image={hotel.avatar_url}
              rating={hotel.rating}
              location={hotel.location}
              price={hotel.price}
              linkTo="#"
              actionText="View Details"
            />
          ))}
        </div>
      )}
    </div>
  );
}

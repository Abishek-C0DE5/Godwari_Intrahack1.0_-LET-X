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
        
      const dbHotels = data && !error ? data : [];
      
      const mockHotels = [
        { id: 'h1', name: 'Kathmandu Heritage Resort', description: 'Luxury Heritage Stay', avatar_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80', rating: 4.8, location: 'Thamel, Kathmandu', price: 'NPR 12000/night' },
        { id: 'h2', name: 'Pokhara Lakeside Inn', description: 'Lakeview Balconies & Spa', avatar_url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80', rating: 4.6, location: 'Lakeside, Pokhara', price: 'NPR 8500/night' },
        { id: 'h3', name: 'Chitwan Jungle Lodge', description: 'Eco-friendly Safari Resort', avatar_url: 'https://images.unsplash.com/photo-1542314831-c6a4d14d8373?auto=format&fit=crop&w=600&q=80', rating: 4.9, location: 'Sauraha, Chitwan', price: 'NPR 15000/night' },
        { id: 'h4', name: 'Namche Everest View', description: 'Highest Altitude Comfort', avatar_url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80', rating: 4.7, location: 'Namche Bazaar', price: 'NPR 25000/night' },
        { id: 'h5', name: 'Lumbini Peace Garden', description: 'Tranquil Meditation Retreat', avatar_url: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=600&q=80', rating: 4.5, location: 'Lumbini', price: 'NPR 5000/night' },
        { id: 'h6', name: 'Bhaktapur Guest House', description: 'Authentic Newari Architecture', avatar_url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=600&q=80', rating: 4.6, location: 'Bhaktapur Durbar', price: 'NPR 4500/night' },
      ];

      // Merge database hotels with mock hotels, avoiding duplicates by name
      const dbNames = dbHotels.map(h => h.name);
      const filteredMocks = mockHotels.filter(m => !dbNames.includes(m.name));

      setHotels([...dbHotels, ...filteredMocks]);
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

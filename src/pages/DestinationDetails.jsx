import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Card } from '../components/Card';
import { MapPin, ArrowLeft } from 'lucide-react';

export default function DestinationDetails() {
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [guides, setGuides] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      // 1. Fetch Destination
      const { data: destData, error: destError } = await supabase
        .from('destinations')
        .select('*')
        .eq('id', id)
        .single();
        
      if (destError) {
        console.error(destError);
        setLoading(false);
        return;
      }
      setDestination(destData);

      // 2. Fetch Guides in this location
      const { data: guideData } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'guide')
        .ilike('location', `%${destData.location}%`);
      if (guideData) setGuides(guideData);

      // 3. Fetch Hotels in this location
      const { data: hotelData } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'hotel')
        .ilike('location', `%${destData.location}%`);
      if (hotelData) setHotels(hotelData);

      setLoading(false);
    };

    fetchAll();
  }, [id]);

  if (loading) return <div className="text-center py-20">Loading details...</div>;
  if (!destination) return <div className="text-center py-20">Destination not found.</div>;

  return (
    <div className="max-w-7xl mx-auto w-full px-6 py-12">
      <Link to="/destinations" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 mb-8">
        <ArrowLeft className="w-4 h-4" /> Back to Destinations
      </Link>

      {/* Destination Hero */}
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 mb-12">
        <div className="aspect-[21/9] w-full relative">
          <img src={destination.image_url} alt={destination.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
          <div className="absolute bottom-8 left-8 right-8">
            <h1 className="text-5xl font-bold text-white mb-2">{destination.name}</h1>
            <div className="flex items-center gap-2 text-white/90">
              <MapPin className="w-5 h-5" /> {destination.location}
            </div>
          </div>
        </div>
        <div className="p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">About {destination.name}</h2>
          <p className="text-gray-600 leading-relaxed text-lg">{destination.description}</p>
        </div>
      </div>

      {/* Available Services */}
      <div className="space-y-16">
        
        {/* Guides Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Local Guides in {destination.name}</h2>
          </div>
          {guides.length === 0 ? (
            <div className="bg-gray-50 rounded-2xl p-8 text-center text-gray-500 border border-gray-100">
              No guides are currently registered in this location.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        </section>

        {/* Hotels Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Hotels & Stays</h2>
          </div>
          {hotels.length === 0 ? (
            <div className="bg-gray-50 rounded-2xl p-8 text-center text-gray-500 border border-gray-100">
              No hotels are currently registered in this location.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotels.map(hotel => (
                <Card 
                  key={hotel.id}
                  type="hotel"
                  title={hotel.name}
                  subtitle={hotel.description || 'Accommodation'}
                  image={hotel.avatar_url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80'}
                  rating={hotel.rating}
                  location={hotel.location}
                  price={hotel.price}
                  linkTo="#"
                  actionText="View Details"
                />
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}

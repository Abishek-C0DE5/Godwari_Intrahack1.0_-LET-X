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
        
      const dbGuides = data && !error ? data : [];
      
      const mockGuides = [
        { id: 'm1', name: 'Nima Sherpa', specialties: 'High Altitude Trekking, Everest Region', avatar_url: 'https://ui-avatars.com/api/?name=Nima+Sherpa&background=random&size=400', rating: 4.9, location: 'Namche Bazaar', price: 'NPR 3500/day' },
        { id: 'm2', name: 'Sita Thapa', specialties: 'Cultural Heritage, Kathmandu Valley', avatar_url: 'https://ui-avatars.com/api/?name=Sita+Thapa&background=random&size=400', rating: 4.8, location: 'Kathmandu', price: 'NPR 2500/day' },
        { id: 'm3', name: 'Bikash Tamang', specialties: 'Wildlife Safari, Bird Watching', avatar_url: 'https://ui-avatars.com/api/?name=Bikash+Tamang&background=random&size=400', rating: 4.7, location: 'Chitwan', price: 'NPR 3000/day' },
        { id: 'm4', name: 'Pasang Lhamu', specialties: 'Annapurna Circuit, Mountaineering', avatar_url: 'https://ui-avatars.com/api/?name=Pasang+Lhamu&background=random&size=400', rating: 5.0, location: 'Pokhara', price: 'NPR 4000/day' },
        { id: 'm5', name: 'Ravi Sharma', specialties: 'Food Tours, History, Photography', avatar_url: 'https://ui-avatars.com/api/?name=Ravi+Sharma&background=random&size=400', rating: 4.6, location: 'Patan', price: 'NPR 2000/day' },
        { id: 'm6', name: 'Tenzing Gurung', specialties: 'Mustang Region, Motorbike Tours', avatar_url: 'https://ui-avatars.com/api/?name=Tenzing+Gurung&background=random&size=400', rating: 4.8, location: 'Jomsom', price: 'NPR 4500/day' },
      ];

      // Merge database guides with mock guides, avoiding duplicates by name
      const dbNames = dbGuides.map(g => g.name);
      const filteredMocks = mockGuides.filter(m => !dbNames.includes(m.name));
      
      setGuides([...dbGuides, ...filteredMocks]);
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
              image={guide.avatar_url}
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

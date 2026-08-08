import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Card } from '../components/Card';
import { Compass } from 'lucide-react';

const TOPICS = [
  'All',
  'Hiking',
  'Adventure',
  'Nature',
  'Culture',
  'Heritage',
  'Wildlife',
  'Paragliding',
  'Photography',
  'Peace'
];

export default function Destinations() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState('All');

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

  const filteredDestinations = destinations.filter(dest => {
    if (selectedTopic === 'All') return true;
    const activities = dest.activities || [];
    return activities.includes(selectedTopic);
  });

  return (
    <div className="max-w-7xl mx-auto w-full px-6 py-12">
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mx-auto mb-4">
          <Compass className="w-6 h-6" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">Explore Destinations</h1>
        <p className="text-lg text-gray-500 mb-8">
          Discover the most beautiful places to visit based on the adventures you seek.
        </p>

        {/* Topic Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {TOPICS.map(topic => (
            <button
              key={topic}
              onClick={() => setSelectedTopic(topic)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedTopic === topic
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading destinations...</div>
      ) : filteredDestinations.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="mb-2">No destinations found for "{selectedTopic}".</p>
          <p className="text-sm">Make sure you have run the `05_add_destination_activities.sql` migration!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDestinations.map(dest => (
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
      )}
    </div>
  );
}

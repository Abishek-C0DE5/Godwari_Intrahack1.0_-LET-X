import { Link } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';
import { DestinationImage } from './DestinationImage';

export function Card({ 
  id,
  type, // 'destination', 'guide', 'hotel'
  title, 
  subtitle, 
  image, 
  rating, 
  price, 
  location,
  linkTo,
  actionText = "View Details"
}) {
  const avatarPlaceholder = `https://ui-avatars.com/api/?name=${encodeURIComponent(title)}&background=random&size=400`;

  return (
    <div className="bg-black/20 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl overflow-hidden group hover:-translate-y-1 transition-all">
      <div className="relative aspect-[4/3] overflow-hidden bg-black/40 group">
        {type === 'destination' ? (
          <DestinationImage 
            name={title}
            originalUrl={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
          />
        ) : (
          <img 
            src={image || avatarPlaceholder} 
            alt={title}
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = avatarPlaceholder;
            }}
            className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
          />
        )}
          {type === 'guide' && (
            <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md border border-white/20 px-2.5 py-1 rounded-lg text-xs font-bold text-white tracking-wider">
              LOCAL GUIDE
            </div>
          )}
        </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-white leading-tight">{title}</h3>
          {rating && (
            <div className="flex items-center gap-1 text-sm font-medium text-gray-200 bg-transparent px-2 py-1 rounded-md">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              {rating}
            </div>
          )}
        </div>
        
        {subtitle && (
          <p className="text-gray-300 text-sm mb-3">{subtitle}</p>
        )}
        
        {location && (
          <div className="flex items-center gap-1.5 text-sm text-gray-400 mb-4">
            <MapPin className="w-4 h-4 text-gray-400" />
            {location}
          </div>
        )}
        
        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
          <div className="font-semibold text-blue-400">
            {price ? price : 'Free to explore'}
          </div>
          <Link 
            to={linkTo} 
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            {actionText} →
          </Link>
        </div>
      </div>
    </div>
  );
}

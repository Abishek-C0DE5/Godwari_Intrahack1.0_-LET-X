import { Link } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';

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
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-all">
      {image && (
        <div className="aspect-[4/3] overflow-hidden relative">
          <img 
            src={image} 
            alt={title} 
            onError={(e) => {
              const placeholder = `https://source.unsplash.com/featured/400x300?${encodeURIComponent(title)}`;
              e.target.src = placeholder;
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {type === 'guide' && (
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg text-xs font-semibold text-gray-900">
              LOCAL GUIDE
            </div>
          )}
        </div>
      )}
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900 leading-tight">{title}</h3>
          {rating && (
            <div className="flex items-center gap-1 text-sm font-medium text-gray-700 bg-gray-50 px-2 py-1 rounded-md">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              {rating}
            </div>
          )}
        </div>
        
        {subtitle && (
          <p className="text-gray-500 text-sm mb-3">{subtitle}</p>
        )}
        
        {location && (
          <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
            <MapPin className="w-4 h-4 text-gray-400" />
            {location}
          </div>
        )}
        
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="font-semibold text-gray-900">
            {price ? price : 'Free to explore'}
          </div>
          <Link 
            to={linkTo} 
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            {actionText} →
          </Link>
        </div>
      </div>
    </div>
  );
}

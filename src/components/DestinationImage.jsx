import { useState, useEffect } from 'react';
import { getDestinationImage } from '../utils/images';

export function DestinationImage({ name, originalUrl, className, alt }) {
  const [imgSrc, setImgSrc] = useState('');
  
  useEffect(() => {
    // The originalUrl from the database uses picsum /seed/ which heavily rate-limits 
    // and causes broken images/fallbacks. We MUST use our reliable ID map instead.
    setImgSrc(getDestinationImage(name));
  }, [name]);

  return (
    <img 
      src={imgSrc || '/images/bg.png'} 
      alt={alt || name}
      className={className}
      loading="lazy"
      onError={(e) => {
        // Ultimate fallback if even the Wikipedia/Unsplash image fails to load
        e.target.onerror = null;
        e.target.src = '/images/bg.png';
      }}
    />
  );
}

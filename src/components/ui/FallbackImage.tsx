'use client';

import Image from 'next/image';
import { useState } from 'react';

interface FallbackImageProps {
  src: string;
  fallbackSrc?: string;
  alt: string;
  fill?: boolean;
  className?: string;
}

export function FallbackImage({ 
  src, 
  fallbackSrc = '/images/placeholder.jpg',
  alt,
  fill,
  className
}: FallbackImageProps) {
  const [error, setError] = useState(false);

  return (
    <Image
      src={error ? fallbackSrc : src}
      alt={alt}
      fill={fill}
      className={className}
      onError={() => setError(true)}
    />
  );
} 
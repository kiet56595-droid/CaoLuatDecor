import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt = 'Hình ảnh nội thất Cao Luật Decor',
  className = '',
  fallbackSrc,
  ...props
}) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const defaultPlaceholder =
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80';

  if (error) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#F7F3ED] text-[#877B70] p-4 text-center ${className}`}
      >
        <ImageOff className="w-8 h-8 mb-2 opacity-50" />
        <span className="text-xs font-medium">Hình ảnh đang cập nhật</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {loading && (
        <div className="absolute inset-0 bg-[#EDE5DA] animate-pulse flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-[#654329] border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <img
        src={src || fallbackSrc || defaultPlaceholder}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          loading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={() => setLoading(false)}
        onError={() => {
          if (fallbackSrc && src !== fallbackSrc) {
            // Try fallback
            setError(false);
          } else {
            setError(true);
            setLoading(false);
          }
        }}
        loading="lazy"
        {...props}
      />
    </div>
  );
};

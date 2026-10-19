import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, PhoneCall, Sparkles } from 'lucide-react';
import { Product } from '../../types';
import { ImageWithFallback } from '../common/ImageWithFallback';

interface ProductCardProps {
  product: Product;
  onOpenQuote?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenQuote }) => {
  const formattedPrice = product.price
    ? `${product.price.toLocaleString('vi-VN')} đ`
    : product.displayPrice || 'Liên hệ báo giá';

  return (
    <div className="luxury-card bg-white rounded-lg border border-[#E7DCce] overflow-hidden flex flex-col h-full group">
      {/* Image Container with Badges */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#FAF8F5]">
        <Link to={`/san-pham/${product.slug}`} className="block w-full h-full">
          <ImageWithFallback
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          <span className="bg-[#29231F]/80 backdrop-blur-sm text-[#DFC7A7] text-[10px] font-mono font-semibold px-2 py-0.5 rounded shadow">
            {product.code}
          </span>
          {product.isNew && (
            <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow uppercase">
              Mới
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-[#D97706] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" /> Bán chạy
            </span>
          )}
        </div>

        {/* Hover Quick Overlay */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 pointer-events-none">
          <Link
            to={`/san-pham/${product.slug}`}
            className="pointer-events-auto bg-white/95 hover:bg-white text-[#29231F] text-xs font-semibold py-2 px-3.5 rounded-full shadow-lg flex items-center gap-1.5 transition-transform transform translate-y-2 group-hover:translate-y-0"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Xem nhanh</span>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        {/* Category */}
        <span className="text-[11px] font-medium uppercase tracking-wider text-[#9E978F] mb-1">
          {product.categoryName}
        </span>

        {/* Title */}
        <h3 className="font-serif font-bold text-base sm:text-lg text-[#29231F] group-hover:text-[#654329] transition-colors line-clamp-1 mb-2">
          <Link to={`/san-pham/${product.slug}`}>{product.name}</Link>
        </h3>

        {/* Material & Dimension preview */}
        <p className="text-xs text-[#6E665E] line-clamp-2 mb-3 leading-relaxed">
          {product.material}
        </p>

        {/* Price Section */}
        <div className="mt-auto pt-3 border-t border-[#F7F3ED]">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-xs text-[#9E978F] block">Giá tham khảo:</span>
              <span className={`font-serif font-bold ${
                product.price ? 'text-[#654329] text-base sm:text-lg' : 'text-[#877B70] text-sm italic'
              }`}>
                {formattedPrice}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Link
              to={`/san-pham/${product.slug}`}
              className="w-full py-2 px-2.5 border border-[#654329] text-[#654329] hover:bg-[#654329] hover:text-white rounded text-center text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center"
            >
              Xem chi tiết
            </Link>

            <button
              onClick={() => onOpenQuote && onOpenQuote(product)}
              className="w-full py-2 px-2.5 bg-[#654329] hover:bg-[#533722] text-[#FAF8F5] rounded text-center text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-1 shadow-sm"
            >
              <PhoneCall className="w-3 h-3 text-[#DFC7A7]" />
              <span>Báo giá</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

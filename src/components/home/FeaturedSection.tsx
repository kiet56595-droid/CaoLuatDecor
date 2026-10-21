import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { ProductCard } from '../products/ProductCard';
import { ArrowRight, Sparkles } from 'lucide-react';

interface FeaturedSectionProps {
  products: Product[];
  onOpenQuote?: (product: Product) => void;
}

export const FeaturedSection: React.FC<FeaturedSectionProps> = ({
  products,
  onOpenQuote,
}) => {
  const featured = products.filter((p) => p.isFeatured).slice(0, 4);

  return (
    <section className="py-16 sm:py-20 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-[#654329] mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>SẢN PHẨM TIÊU BIỂU</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#29231F]">
              Sản Phẩm Nội Thất Nổi Bật
            </h2>
            <p className="text-xs sm:text-sm text-[#6E665E] mt-1">
              Mẫu nội thất cao cấp được thiết kế chuẩn xưởng và được khách hàng yêu thích nhất.
            </p>
          </div>

          <Link
            to="/san-pham"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#654329] hover:text-[#432C1B] transition-colors"
          >
            <span>Xem tất cả sản phẩm</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenQuote={onOpenQuote}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

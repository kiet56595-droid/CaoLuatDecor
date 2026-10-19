import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { ProductCard } from '../products/ProductCard';
import { Sparkles, Flame, ArrowRight } from 'lucide-react';

interface ProductTabsSectionProps {
  products: Product[];
  onOpenQuote?: (product: Product) => void;
}

export const ProductTabsSection: React.FC<ProductTabsSectionProps> = ({
  products,
  onOpenQuote,
}) => {
  const [activeTab, setActiveTab] = useState<'new' | 'bestseller'>('new');

  const newProducts = products.filter((p) => p.isNew).slice(0, 4);
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);

  const displayedProducts = activeTab === 'new' ? newProducts : bestSellers;

  return (
    <section className="py-16 bg-[#F7F3ED]/60 border-y border-[#E7DCce]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-[#654329] block mb-1">
              XU HƯỚNG NỘI THẤT
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#29231F]">
              Bộ Sưu Tập Mới &amp; Được Yêu Thích
            </h2>
          </div>

          {/* Tab Buttons */}
          <div className="inline-flex p-1 bg-white rounded-lg border border-[#E7DCce] shadow-sm self-start md:self-auto">
            <button
              onClick={() => setActiveTab('new')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'new'
                  ? 'bg-[#654329] text-white shadow-sm'
                  : 'text-[#473E37] hover:text-[#654329]'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Sản phẩm mới ({newProducts.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('bestseller')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'bestseller'
                  ? 'bg-[#654329] text-white shadow-sm'
                  : 'text-[#473E37] hover:text-[#654329]'
              }`}
            >
              <Flame className="w-4 h-4 text-[#D97706]" />
              <span>Sản phẩm bán chạy ({bestSellers.length})</span>
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenQuote={onOpenQuote}
            />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/san-pham"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#654329] hover:text-[#432C1B] hover:underline"
          >
            <span>XEM TẤT CẢ SẢN PHẨM TRONG BỘ SƯU TẬP</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';
import { PackageOpen } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  onOpenQuote?: (product: Product) => void;
  emptyMessage?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onOpenQuote,
  emptyMessage = 'Không tìm thấy sản phẩm phù hợp với bộ lọc hiện tại.',
}) => {
  if (products.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-[#E7DCce] p-12 text-center my-6">
        <PackageOpen className="w-12 h-12 text-[#9E978F] mx-auto mb-3 stroke-[1.5]" />
        <h4 className="text-base font-serif font-bold text-[#29231F] mb-1">
          Chưa có sản phẩm
        </h4>
        <p className="text-xs text-[#6E665E] max-w-sm mx-auto">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onOpenQuote={onOpenQuote}
        />
      ))}
    </div>
  );
};

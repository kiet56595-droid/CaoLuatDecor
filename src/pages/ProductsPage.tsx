import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '../components/common/PageHeader';
import { ProductFilter, SortOption } from '../components/products/ProductFilter';
import { ProductGrid } from '../components/products/ProductGrid';
import { PRODUCTS } from '../data/products';
import { CATEGORIES } from '../data/categories';
import { Product } from '../types';

interface ProductsPageProps {
  onOpenQuote: (product: Product) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({ onOpenQuote }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';
  const queryParam = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam);
  const [searchQuery, setSearchQuery] = useState<string>(queryParam);
  const [sortBy, setSortBy] = useState<SortOption>('default');

  // Keep state in sync with URL search params
  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    setSearchQuery(queryParam);
  }, [queryParam]);

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (categoryId === 'all') {
        next.delete('category');
      } else {
        next.set('category', categoryId);
      }
      return next;
    });
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (!query.trim()) {
        next.delete('search');
      } else {
        next.set('search', query.trim());
      }
      return next;
    });
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSortBy('default');
    setSearchParams({});
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // Category match
      const matchCategory =
        selectedCategory === 'all' || product.categoryId === selectedCategory;

      // Search match (name, code, material)
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.code.toLowerCase().includes(q) ||
        product.material.toLowerCase().includes(q) ||
        product.categoryName.toLowerCase().includes(q);

      return matchCategory && matchSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') {
        const priceA = a.price ?? 999999999;
        const priceB = b.price ?? 999999999;
        return priceA - priceB;
      }
      if (sortBy === 'price-desc') {
        const priceA = a.price ?? -1;
        const priceB = b.price ?? -1;
        return priceB - priceA;
      }
      if (sortBy === 'newest') {
        return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      }
      return 0;
    });
  }, [selectedCategory, searchQuery, sortBy]);

  const currentCategoryObj = CATEGORIES.find((c) => c.id === selectedCategory);

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <PageHeader
        title={currentCategoryObj ? currentCategoryObj.name : 'Sản Phẩm Nội Thất'}
        subtitle={
          currentCategoryObj
            ? currentCategoryObj.description
            : 'Khám phá trọn bộ sưu tập nội thất cao cấp: Sofa, bàn trà, bàn ăn, giường ngủ, tủ áo, tủ bếp may đo chuẩn xưởng.'
        }
        breadcrumbs={[
          { label: 'Sản phẩm' },
          ...(currentCategoryObj ? [{ label: currentCategoryObj.name }] : []),
        ]}
        backgroundImage={
          currentCategoryObj
            ? currentCategoryObj.image
            : 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1600&q=80'
        }
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <ProductFilter
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          sortBy={sortBy}
          onSortChange={setSortBy}
          totalCount={filteredProducts.length}
          onResetFilters={handleResetFilters}
        />

        <ProductGrid
          products={filteredProducts}
          onOpenQuote={onOpenQuote}
          emptyMessage={
            searchQuery
              ? `Không tìm thấy sản phẩm nào khớp với từ khóa "${searchQuery}". Vui lòng thử tìm kiếm khác.`
              : 'Hiện chưa có sản phẩm trong danh mục này. Vui lòng chọn danh mục khác.'
          }
        />
      </main>
    </div>
  );
};

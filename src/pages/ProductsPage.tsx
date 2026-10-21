import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ProductFilter, SortOption } from '../components/products/ProductFilter';
import { ProductGrid } from '../components/products/ProductGrid';
import { CategorySidebar } from '../components/products/CategorySidebar';
import { PRODUCTS } from '../data/products';
import { CATEGORIES } from '../data/categories';
import { Product } from '../types';
import { ChevronRight, Home, SlidersHorizontal, RotateCcw } from 'lucide-react';

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
  const isFiltered = selectedCategory !== 'all' || searchQuery.trim() !== '' || sortBy !== 'default';

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* ── Breadcrumb Bar (Decor3mien style) ── */}
      <div className="bg-white border-b border-[#E7DCce] py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1.5 text-xs text-[#6E665E]" aria-label="Breadcrumb">
            <Link to="/" className="flex items-center gap-1 hover:text-[#654329] transition-colors">
              <Home className="w-3.5 h-3.5" />
              <span>TRANG CHỦ</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#C7C3BD]" />
            <Link to="/san-pham" className={`hover:text-[#654329] transition-colors ${selectedCategory === 'all' ? 'font-bold text-[#654329]' : ''}`}>
              SẢN PHẨM
            </Link>
            {currentCategoryObj && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-[#C7C3BD]" />
                <span className="font-bold text-[#654329] uppercase">
                  {currentCategoryObj.name}
                </span>
              </>
            )}
            {searchQuery && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-[#C7C3BD]" />
                <span className="italic text-[#877B70]">Từ khóa: "{searchQuery}"</span>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* ── 2-Column Main Content (Sidebar left + Products right) ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Column: Category Sidebar (3 cols) */}
          <div className="lg:col-span-3">
            <CategorySidebar
              selectedCategory={selectedCategory}
              onSelectCategory={handleSelectCategory}
            />
          </div>

          {/* Right Column: Products & Controls (9 cols) */}
          <div className="lg:col-span-9 space-y-5">
            {/* Category Header Banner (Decor3mien style) */}
            <div className="bg-white rounded-lg border border-[#E7DCce] p-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F7F3ED] pb-3 mb-3">
                <h1 className="text-xl sm:text-2xl font-bold text-[#29231F] uppercase">
                  {currentCategoryObj ? currentCategoryObj.name : 'Tất Cả Sản Phẩm Nội Thất'}
                </h1>

                {/* Sort dropdown & Result Counter */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-xs">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-[#877B70]" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="border border-[#D5C3AF] rounded px-2.5 py-1.5 text-xs bg-[#FAF8F5] text-[#29231F] focus:outline-none focus:border-[#654329] cursor-pointer"
                    >
                      <option value="default">Sắp xếp mặc định</option>
                      <option value="newest">Mới nhất</option>
                      <option value="price-asc">Giá: Thấp đến cao</option>
                      <option value="price-desc">Giá: Cao đến thấp</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Category intro text */}
              <p className="text-xs sm:text-sm text-[#6E665E] leading-relaxed">
                {currentCategoryObj
                  ? currentCategoryObj.description
                  : 'Nội thất may đo chuẩn xưởng Cao Luật Decor: Sofa phòng khách, bàn ăn, giường tủ, tủ bếp và đồ trang trí sản xuất theo yêu cầu.'}
              </p>

              {/* Status bar */}
              <div className="mt-3 pt-3 border-t border-[#F7F3ED] flex items-center justify-between text-xs text-[#877B70]">
                <span>
                  Hiển thị <strong>{filteredProducts.length}</strong> sản phẩm
                  {selectedCategory !== 'all' && currentCategoryObj ? ` trong danh mục ${currentCategoryObj.name}` : ''}
                </span>

                {isFiltered && (
                  <button
                    onClick={handleResetFilters}
                    className="text-[#654329] hover:underline flex items-center gap-1 font-semibold text-xs"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Xem tất cả</span>
                  </button>
                )}
              </div>
            </div>

            {/* Products Grid */}
            <ProductGrid
              products={filteredProducts}
              onOpenQuote={onOpenQuote}
              emptyMessage={
                searchQuery
                  ? `Không tìm thấy sản phẩm nào khớp với từ khóa "${searchQuery}". Vui lòng thử tìm kiếm khác.`
                  : 'Hiện chưa có sản phẩm trong danh mục này. Vui lòng chọn danh mục khác.'
              }
            />
          </div>
        </div>
      </main>
    </div>
  );
};

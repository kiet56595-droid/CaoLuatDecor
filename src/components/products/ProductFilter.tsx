import React from 'react';
import { Search, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { CATEGORIES } from '../../data/categories';

export type SortOption = 'default' | 'price-asc' | 'price-desc' | 'newest';

interface ProductFilterProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  totalCount: number;
  onResetFilters: () => void;
}

export const ProductFilter: React.FC<ProductFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  totalCount,
  onResetFilters,
}) => {
  const isFiltered = selectedCategory !== 'all' || searchQuery.trim() !== '' || sortBy !== 'default';

  return (
    <div className="bg-white rounded-lg border border-[#E7DCce] p-4 sm:p-5 mb-8 shadow-sm">
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Tìm theo tên sản phẩm hoặc mã (vd: CL-SF01)..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#D5C3AF] rounded-md text-xs sm:text-sm focus:outline-none focus:border-[#654329] bg-[#FAF8F5]"
          />
          <Search className="w-4 h-4 text-[#877B70] absolute left-3 top-2.5 sm:top-3" />
        </div>

        {/* Sort & Counter Controls */}
        <div className="flex items-center flex-wrap gap-3 justify-between lg:justify-end">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#877B70]" />
            <span className="text-xs text-[#6E665E] whitespace-nowrap">Sắp xếp:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="border border-[#D5C3AF] rounded-md py-1.5 px-3 text-xs bg-[#FAF8F5] text-[#29231F] focus:outline-none focus:border-[#654329]"
            >
              <option value="default">Mặc định</option>
              <option value="newest">Sản phẩm mới nhất</option>
              <option value="price-asc">Giá: Thấp đến cao</option>
              <option value="price-desc">Giá: Cao đến thấp</option>
            </select>
          </div>

          <div className="text-xs text-[#877B70] border-l border-[#E7DCce] pl-3 flex items-center gap-2">
            <span>Hiển thị <strong>{totalCount}</strong> sản phẩm</span>
            {isFiltered && (
              <button
                onClick={onResetFilters}
                className="text-[#654329] hover:underline flex items-center gap-1 font-semibold ml-2"
                title="Xóa bộ lọc"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Đặt lại</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Chips Bar */}
      <div className="mt-4 pt-4 border-t border-[#F7F3ED]">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
          <button
            onClick={() => onSelectCategory('all')}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-colors font-medium ${
              selectedCategory === 'all'
                ? 'bg-[#654329] text-white shadow-sm'
                : 'bg-[#F7F3ED] text-[#473E37] hover:bg-[#EFE8DC]'
            }`}
          >
            Tất cả ({CATEGORIES.reduce((acc, c) => acc + c.itemCount, 0)})
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-colors font-medium ${
                selectedCategory === cat.id
                  ? 'bg-[#654329] text-white shadow-sm'
                  : 'bg-[#F7F3ED] text-[#473E37] hover:bg-[#EFE8DC]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

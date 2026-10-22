import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ProductGrid } from '../components/products/ProductGrid';
import { PRODUCTS } from '../data/products';
import { CATEGORIES } from '../data/categories';
import { Product } from '../types';
import { ChevronRight, Home, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { fetchProductsFromDB } from '../lib/supabase';

export type SortOption = 'default' | 'price-asc' | 'price-desc' | 'newest';

interface ProductsPageProps {
  onOpenQuote: (product: Product) => void;
}

// Map nhóm phòng sang các danh mục con
const ROOM_MAP: Record<string, string[]> = {
  'phong-khach': ['sofa-phong-khach', 'ban-tra', 'ke-tivi'],
  'phong-an': ['ban-an-ghe-an'],
  'phong-ngu': ['giuong-ngu', 'tu-quan-ao'],
  'tu-bep': ['tu-bep'],
  'noi-that-van-phong': ['noi-that-van-phong'],
};

// Tên hiển thị chuẩn cho từng danh mục / nhóm phòng
const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  'all': 'Tất Cả Sản Phẩm',
  'phong-khach': 'Nội Thất Phòng Khách',
  'sofa-phong-khach': 'Sofa Phòng Khách',
  'ban-tra': 'Bàn Trà',
  'ke-tivi': 'Kệ Tivi',
  'phong-an': 'Nội Thất Phòng Ăn',
  'ban-an-ghe-an': 'Bàn Ăn & Ghế Ăn',
  'phong-ngu': 'Nội Thất Phòng Ngủ',
  'giuong-ngu': 'Giường Ngủ',
  'tu-quan-ao': 'Tủ Quần Áo',
  'tu-bep': 'Hệ Tủ Bếp',
  'noi-that-van-phong': 'Nội Thất Văn Phòng',
};

export const ProductsPage: React.FC<ProductsPageProps> = ({ onOpenQuote }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';
  const queryParam = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam);
  const [searchQuery, setSearchQuery] = useState<string>(queryParam);
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [productsList, setProductsList] = useState<Product[]>(() => {
    try {
      const raw = localStorage.getItem('cld_custom_products');
      const delRaw = localStorage.getItem('cld_deleted_product_ids');
      const delSet = new Set(delRaw ? JSON.parse(delRaw) : []);
      if (raw) {
        const localList: Product[] = JSON.parse(raw);
        const localMap = new Map(localList.map((p) => [p.id, p]));
        let list = PRODUCTS.map((p) => localMap.get(p.id) || p);
        const existingIds = new Set(list.map((p) => p.id));
        for (const cp of localList) {
          if (!existingIds.has(cp.id)) list.unshift(cp);
        }
        if (delSet.size > 0) list = list.filter((p) => !delSet.has(p.id));
        return list;
      }
    } catch {}
    return PRODUCTS;
  });

  useEffect(() => {
    const loadProducts = () => {
      fetchProductsFromDB().then((data) => {
        if (data && data.length > 0) setProductsList(data);
      });
    };

    loadProducts();

    // Lắng nghe sự kiện đồng bộ khi có cập nhật giá hoặc ảnh từ Shop/Admin Dashboard
    window.addEventListener('cld_products_changed', loadProducts);
    return () => window.removeEventListener('cld_products_changed', loadProducts);
  }, []);

  // Keep state in sync with URL search params
  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    setSearchQuery(queryParam);
  }, [queryParam]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSortBy('default');
    setSearchParams({});
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return productsList.filter((product) => {
      // Category match: hỗ trợ cả nhóm phòng lẫn danh mục con
      let matchCategory = selectedCategory === 'all';
      if (!matchCategory) {
        if (product.categoryId === selectedCategory) {
          matchCategory = true;
        } else if (ROOM_MAP[selectedCategory] && ROOM_MAP[selectedCategory].includes(product.categoryId)) {
          matchCategory = true;
        }
      }

      // Search match (name, code, material, categoryName)
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
  }, [productsList, selectedCategory, searchQuery, sortBy]);

  const title = CATEGORY_DISPLAY_NAMES[selectedCategory] ||
    CATEGORIES.find((c) => c.id === selectedCategory)?.name ||
    'Sản Phẩm Nội Thất';

  const isFiltered = selectedCategory !== 'all' || searchQuery.trim() !== '';

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* ── Breadcrumb Bar gọn gàng ── */}
      <div className="bg-white border-b border-[#E7DCce] py-2.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1.5 text-xs text-[#6E665E]" aria-label="Breadcrumb">
            <Link to="/" className="flex items-center gap-1 hover:text-[#654329] transition-colors">
              <Home className="w-3.5 h-3.5" />
              <span>Trang chủ</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#C7C3BD]" />
            <Link
              to="/san-pham"
              className={`hover:text-[#654329] transition-colors ${selectedCategory === 'all' ? 'font-bold text-[#654329]' : ''}`}
            >
              Sản phẩm
            </Link>
            {selectedCategory !== 'all' && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-[#C7C3BD]" />
                <span className="font-bold text-[#654329]">
                  {title}
                </span>
              </>
            )}
            {searchQuery && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-[#C7C3BD]" />
                <span className="italic text-[#877B70]">Tìm kiếm: "{searchQuery}"</span>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* ── Main Content: Toàn bộ chiều rộng cho sản phẩm, không còn sidebar hay banner rườm rà ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Thanh tiêu đề & Bộ sắp xếp tối giản */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E7DCce]">
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold text-[#29231F] uppercase tracking-wide">
              {title}
            </h1>
            <span className="text-xs bg-[#F7F3ED] text-[#654329] font-semibold px-2.5 py-1 rounded-full border border-[#D5C3AF]">
              {filteredProducts.length} sản phẩm
            </span>
          </div>

          <div className="flex items-center gap-3">
            {isFiltered && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-[#654329] hover:underline flex items-center gap-1 font-semibold mr-2"
                title="Xem tất cả sản phẩm"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Xem tất cả</span>
              </button>
            )}

            <div className="flex items-center gap-1.5 text-xs text-[#6E665E]">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#877B70]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="border border-[#D5C3AF] rounded px-2.5 py-1.5 text-xs bg-white text-[#29231F] focus:outline-none focus:border-[#654329] cursor-pointer"
              >
                <option value="default">Sắp xếp mặc định</option>
                <option value="newest">Sản phẩm mới nhất</option>
                <option value="price-asc">Giá: Thấp đến cao</option>
                <option value="price-desc">Giá: Cao đến thấp</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lưới sản phẩm toàn màn hình (Direct Products Grid) */}
        <ProductGrid
          products={filteredProducts}
          onOpenQuote={onOpenQuote}
          emptyMessage={
            searchQuery
              ? `Không tìm thấy sản phẩm nào khớp với từ khóa "${searchQuery}". Vui lòng thử tìm kiếm khác.`
              : 'Hiện chưa có sản phẩm trong danh mục này. Vui lòng chọn danh mục khác trên thanh điều hướng.'
          }
        />
      </main>
    </div>
  );
};

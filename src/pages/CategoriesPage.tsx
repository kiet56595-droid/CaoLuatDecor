import React from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../data/categories';
import { PageHeader } from '../components/common/PageHeader';
import { ArrowRight, Layers } from 'lucide-react';
import { ImageWithFallback } from '../components/common/ImageWithFallback';

export const CategoriesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-20">
      <PageHeader
        title="Danh Mục Sản Phẩm Nội Thất"
        subtitle="Hệ thống 8 danh mục nội thất may đo cao cấp phục vụ đầy đủ các không gian sống: Phòng khách, phòng bếp, phòng ngủ và không gian làm việc."
        breadcrumbs={[{ label: 'Danh mục' }]}
        backgroundImage="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CATEGORIES.map((cat, idx) => (
            <div
              key={cat.id}
              className="bg-white rounded-xl border border-[#E7DCce] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[#FAF8F5]">
                <ImageWithFallback
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute top-3 right-3 bg-[#29231F]/80 backdrop-blur-sm text-[#DFC7A7] text-[11px] font-mono px-2.5 py-1 rounded">
                  0{idx + 1}
                </span>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 text-xs text-[#877B70] mb-2">
                  <Layers className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>{cat.itemCount}+ mẫu thiết kế</span>
                </div>

                <h3 className="font-serif font-bold text-xl text-[#29231F] group-hover:text-[#654329] transition-colors mb-2">
                  <Link to={`/san-pham?category=${cat.id}`}>{cat.name}</Link>
                </h3>

                <p className="text-xs sm:text-sm text-[#6E665E] leading-relaxed mb-6">
                  {cat.description}
                </p>

                <div className="mt-auto pt-4 border-t border-[#F7F3ED]">
                  <Link
                    to={`/san-pham?category=${cat.id}`}
                    className="inline-flex items-center justify-between w-full py-2.5 px-4 rounded-md bg-[#FAF8F5] group-hover:bg-[#654329] text-[#29231F] group-hover:text-white text-xs font-semibold uppercase tracking-wider transition-all"
                  >
                    <span>Khám phá sản phẩm</span>
                    <ArrowRight className="w-4 h-4 text-[#C5A880] group-hover:text-white transition-colors" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

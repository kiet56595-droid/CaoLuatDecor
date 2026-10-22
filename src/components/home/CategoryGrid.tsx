import React from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../../data/categories';
import { ArrowRight } from 'lucide-react';
import { ImageWithFallback } from '../common/ImageWithFallback';

export const CategoryGrid: React.FC = () => {
  return (
    <section className="py-16 bg-[#F7F3ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-wider font-semibold text-[#654329] block mb-1">
            DANH MỤC NỘI THẤT
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#29231F] mb-2">
            Không Gian Sống Đầy Đủ Tiện Nghi
          </h2>
          <p className="text-xs sm:text-sm text-[#6E665E]">
            Đầy đủ nội thất phòng khách, phòng ngủ, phòng ăn và tủ bếp đo đạt chuẩn kích thước.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/san-pham?category=${cat.id}`}
              className="group bg-white rounded-lg border border-[#E7DCce] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-square overflow-hidden bg-[#FAF8F5]">
                <ImageWithFallback
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
              </div>
              <div className="p-3 text-center flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-sm text-[#29231F] group-hover:text-[#654329] transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-[11px] text-[#9E978F] mt-0.5 block">
                    {cat.itemCount}+ mẫu
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View all categories link */}
        <div className="text-center mt-10">
          <Link
            to="/danh-muc"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#654329] hover:text-[#432C1B] hover:underline"
          >
            <span>XEM TẤT CẢ DANH MỤC CHI TIẾT</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

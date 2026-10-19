import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, PhoneCall } from 'lucide-react';
import { getTelHref } from '../../config/contact';

export const HeroBanner: React.FC = () => {
  return (
    <section className="relative min-h-[580px] sm:min-h-[660px] lg:min-h-[720px] flex items-center bg-[#21160D] text-white overflow-hidden">
      {/* Background High-end Living Room Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1920&q=85')`,
        }}
      />

      {/* Luxury Dark Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#21160D]/95 via-[#21160D]/75 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#21160D] via-transparent to-transparent opacity-70" />

      {/* Decorative Gold Accent Lines */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A880]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-2xl space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#654329]/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#C5A880]/30 text-xs text-[#DFC7A7] font-semibold tracking-wide animate-fadeIn">
            <Sparkles className="w-3.5 h-3.5 text-[#DFC7A7]" />
            <span>CAO LUẬT DECOR • KIẾN TẠO KHÔNG GIAN SỐNG ĐẬM CHẤT RIÊNG</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif tracking-tight leading-tight text-white drop-shadow-md">
            KIẾN TẠO <br />
            <span className="text-[#DFC7A7] italic font-normal">KHÔNG GIAN SỐNG</span>
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base lg:text-lg text-[#E5D8C5] font-light leading-relaxed max-w-xl">
            Tự hào là đơn vị thiết kế và sản xuất nội thất may đo chuẩn xưởng. Từng đường nét, chất liệu gỗ, lớp da bọc đều được trau chuốt để tôn vinh gu thẩm mỹ riêng biệt của mỗi gia chủ.
          </p>

          {/* CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Link
              to="/san-pham"
              className="luxury-btn bg-[#654329] hover:bg-[#533722] text-[#FAF8F5] text-sm uppercase tracking-wider font-semibold py-3.5 px-7 rounded-md shadow-lg flex items-center justify-center gap-2 border border-[#C5A880]/30"
            >
              <span>KHÁM PHÁ SẢN PHẨM</span>
              <ArrowRight className="w-4 h-4 text-[#DFC7A7]" />
            </Link>

            <a
              href={getTelHref()}
              className="luxury-btn bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-sm uppercase tracking-wider font-semibold py-3.5 px-7 rounded-md transition-all flex items-center justify-center gap-2 border border-white/20"
            >
              <PhoneCall className="w-4 h-4 text-[#DFC7A7]" />
              <span>TƯ VẤN THIẾT KẾ</span>
            </a>
          </div>

          {/* Key Quick Facts */}
          <div className="pt-8 grid grid-cols-3 gap-4 border-t border-white/10 text-center sm:text-left">
            <div>
              <span className="block font-serif font-bold text-xl sm:text-2xl text-[#DFC7A7]">100%</span>
              <span className="text-[11px] text-[#C7C3BD]">Sản xuất chuẩn xưởng</span>
            </div>
            <div>
              <span className="block font-serif font-bold text-xl sm:text-2xl text-[#DFC7A7]">03-05</span>
              <span className="text-[11px] text-[#C7C3BD]">Năm bảo hành chu đáo</span>
            </div>
            <div>
              <span className="block font-serif font-bold text-xl sm:text-2xl text-[#DFC7A7]">3D</span>
              <span className="text-[11px] text-[#C7C3BD]">Thiết kế cá nhân hóa</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

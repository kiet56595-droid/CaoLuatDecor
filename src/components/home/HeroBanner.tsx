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
          <div className="inline-flex items-center gap-2 bg-[#654329]/80 px-3.5 py-1.5 rounded-full border border-[#C5A880]/30 text-xs text-[#DFC7A7] font-medium tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-[#DFC7A7]" />
            <span>XƯỞNG SẢN XUẤT NỘI THẤT CAO CẤP</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-white">
            Nội Thất May Đo Cao Cấp <br />
            <span className="text-[#DFC7A7]">Kiến Tạo Không Gian Sống</span>
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base text-[#E5D8C5] leading-relaxed max-w-xl">
            Chuyên thiết kế và sản xuất nội thất theo yêu cầu. Chất lượng chuẩn xưởng, vật liệu tuyển chọn và độ bền cao cho mọi công trình.
          </p>

          {/* CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Link
              to="/san-pham"
              className="bg-[#654329] hover:bg-[#533722] text-[#FAF8F5] text-sm font-semibold py-3 px-6 rounded-md shadow-md flex items-center justify-center gap-2 transition-colors"
            >
              <span>Xem Sản Phẩm</span>
              <ArrowRight className="w-4 h-4 text-[#DFC7A7]" />
            </Link>

            <a
              href={getTelHref()}
              className="bg-white/10 hover:bg-white/20 text-white text-sm font-semibold py-3 px-6 rounded-md transition-colors flex items-center justify-center gap-2 border border-white/20"
            >
              <PhoneCall className="w-4 h-4 text-[#DFC7A7]" />
              <span>Tư Vấn Báo Giá</span>
            </a>
          </div>

          {/* Key Quick Facts */}
          <div className="pt-6 grid grid-cols-3 gap-4 border-t border-white/10 text-center sm:text-left">
            <div>
              <span className="block font-bold text-2xl text-[#DFC7A7]">100%</span>
              <span className="text-xs text-[#C7C3BD]">Trực tiếp tại xưởng</span>
            </div>
            <div>
              <span className="block font-bold text-2xl text-[#DFC7A7]">3 - 5 Năm</span>
              <span className="text-xs text-[#C7C3BD]">Bảo hành uy tín</span>
            </div>
            <div>
              <span className="block font-bold text-2xl text-[#DFC7A7]">3D</span>
              <span className="text-xs text-[#C7C3BD]">Miễn phí phối cảnh</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

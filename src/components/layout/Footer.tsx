import React from 'react';
import { Phone, Mail, MapPin, ChevronUp, ExternalLink, Facebook } from 'lucide-react';
import {
  CONTACT_INFO,
  getTelHref,
  getMailtoHref,
  getFacebookHref,
  getMapsHref,
} from '../../config/contact';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#F8F9FA] text-[#333333] border-t border-[#E5E7EB] text-xs">
      {/* ── Main 4-Column Section ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {/* CỘT 1: THÔNG TIN LIÊN HỆ */}
          <div className="space-y-3">
            <h3 className="font-bold text-[#1A1A1A] text-sm uppercase tracking-wide border-b-2 border-[#1A1A1A] pb-1.5 inline-block">
              THÔNG TIN LIÊN HỆ
            </h3>

            <div className="space-y-2 pt-2 text-[#4A4A4A] leading-relaxed">
              <p className="font-bold text-[#1A1A1A] text-[13px]">
                Công ty TNHH Nội Thất Cao Luật
              </p>
              <p>
                <span className="font-semibold text-[#1A1A1A]">MST:</span> 0316838133 do Sở KH &amp; ĐT TP.HCM cấp ngày 04 tháng 05 năm 2021.
              </p>
              <p>
                <span className="font-semibold text-[#1A1A1A]">Hotline:</span>{' '}
                <a href={getTelHref()} className="font-bold text-[#C25E00] hover:underline">
                  {CONTACT_INFO.hotline.display}
                </a>
                {' – '}
                <a href="tel:0935656000" className="font-bold text-[#C25E00] hover:underline">
                  0935 656 000
                </a>
              </p>
              <p>
                <span className="font-semibold text-[#1A1A1A]">Email:</span>{' '}
                <a href={getMailtoHref()} className="hover:text-[#C25E00] hover:underline">
                  {CONTACT_INFO.email.display}
                </a>
              </p>
              <p>
                <span className="font-semibold text-[#1A1A1A]">Showroom:</span> {CONTACT_INFO.showroom.fullAddress}
              </p>
              <p>
                <span className="font-semibold text-[#1A1A1A]">Xưởng sx:</span> 1367/3 Đường An Phú Đông 25, KP3, P. An Phú Đông, Q.12, TP.HCM
              </p>
            </div>
          </div>

          {/* CỘT 2: HỖ TRỢ KHÁCH HÀNG */}
          <div className="space-y-3">
            <h3 className="font-bold text-[#1A1A1A] text-sm uppercase tracking-wide border-b-2 border-[#1A1A1A] pb-1.5 inline-block">
              HỖ TRỢ KHÁCH HÀNG
            </h3>

            <ul className="space-y-2 pt-2 text-[#4A4A4A]">
              <li>
                <a href="#quy-trinh" className="hover:text-[#C25E00] transition-colors block">
                  Quy trình làm việc
                </a>
              </li>
              <li>
                <a href="#bao-hanh" className="hover:text-[#C25E00] transition-colors block">
                  Bảo hành – Đổi trả
                </a>
              </li>
              <li>
                <a href="#thanh-toan" className="hover:text-[#C25E00] transition-colors block">
                  Hình thức thanh toán
                </a>
              </li>
              <li>
                <a href="#van-chuyen" className="hover:text-[#C25E00] transition-colors block">
                  Vận chuyển – Giao nhận hàng
                </a>
              </li>
              <li>
                <a href="#bao-mat" className="hover:text-[#C25E00] transition-colors block">
                  Chính sách bảo mật thông tin
                </a>
              </li>
            </ul>

            {/* Badges: Bộ Công Thương & DMCA */}
            <div className="pt-3 space-y-2.5">
              {/* Badge Đã thông báo bộ công thương */}
              <div className="inline-flex items-center gap-2 bg-[#005BAA] text-white px-3 py-1.5 rounded-full shadow-sm border border-[#004885] cursor-pointer hover:opacity-95 transition-opacity">
                <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5 text-[#005BAA]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="leading-tight text-left">
                  <div className="text-[10px] font-black tracking-wider uppercase">ĐÃ THÔNG BÁO</div>
                  <div className="text-[8px] font-semibold opacity-90">BỘ CÔNG THƯƠNG</div>
                </div>
              </div>

              {/* Badge DMCA PROTECTED */}
              <div>
                <div className="inline-flex items-center border border-[#48A04C] rounded overflow-hidden shadow-sm bg-white cursor-pointer hover:opacity-95">
                  <div className="bg-[#48A04C] text-white px-2 py-0.5 text-[10px] font-bold flex items-center gap-1">
                    <span>🔒</span> DMCA
                  </div>
                  <div className="px-2 py-0.5 text-[9px] font-bold text-[#48A04C] uppercase tracking-wider bg-white">
                    PROTECTED
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CỘT 3: FANPAGE */}
          <div className="space-y-3">
            <h3 className="font-bold text-[#1A1A1A] text-sm uppercase tracking-wide border-b-2 border-[#1A1A1A] pb-1.5 inline-block">
              FANPAGE
            </h3>

            {/* Fanpage Card Container (Facebook widget simulation) */}
            <div className="border border-[#DADDE1] rounded-lg overflow-hidden bg-white shadow-sm hover:shadow transition-shadow">
              {/* Cover Banner */}
              <div className="relative h-28 bg-[#29231F] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&auto=format&fit=crop&q=80"
                  alt="Fanpage Cao Luật Decor"
                  className="w-full h-full object-cover opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#1877F2] text-white flex items-center justify-center shadow">
                  <Facebook className="w-3.5 h-3.5 fill-current" />
                </div>
                <div className="absolute bottom-2 left-2 text-white text-[11px] font-bold drop-shadow">
                  NỘI THẤT CAO CẤP CAO LUẬT
                </div>
              </div>

              {/* Profile Bar */}
              <div className="p-3 space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-[#654329] text-[#DFC7A7] border-2 border-white flex items-center justify-center font-bold text-sm shadow -mt-6">
                    CL
                  </div>
                  <div>
                    <h4 className="font-bold text-[13px] text-[#1C1E21] leading-tight hover:underline cursor-pointer">
                      Cao Luật Decor
                    </h4>
                    <span className="text-[11px] text-[#65676B]">
                      3,9K người theo dõi
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-[#4B4C4F] line-clamp-2 leading-snug">
                  Chuyên thiết kế - thi công nội thất trọn gói, giá xưởng. Cung cấp sofa, bàn ghế ăn cao cấp...
                </p>

                <div className="text-[11px] text-[#65676B] flex items-center gap-1">
                  <span>💼 Dịch vụ trang trí nội thất</span>
                  <span>•</span>
                  <span>📞 0909 123 456</span>
                </div>

                <a
                  href={getFacebookHref()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white py-1.5 px-3 rounded flex items-center justify-center gap-1.5 font-semibold text-xs transition-colors shadow-sm"
                >
                  <Facebook className="w-3.5 h-3.5 fill-current" />
                  <span>Theo dõi</span>
                </a>
              </div>
            </div>
          </div>

          {/* CỘT 4: CHỈ ĐƯỜNG */}
          <div className="space-y-3 lg:border-l lg:border-[#E5E7EB] lg:pl-6">
            <h3 className="font-bold text-[#1A1A1A] text-sm uppercase tracking-wide border-b-2 border-[#1A1A1A] pb-1.5 inline-block">
              CHỈ ĐƯỜNG
            </h3>

            {/* Embedded Google Maps Container */}
            <div className="relative border border-[#DADDE1] rounded-lg overflow-hidden bg-white shadow-sm h-64">
              <iframe
                title="Bản đồ chỉ đường Cao Luật Decor"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.805847424905!2d106.721447!3d10.749557!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752579df64faef%3A0xc3fa609072c4ce0a!2zMTI2IE5ndXnhu4VuIFRo4buLIFRo4bqtcCwgVMOibiBQaMO6LCBRdeG6rW4gNywgSOG7kyBDaMOtIE1pbmg!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />

              {/* Overlay button 'Mở trong Maps' */}
              <a
                href={getMapsHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-2 left-2 bg-white/95 hover:bg-white text-[#1A1A1A] text-[11px] font-semibold px-2.5 py-1 rounded shadow border border-[#DADDE1] flex items-center gap-1 transition-colors"
              >
                <span>Mở trong Maps</span>
                <ExternalLink className="w-3 h-3 text-[#1877F2]" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar (Copyright & Visitor Stats & Scroll Top) ── */}
      <div className="bg-[#4E4E4E] text-[#D1D5DB] py-3 border-t border-[#3D3D3D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs">
          <div>
            Copyright 2026 &copy; <span className="font-bold text-white tracking-wide">CAOLUATDECOR</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-[11px] text-[#D1D5DB] hidden sm:block">
              Online: <span className="font-bold text-white">1</span> | Total: <span className="font-bold text-white">285178</span>
            </div>

            <button
              onClick={scrollToTop}
              className="w-7 h-7 rounded-full bg-[#383838] hover:bg-[#222222] text-white flex items-center justify-center transition-colors shadow"
              title="Cuộn lên đầu trang"
              aria-label="Cuộn lên đầu trang"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};


import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, ShieldCheck, ChevronRight, MessageSquare, Facebook } from 'lucide-react';
import {
  CONTACT_INFO,
  getTelHref,
  getMailtoHref,
  getZaloHref,
  getFacebookHref,
  getMapsHref,
} from '../../config/contact';
import { CATEGORIES } from '../../data/categories';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#21160D] text-[#E5D8C5] pt-16 pb-10 border-t border-[#3A322C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          {/* Col 1: Brand Info & Values */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#654329] border border-[#C5A880]/30 flex items-center justify-center text-[#DFC7A7] font-bold text-lg">
                CL
              </div>
              <span className="font-bold text-lg text-white tracking-wide">
                CAO LUẬT DECOR
              </span>
            </div>
            <p className="text-xs text-[#DFC7A7] font-medium">
              "{CONTACT_INFO.slogan}"
            </p>
            <p className="text-xs text-[#9E978F] leading-relaxed">
              {CONTACT_INFO.description}
            </p>

            {/* Social channels */}
            <div className="pt-2 flex items-center gap-3">
              <a
                href={getFacebookHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#29231F] hover:bg-[#1877F2] text-white flex items-center justify-center transition-colors border border-[#3A322C]"
                title="Fanpage Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={getZaloHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#29231F] hover:bg-[#0068FF] text-white flex items-center justify-center font-bold text-xs transition-colors border border-[#3A322C]"
                title="Tư vấn Zalo"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
              <a
                href={getMapsHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#29231F] hover:bg-[#EA4335] text-white flex items-center justify-center transition-colors border border-[#3A322C]"
                title="Chỉ đường Google Maps"
              >
                <MapPin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-white text-base tracking-wide border-b border-[#3A322C] pb-2 inline-block">
              Về Chúng Tôi
            </h3>
            <ul className="space-y-2.5 text-xs text-[#9E978F]">
              <li>
                <Link to="/gioi-thieu" className="hover:text-[#DFC7A7] transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>Giới thiệu thương hiệu</span>
                </Link>
              </li>
              <li>
                <Link to="/san-pham" className="hover:text-[#DFC7A7] transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>Tất cả sản phẩm</span>
                </Link>
              </li>
              <li>
                <Link to="/danh-muc" className="hover:text-[#DFC7A7] transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>Danh mục không gian sống</span>
                </Link>
              </li>
              <li className="pt-2">
                <div className="bg-[#29231F] p-3 rounded border border-[#3A322C] text-[#C7C3BD] flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                  <span>Cam kết chất lượng chuẩn xưởng, bảo hành minh bạch 3 - 5 năm.</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Col 3: Categories */}
          <div className="space-y-4">
            <h3 className="font-bold text-white text-base tracking-wide border-b border-[#3A322C] pb-2 inline-block">
              Danh Mục Sản Phẩm
            </h3>
            <ul className="grid grid-cols-1 gap-2 text-xs text-[#9E978F]">
              {CATEGORIES.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/san-pham?category=${cat.id}`}
                    className="hover:text-[#DFC7A7] transition-colors flex items-center gap-1.5"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>{cat.name}</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/danh-muc"
                  className="text-[#DFC7A7] font-semibold hover:underline inline-flex items-center gap-1 mt-1"
                >
                  <span>Xem tất cả danh mục...</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Showroom */}
          <div className="space-y-4">
            <h3 className="font-bold text-white text-base tracking-wide border-b border-[#3A322C] pb-2 inline-block">
              Thông Tin Liên Hệ
            </h3>
            <div className="space-y-3 text-xs text-[#C7C3BD]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Showroom:</span>
                  <span>{CONTACT_INFO.showroom.fullAddress}</span>
                  <a
                    href={getMapsHref()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#DFC7A7] block hover:underline text-[11px] mt-0.5"
                  >
                    (Xem bản đồ đường đi &rarr;)
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Hotline tư vấn:</span>
                  <a href={getTelHref()} className="text-[#DFC7A7] font-bold hover:underline">
                    {CONTACT_INFO.hotline.display}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Email:</span>
                  <a href={getMailtoHref()} className="hover:text-white hover:underline">
                    {CONTACT_INFO.email.display}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Giờ mở cửa:</span>
                  <span>{CONTACT_INFO.workingHours.weekdays}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Demo Notice */}
        <div className="pt-8 border-t border-[#3A322C] flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-[#877B70]">
          <div>
            &copy; {CONTACT_INFO.copyrightYear} <span className="text-[#E5D8C5]">{CONTACT_INFO.brandName}</span>. Tất cả các quyền được bảo lưu.
          </div>
          <div className="text-center md:text-right text-[11px] text-[#9E978F]">
            Website trưng bày mẫu &amp; tư vấn báo giá trực tiếp — Thiết kế lấy cảm hứng từ phong cách hiện đại tối giản.
          </div>
        </div>
      </div>
    </footer>
  );
};

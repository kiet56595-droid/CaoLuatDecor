import React from 'react';
import { PhoneCall, MessageSquare } from 'lucide-react';
import { CONTACT_INFO, getTelHref, getZaloHref } from '../../config/contact';

interface CtaBannerProps {
  onOpenQuote?: () => void;
}

export const CtaBanner: React.FC<CtaBannerProps> = ({ onOpenQuote }) => {
  return (
    <section className="relative py-16 sm:py-20 bg-[#29231F] text-white overflow-hidden">
      {/* Background with warm ambient lighting */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20 scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#21160D]/95 via-[#29231F]/90 to-[#21160D]/95" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#DFC7A7] block">
          TƯ VẤN &amp; KHẢO SÁT MIỄN PHÍ TẬN NƠI
        </span>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-white tracking-tight">
          Bạn Đang Tìm Kiếm Giải Pháp Nội Thất?
        </h2>

        <p className="text-sm sm:text-base text-[#E5D8C5] max-w-2xl mx-auto font-light leading-relaxed">
          Đội ngũ kiến trúc sư và thợ lành nghề của <strong>Cao Luật Decor</strong> luôn sẵn sàng lắng nghe, khảo sát mặt bằng và đưa ra phương án thiết kế may đo phù hợp nhất với ngân sách của bạn.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={getTelHref()}
            className="w-full sm:w-auto luxury-btn bg-[#654329] hover:bg-[#533722] text-[#FAF8F5] text-xs sm:text-sm uppercase tracking-wider font-semibold py-3.5 px-8 rounded-md shadow-lg border border-[#C5A880]/30 flex items-center justify-center gap-2.5"
          >
            <PhoneCall className="w-4 h-4 text-[#DFC7A7]" />
            <span>Gọi Hotline: {CONTACT_INFO.hotline.display}</span>
          </a>

          <a
            href={getZaloHref()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto luxury-btn bg-[#0068FF] hover:bg-[#0052cc] text-white text-xs sm:text-sm uppercase tracking-wider font-semibold py-3.5 px-8 rounded-md shadow-lg flex items-center justify-center gap-2.5"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Nhắn Tin Zalo Tư Vấn</span>
          </a>

          {onOpenQuote && (
            <button
              onClick={onOpenQuote}
              className="w-full sm:w-auto luxury-btn bg-white/10 hover:bg-white/20 backdrop-blur-md text-[#DFC7A7] border border-[#DFC7A7]/40 text-xs sm:text-sm uppercase tracking-wider font-semibold py-3.5 px-8 rounded-md flex items-center justify-center gap-2"
            >
              <span>Để Lại Số Điện Thoại</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

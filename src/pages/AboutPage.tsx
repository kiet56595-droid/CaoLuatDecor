import React from 'react';
import { PageHeader } from '../components/common/PageHeader';
import {
  Compass,
  Palette,
  Hammer,
  ShieldCheck,
  CheckCircle2,
  PhoneCall,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { CONTACT_INFO, getTelHref, getZaloHref, getMapsHref } from '../config/contact';
import { ImageWithFallback } from '../components/common/ImageWithFallback';

export const AboutPage: React.FC = () => {
  const services = [
    {
      icon: Compass,
      title: 'Tư Vấn & Khảo Sát Tận Nơi',
      desc: 'Lắng nghe nhu cầu thực tế của từng thành viên trong gia đình, khảo sát hiện trạng công trình để đưa ra phương án mặt bằng tối ưu nhất.',
    },
    {
      icon: Palette,
      title: 'Thiết Kế Phối Cảnh 3D May Đo',
      desc: 'Bản vẽ trực quan thể hiện rõ nét ánh sáng, tỷ lệ và màu sắc vật liệu, đảm bảo không gian hoàn thiện giống 95% so với thiết kế.',
    },
    {
      icon: Hammer,
      title: 'Sản Xuất Trực Tiếp Tại Xưởng',
      desc: 'Chủ động quy trình cắt gọt, dán cạnh không đường line (noline), bọc da và kiểm thử cơ cấu đóng mở trước khi xuất xưởng.',
    },
    {
      icon: ShieldCheck,
      title: 'Thi Công Lắp Đặt & Bảo Trì',
      desc: 'Đội ngũ thợ may đo lắp ráp chuyên nghiệp, đảm bảo sàn nhà và vách tường luôn được che chắn cẩn thận trong suốt quá trình thi công.',
    },
  ];

  const materialStandards = [
    {
      title: 'Cốt Gỗ Tiêu Chuẩn Cao',
      desc: 'Sử dụng cốt gỗ MDF, HDF lõi xanh chống ẩm An Cường hoặc gỗ sồi, gỗ óc chó tự nhiên tẩm sấy kỹ lưỡng.',
    },
    {
      title: 'Bề Mặt Phủ Tinh Tế',
      desc: 'Melamine chống trầy, Acrylic bóng gương không đường line, sơn phủ PU 5 lớp cao cấp bền màu theo năm tháng.',
    },
    {
      title: 'Phụ Kiện Vận Hành Êm Ái',
      desc: 'Bản lề giảm chấn, ray trượt thông minh từ các thương hiệu uy tín như Hafele, Blum, Eurogold.',
    },
    {
      title: 'Da & Vải Bọc Tuyển Chọn',
      desc: 'Da bò thật nhập khẩu, da Microfiber mềm mịn chống bong tróc và vải nỉ dệt kháng khuẩn cao cấp.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-20">
      <PageHeader
        title="Về Cao Luật Decor Nội Thất"
        subtitle="Hành trình kiến tạo những không gian sống đậm chất riêng với triết lý tối giản, sang trọng và chuẩn mực sản xuất thủ công."
        breadcrumbs={[{ label: 'Giới thiệu' }]}
        backgroundImage="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {/* Brand Mission Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#654329]">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>ĐỊNH HƯỚNG THIẾT KẾ</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#29231F] leading-tight">
              Kiến Tạo Không Gian Sống <br />
              <span className="text-[#654329] italic font-normal">Đậm Chất Riêng Từng Gia Chủ</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#6E665E] leading-relaxed">
              Mỗi ngôi nhà là một câu chuyện riêng của gia chủ. Tại <strong>Cao Luật Decor Nội Thất</strong>, chúng tôi không áp đặt những khuôn mẫu có sẵn, mà đồng hành cùng bạn từ khâu lên ý tưởng sơ khai cho đến khi từng chiếc ghế sofa, chiếc bàn ăn hay tủ bếp được đặt vào đúng vị trí hoàn hảo nhất.
            </p>
            <p className="text-xs sm:text-sm text-[#6E665E] leading-relaxed">
              Phong cách chủ đạo mà chúng tôi theo đuổi là sự kết hợp giữa <em>Modern Luxury</em> và <em>Scandinavian/Minimalism</em>: Đề cao tính ứng dụng cao, sự thông thoáng của ánh sáng tự nhiên và vẻ ấm cúng mộc mạc của vật liệu gỗ, da, đá cao cấp.
            </p>

            <div className="pt-2 flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>May đo theo kích thước</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Không qua trung gian</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden border border-[#E7DCce] shadow-xl aspect-[4/3]">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80"
                alt="Không gian thiết kế Cao Luật Decor"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* 4 Core Services */}
        <section className="bg-white p-8 sm:p-12 rounded-2xl border border-[#E7DCce] shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#654329] block mb-2">
              DỊCH VỤ TRỌN GÓI
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#29231F]">
              Quy Trình Dịch Vụ Tại Cao Luật Decor
            </h2>
            <p className="text-xs sm:text-sm text-[#6E665E] mt-2">
              Chúng tôi cung cấp giải pháp trọn vẹn từ bản vẽ thiết kế đến sản xuất và thi công hoàn thiện.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="space-y-3">
                  <div className="w-12 h-12 rounded-lg bg-[#FAF8F5] text-[#654329] border border-[#E7DCce] flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif font-bold text-base text-[#29231F]">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#6E665E] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Material Standards */}
        <section>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#654329] block mb-2">
              CAM KẾT CHẤT LƯỢNG
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#29231F]">
              Tiêu Chuẩn Vật Liệu Tuyển Chọn
            </h2>
            <p className="text-xs sm:text-sm text-[#6E665E] mt-2">
              Chỉ sử dụng vật tư đạt chứng nhận an toàn, thân thiện với sức khỏe và độ bền ổn định theo khí hậu nhiệt đới Việt Nam.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {materialStandards.map((mat, idx) => (
              <div
                key={idx}
                className="bg-[#FAF8F5] p-6 rounded-xl border border-[#E7DCce] hover:border-[#654329] transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-[#654329] text-white flex items-center justify-center font-serif text-xs font-bold mb-4">
                  0{idx + 1}
                </div>
                <h3 className="font-serif font-bold text-base text-[#29231F] mb-2">
                  {mat.title}
                </h3>
                <p className="text-xs text-[#6E665E] leading-relaxed">
                  {mat.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Showroom & Contact CTA */}
        <section className="bg-[#29231F] text-white p-8 sm:p-12 rounded-2xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center lg:text-left">
              <span className="text-xs uppercase tracking-wider text-[#DFC7A7] font-semibold">
                TRẢI NGHIỆM THỰC TẾ
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white">
                Ghé Thăm Showroom Cao Luật Decor
              </h2>
              <p className="text-xs sm:text-sm text-[#E5D8C5] max-w-xl">
                Tận mắt cảm nhận chất liệu da, thớ gỗ tự nhiên và độ mượt mà của hệ ray giảm chấn tại không gian trưng bày của chúng tôi.
              </p>
              <div className="text-xs text-[#C7C3BD] flex items-center justify-center lg:justify-start gap-2 pt-2">
                <MapPin className="w-4 h-4 text-[#C5A880]" />
                <span>{CONTACT_INFO.showroom.fullAddress}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <a
                href={getTelHref()}
                className="luxury-btn bg-[#654329] hover:bg-[#533722] text-[#FAF8F5] py-3 px-6 rounded-md text-xs font-semibold uppercase tracking-wider flex items-center gap-2"
              >
                <PhoneCall className="w-4 h-4 text-[#DFC7A7]" />
                <span>Hotline: {CONTACT_INFO.hotline.display}</span>
              </a>
              <a
                href={getMapsHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="luxury-btn bg-white/10 hover:bg-white/20 text-white border border-white/20 py-3 px-6 rounded-md text-xs font-semibold uppercase tracking-wider"
              >
                Chỉ Đường Showroom
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

import React, { useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import {
  Phone,
  MessageSquare,
  Facebook,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import {
  CONTACT_INFO,
  getTelHref,
  getMailtoHref,
  getZaloHref,
  getFacebookHref,
  getMapsHref,
} from '../config/contact';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    interest: 'Nội thất phòng khách',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.phone.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-20">
      <PageHeader
        title="Liên Hệ &amp; Tư Vấn Báo Giá"
        subtitle="Đội ngũ Cao Luật Decor luôn sẵn sàng lắng nghe mọi ý tưởng và hỗ trợ giải pháp nội thất tối ưu nhất cho gia đình bạn."
        breadcrumbs={[{ label: 'Liên hệ' }]}
        backgroundImage="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Placeholder Warning Note if not configured */}
        {(!CONTACT_INFO.hotline.isConfigured || !CONTACT_INFO.showroom.isConfigured) && (
          <div className="bg-[#FAF8F5] border-l-4 border-[#C5A880] p-4 sm:p-5 rounded-r-lg shadow-sm">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#654329] shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-[#473E37]">
                <strong className="text-[#29231F] block font-semibold mb-1">
                  Ghi chú cấu hình thông tin liên hệ:
                </strong>
                Một số thông tin bên dưới (Số điện thoại, địa chỉ Showroom, liên kết Zalo, Facebook) hiện đang ở chế độ hiển thị mẫu demo.
                Quý khách hoặc Quản trị viên website có thể cập nhật thông tin chính xác tại file duy nhất: <code className="bg-white px-2 py-0.5 rounded border border-[#D5C3AF] font-mono text-[#654329]">src/config/contact.ts</code>.
              </div>
            </div>
          </div>
        )}

        {/* 4 Direct Contact Channel Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 1. Phone / Hotline */}
          <a
            href={getTelHref()}
            className="group bg-white p-6 rounded-xl border border-[#E7DCce] hover:border-[#654329] shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-lg bg-[#FAF8F5] group-hover:bg-[#654329] text-[#654329] group-hover:text-white transition-colors flex items-center justify-center mb-4">
                <Phone className="w-6 h-6" />
              </div>
              <span className="text-[11px] uppercase tracking-wider text-[#877B70] font-semibold block">
                ĐIỆN THOẠI / HOTLINE
              </span>
              <h3 className="font-serif font-bold text-base sm:text-lg text-[#29231F] mt-1 group-hover:text-[#654329] transition-colors">
                {CONTACT_INFO.hotline.display}
              </h3>
              <p className="text-xs text-[#6E665E] mt-2">
                Hỗ trợ tư vấn kỹ thuật và báo giá sơ bộ trực tiếp 24/7.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#F7F3ED] text-xs font-semibold text-[#654329] flex items-center gap-1">
              <span>Bấm gọi ngay</span>
              <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
            </div>
          </a>

          {/* 2. Zalo */}
          <a
            href={getZaloHref()}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white p-6 rounded-xl border border-[#E7DCce] hover:border-[#0068FF] shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-lg bg-[#0068FF]/10 group-hover:bg-[#0068FF] text-[#0068FF] group-hover:text-white transition-colors flex items-center justify-center mb-4 font-bold text-lg">
                Z
              </div>
              <span className="text-[11px] uppercase tracking-wider text-[#877B70] font-semibold block">
                ZALO CHÍNH THỨC
              </span>
              <h3 className="font-serif font-bold text-base sm:text-lg text-[#29231F] mt-1 group-hover:text-[#0068FF] transition-colors">
                {CONTACT_INFO.zalo.display}
              </h3>
              <p className="text-xs text-[#6E665E] mt-2">
                Gửi kích thước mặt bằng hoặc mẫu yêu cầu để nhận báo giá nhanh.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#F7F3ED] text-xs font-semibold text-[#0068FF] flex items-center gap-1">
              <span>Mở ứng dụng Zalo</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </div>
          </a>

          {/* 3. Facebook Fanpage */}
          <a
            href={getFacebookHref()}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white p-6 rounded-xl border border-[#E7DCce] hover:border-[#1877F2] shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-lg bg-[#1877F2]/10 group-hover:bg-[#1877F2] text-[#1877F2] group-hover:text-white transition-colors flex items-center justify-center mb-4">
                <Facebook className="w-6 h-6" />
              </div>
              <span className="text-[11px] uppercase tracking-wider text-[#877B70] font-semibold block">
                FACEBOOK FANPAGE
              </span>
              <h3 className="font-serif font-bold text-base sm:text-lg text-[#29231F] mt-1 group-hover:text-[#1877F2] transition-colors">
                {CONTACT_INFO.facebook.name}
              </h3>
              <p className="text-xs text-[#6E665E] mt-2">
                Cập nhật các dự án hoàn thiện mới nhất và video thực tế tại xưởng.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#F7F3ED] text-xs font-semibold text-[#1877F2] flex items-center gap-1">
              <span>Ghé thăm trang Facebook</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </div>
          </a>

          {/* 4. Email */}
          <a
            href={getMailtoHref()}
            className="group bg-white p-6 rounded-xl border border-[#E7DCce] hover:border-[#654329] shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-lg bg-[#FAF8F5] group-hover:bg-[#654329] text-[#654329] group-hover:text-white transition-colors flex items-center justify-center mb-4">
                <Mail className="w-6 h-6" />
              </div>
              <span className="text-[11px] uppercase tracking-wider text-[#877B70] font-semibold block">
                HỘP THƯ ĐIỆN TỬ
              </span>
              <h3 className="font-serif font-bold text-sm sm:text-base text-[#29231F] mt-1 group-hover:text-[#654329] transition-colors truncate">
                {CONTACT_INFO.email.display}
              </h3>
              <p className="text-xs text-[#6E665E] mt-2">
                Dành cho gửi bản vẽ thiết kế CAD/PDF hoặc yêu cầu hợp tác dự án.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#F7F3ED] text-xs font-semibold text-[#654329] flex items-center gap-1">
              <span>Gửi thư điện tử</span>
              <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
            </div>
          </a>
        </div>

        {/* Main Grid: Form & Showroom Maps */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Form Column (6 cols) */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-[#E7DCce] shadow-sm">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#29231F] mb-2">
              Gửi Yêu Cầu Tư Vấn &amp; Dự Toán
            </h2>
            <p className="text-xs sm:text-sm text-[#6E665E] mb-6">
              Điền thông tin của bạn vào mẫu dưới đây, chuyên viên tư vấn sẽ liên hệ lại trong vòng 30 phút.
            </p>

            {submitted ? (
              <div className="bg-[#FAF8F5] border border-emerald-300 rounded-xl p-8 text-center space-y-3">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-serif font-bold text-[#29231F]">
                  Gửi yêu cầu thành công!
                </h3>
                <p className="text-xs text-[#6E665E] max-w-sm mx-auto">
                  Cảm ơn <strong>{formData.name || 'Quý khách'}</strong>. Chúng tôi đã nhận được thông tin và sẽ gọi lại cho số <strong>{formData.phone}</strong> sớm nhất.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        phone: '',
                        email: '',
                        interest: 'Nội thất phòng khách',
                        message: '',
                      });
                    }}
                    className="text-xs font-semibold text-[#654329] underline hover:text-[#432C1B]"
                  >
                    Gửi yêu cầu khác
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#473E37] mb-1.5">
                    Họ và tên của Quý khách <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nguyễn Văn A"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-[#D5C3AF] rounded-md text-xs sm:text-sm focus:outline-none focus:border-[#654329] bg-[#FAF8F5]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#473E37] mb-1.5">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="0901 234 567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-[#D5C3AF] rounded-md text-xs sm:text-sm focus:outline-none focus:border-[#654329] bg-[#FAF8F5]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#473E37] mb-1.5">
                      Hộp thư Email
                    </label>
                    <input
                      type="email"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-[#D5C3AF] rounded-md text-xs sm:text-sm focus:outline-none focus:border-[#654329] bg-[#FAF8F5]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#473E37] mb-1.5">
                    Hạng mục Quý khách quan tâm
                  </label>
                  <select
                    value={formData.interest}
                    onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-[#D5C3AF] rounded-md text-xs sm:text-sm focus:outline-none focus:border-[#654329] bg-[#FAF8F5] text-[#29231F]"
                  >
                    <option value="Nội thất phòng khách">Nội thất phòng khách (Sofa, bàn trà, kệ tivi)</option>
                    <option value="Hệ tủ bếp hiện đại">Hệ tủ bếp hiện đại (Acrylic, MDF chống ẩm)</option>
                    <option value="Nội thất phòng ngủ">Nội thất phòng ngủ (Giường ngủ, tủ quần áo cánh kính)</option>
                    <option value="Bàn ghế ăn gia đình">Bàn ăn &amp; Ghế ăn gia đình</option>
                    <option value="Thi công trọn gói căn hộ/nhà phố">Thi công trọn gói Căn hộ / Nhà phố / Biệt thự</option>
                    <option value="Khác">Hạng mục may đo khác</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#473E37] mb-1.5">
                    Nội dung ghi chú / Diện tích công trình
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Mô tả sơ lược về căn hộ, kích thước hoặc yêu cầu vật liệu đặc biệt..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-[#D5C3AF] rounded-md text-xs sm:text-sm focus:outline-none focus:border-[#654329] bg-[#FAF8F5]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full luxury-btn bg-[#654329] hover:bg-[#533722] text-white py-3.5 rounded-md font-semibold text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <Send className="w-4 h-4 text-[#DFC7A7]" />
                  <span>GỬI YÊU CẦU TƯ VẤN NGAY</span>
                </button>
              </form>
            )}
          </div>

          {/* Showroom & Map Column (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E7DCce] shadow-sm space-y-5">
              <h2 className="text-xl font-serif font-bold text-[#29231F]">
                Hệ Thống Trưng Bày &amp; Nhà Xưởng
              </h2>

              <div className="space-y-4 text-xs sm:text-sm text-[#473E37]">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#654329] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#29231F] block">Showroom trưng bày:</strong>
                    <span>{CONTACT_INFO.showroom.fullAddress}</span>
                    <a
                      href={getMapsHref()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#654329] hover:underline font-semibold block mt-1 flex items-center gap-1"
                    >
                      <span>Xem đường đi trên Google Maps</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#654329] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#29231F] block">Thời gian mở cửa:</strong>
                    <span>{CONTACT_INFO.workingHours.weekdays}</span>
                    <span className="block text-[#877B70]">{CONTACT_INFO.workingHours.sunday}</span>
                  </div>
                </div>
              </div>

              {/* Interactive Map Embed */}
              <div className="mt-4 rounded-xl overflow-hidden border border-[#E7DCce] aspect-[16/10] bg-[#FAF8F5]">
                {CONTACT_INFO.showroom.googleMapsEmbedUrl ? (
                  <iframe
                    title="Bản đồ Showroom Cao Luật Decor"
                    src={CONTACT_INFO.showroom.googleMapsEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-[#877B70]">
                    <MapPin className="w-8 h-8 mb-2 text-[#C5A880]" />
                    <span className="text-xs">Bản đồ đang được cập nhật</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

import React, { useState } from 'react';
import { X, Phone, MessageSquare, Mail, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Product } from '../../types';
import {
  CONTACT_INFO,
  getTelHref,
  getZaloHref,
  getMailtoHref,
} from '../../config/contact';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setSubmitted(true);
  };

  const resetAndClose = () => {
    setSubmitted(false);
    setFullName('');
    setPhone('');
    setNotes('');
    onClose();
  };

  const productName = product ? product.name : 'Tư vấn giải pháp nội thất';
  const productCode = product ? product.code : 'TỔNG_HỢP';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-[#E7DCce] animate-scaleUp">
        {/* Header */}
        <div className="bg-[#654329] text-white p-5 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-[#DFC7A7] font-semibold block">
              TƯ VẤN &amp; BÁO GIÁ NHANH
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white truncate max-w-xs sm:max-w-sm">
              {productName}
            </h3>
          </div>
          <button
            onClick={resetAndClose}
            className="text-white/80 hover:text-white p-1 rounded-md transition-colors"
            aria-label="Đóng"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {submitted ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-[#29231F]">
                Đã tiếp nhận yêu cầu!
              </h4>
              <p className="text-sm text-[#6E665E] max-w-sm mx-auto">
                Cảm ơn <strong>{fullName || 'Quý khách'}</strong>. Chuyên viên Cao Luật Decor sẽ gọi điện tư vấn chi tiết cho số <strong>{phone}</strong> trong ít phút.
              </p>
              <div className="pt-4">
                <button
                  onClick={resetAndClose}
                  className="bg-[#654329] text-white px-6 py-2 rounded-md text-sm font-semibold hover:bg-[#533722]"
                >
                  Hoàn tất
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Product preview if present */}
              {product && (
                <div className="flex items-center gap-3 bg-[#FAF8F5] p-3 rounded-lg border border-[#E7DCce]">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-14 h-14 rounded object-cover shrink-0"
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-[#29231F] block">{product.name}</span>
                    <span className="text-[#877B70]">Mã: {product.code}</span>
                    <span className="text-[#654329] font-bold block mt-0.5">
                      {product.price ? `${product.price.toLocaleString('vi-VN')} đ (Tham khảo)` : 'Liên hệ báo giá'}
                    </span>
                  </div>
                </div>
              )}

              {/* Direct Instant Action Links */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-[#6E665E] block">
                  Liên hệ trực tiếp với chuyên viên tư vấn:
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs font-medium">
                  <a
                    href={getTelHref()}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 bg-[#D97706] hover:bg-[#B45309] text-white rounded-lg transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Gọi Hotline</span>
                  </a>
                  <a
                    href={getZaloHref()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-2.5 px-3 bg-[#0068FF] hover:bg-[#0052cc] text-white rounded-lg transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Chat Zalo</span>
                  </a>
                </div>
              </div>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-[#E7DCce]" />
                <span className="flex-shrink mx-3 text-xs text-[#9E978F]">Hoặc để lại số điện thoại</span>
                <div className="flex-grow border-t border-[#E7DCce]" />
              </div>

              {/* Inquiry Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#473E37] mb-1">
                    Họ và tên của Quý khách
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Vd: Nguyễn Văn A"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 border border-[#D5C3AF] rounded-md text-sm focus:outline-none focus:border-[#654329] bg-[#FAF8F5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#473E37] mb-1">
                    Số điện thoại nhận báo giá <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Vd: 0901 234 567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-[#D5C3AF] rounded-md text-sm focus:outline-none focus:border-[#654329] bg-[#FAF8F5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#473E37] mb-1">
                    Ghi chú / Yêu cầu kích thước tùy chỉnh
                  </label>
                  <textarea
                    rows={2}
                    placeholder={`Tôi muốn nhận tư vấn chi tiết cho ${productName}...`}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-[#D5C3AF] rounded-md text-sm focus:outline-none focus:border-[#654329] bg-[#FAF8F5]"
                  />
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-[#877B70]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>Bảo mật thông tin &amp; tư vấn miễn phí 100%.</span>
                </div>

                <button
                  type="submit"
                  className="w-full luxury-btn bg-[#654329] hover:bg-[#533722] text-white py-3 rounded-md font-semibold text-sm transition-all shadow-md"
                >
                  GỬI YÊU CẦU BÁO GIÁ NGAY
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

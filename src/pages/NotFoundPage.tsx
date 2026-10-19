import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass, PhoneCall } from 'lucide-react';
import { getTelHref } from '../config/contact';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-[#FAF8F5] px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-[#654329]/10 text-[#654329] flex items-center justify-center mx-auto">
          <Compass className="w-10 h-10 animate-spin-slow stroke-[1.5]" />
        </div>

        <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#654329] block">
          LỖI 404 — KHÔNG TÌM THẤY TRANG
        </span>

        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[#29231F]">
          Không Gian Này Chưa Được Khởi Tạo
        </h1>

        <p className="text-xs sm:text-sm text-[#6E665E] leading-relaxed">
          Đường dẫn bạn đang truy cập không tồn tại hoặc đã được chuyển sang danh mục mới. Mời bạn quay trở lại trang chủ để khám phá thêm các bộ sưu tập nội thất.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto luxury-btn bg-[#654329] hover:bg-[#533722] text-white py-3 px-6 rounded-md text-xs uppercase font-semibold tracking-wider flex items-center justify-center gap-2 shadow"
          >
            <Home className="w-4 h-4" />
            <span>Về trang chủ</span>
          </Link>

          <Link
            to="/san-pham"
            className="w-full sm:w-auto luxury-btn bg-white hover:bg-[#F7F3ED] text-[#29231F] border border-[#D5C3AF] py-3 px-6 rounded-md text-xs uppercase font-semibold tracking-wider flex items-center justify-center"
          >
            <span>Xem sản phẩm</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  ChevronUp,
  ExternalLink,
  Facebook,
  ThumbsUp,
  MessageCircle,
  Share2,
  CheckCircle2,
} from 'lucide-react';
import {
  CONTACT_INFO,
  getTelHref,
  getMailtoHref,
  getFacebookHref,
  getFacebookEmbedUrl,
  getMapsHref,
} from '../../config/contact';

interface FbPost {
  id: number;
  time: string;
  caption: string;
  image: string;
  likes: number;
  comments: number;
  shares: number;
}

const FB_POSTS: FbPost[] = [
  {
    id: 1,
    time: "2 giờ trước • 🌐",
    caption: "✨ Bàn giao trọn gói không gian phòng khách hiện đại cho gia chủ tại TP.HCM. Tông gỗ óc chó kết hợp sofa nỉ cao cấp nhập khẩu, may đo chuẩn xác theo diện tích nhà. Cảm ơn quý khách đã tin tưởng xưởng Cao Luật Decor!",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&auto=format&fit=crop&q=80",
    likes: 128,
    comments: 24,
    shares: 9,
  },
  {
    id: 2,
    time: "Hôm qua lúc 15:30 • 🌐",
    caption: "🔨 Trực tiếp tại xưởng sản xuất Cao Luật Decor (Quận 12): Đội thợ mộc đang hoàn thiện hệ tủ bếp Acrylic cốt chống ẩm và bộ bàn ăn Ceramic chống xước để kịp bàn giao cuối tuần.",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80",
    likes: 96,
    comments: 15,
    shares: 4,
  },
  {
    id: 3,
    time: "3 ngày trước • 🌐",
    caption: "🛋️ Bộ sưu tập Sofa Da Milano & Bàn Trà Đôi Mặt Đá Ceramic chống trầy, chịu nhiệt cao. Sẵn mẫu trưng bày tại Showroom Bình Dương, kính mời quý khách ghé thăm trải nghiệm!",
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&auto=format&fit=crop&q=80",
    likes: 215,
    comments: 38,
    shares: 14,
  },
  {
    id: 4,
    time: "5 ngày trước • 🌐",
    caption: "🏡 Không gian phòng ngủ Master với hệ giường bọc da Nappa cao cấp và tủ áo cánh kính khung nhôm Anode sang trọng. Thiết kế và thi công chuẩn thực tế 100%.",
    image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600&auto=format&fit=crop&q=80",
    likes: 174,
    comments: 22,
    shares: 11,
  },
];

export const Footer: React.FC = () => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Record<number, boolean>>({});

  const toggleLike = (postId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

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
            <div className="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-1.5">
              <h3 className="font-bold text-[#1A1A1A] text-sm uppercase tracking-wide">
                FANPAGE
              </h3>
              <a
                href={getFacebookHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-[#1877F2] hover:text-[#166FE5] flex items-center gap-1 font-semibold transition-colors"
                title="Mở Fanpage trên Facebook thực tế"
              >
                <span>Mở trang FB</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Màn hình nhỏ Fanpage chuyên biệt - Cuộn lướt bài viết mượt mà 100% & link đến Facebook thực tế */}
            <div className="border border-[#DADDE1] rounded-lg overflow-hidden bg-[#F0F2F5] shadow-sm h-[340px] flex flex-col">
              {/* Thanh điều hướng giả lập mini browser / mobile app */}
              <div className="bg-[#1877F2] text-white px-3 py-1.5 flex items-center justify-between text-xs shrink-0 shadow-sm">
                <a
                  href={getFacebookHref()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:opacity-90 transition-opacity"
                  title="Mở Facebook Cao Luật Decor"
                >
                  <div className="w-5 h-5 rounded-full bg-white text-[#1877F2] flex items-center justify-center font-bold text-xs">
                    f
                  </div>
                  <span className="font-semibold text-[11px] tracking-wide">
                    fb.com/caoluatdecor
                  </span>
                </a>
                <a
                  href={getFacebookHref()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/20 hover:bg-white/30 text-white text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1 transition-colors"
                  title="Mở trang Facebook thực tế"
                >
                  <span>Mở trang</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>

              {/* Vùng màn hình lướt bài viết (Scrollable Feed) */}
              <div className="overflow-y-auto flex-1 p-2 space-y-2.5 text-xs bg-[#F0F2F5]">
                {/* Header trang cá nhân / Fanpage */}
                <div className="bg-white rounded-lg overflow-hidden border border-[#E4E6EB] shadow-xs">
                  {/* Ảnh bìa */}
                  <div className="relative h-16 bg-[#29231F] overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&auto=format&fit=crop&q=80"
                      alt="Ảnh bìa Cao Luật Decor"
                      className="w-full h-full object-cover opacity-85"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  </div>

                  {/* Thông tin & nút theo dõi */}
                  <div className="px-3 pb-3 pt-1">
                    <div className="flex items-start gap-2.5">
                      <div className="w-11 h-11 rounded-full bg-[#654329] text-[#DFC7A7] border-2 border-white flex items-center justify-center font-bold text-sm shadow shrink-0 -mt-5">
                        CL
                      </div>
                      <div className="min-w-0 flex-1 pt-0.5">
                        <div className="flex items-center gap-1">
                          <a
                            href={getFacebookHref()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold text-[13px] text-[#1C1E21] hover:underline truncate block"
                          >
                            Cao Luật Decor
                          </a>
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#1877F2] shrink-0 fill-[#1877F2]" />
                        </div>
                        <p className="text-[10px] text-[#65676B]">
                          3,9K người theo dõi • Thiết kế nội thất
                        </p>
                      </div>
                    </div>

                    {/* Nút hành động */}
                    <div className="mt-2.5 grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setIsFollowing(!isFollowing)}
                        className={`w-full py-1 px-2 rounded flex items-center justify-center gap-1 font-semibold text-[11px] transition-colors shadow-xs ${
                          isFollowing
                            ? 'bg-[#E4E6EB] text-[#1C1E21] hover:bg-[#D8DADF]'
                            : 'bg-[#1877F2] text-white hover:bg-[#166FE5]'
                        }`}
                      >
                        <Facebook className="w-3 h-3 fill-current" />
                        <span>{isFollowing ? '✓ Đang theo dõi' : 'Theo dõi'}</span>
                      </button>

                      <a
                        href={getFacebookHref()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-[#E4E6EB] hover:bg-[#D8DADF] text-[#1C1E21] py-1 px-2 rounded flex items-center justify-center gap-1 font-semibold text-[11px] transition-colors shadow-xs"
                      >
                        <MessageCircle className="w-3 h-3 text-[#1877F2]" />
                        <span>Nhắn tin</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Thanh trạng thái bảng tin */}
                <div className="flex items-center justify-between px-1 text-[10px] font-semibold text-[#65676B] uppercase tracking-wider">
                  <span>Bài viết mới nhất</span>
                  <span className="flex items-center gap-1 text-[#42B72A]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#42B72A] animate-pulse" />
                    Trực tuyến
                  </span>
                </div>

                {/* Danh sách bài viết có thể cuộn lướt (Feed items) */}
                {FB_POSTS.map((post) => {
                  const isLiked = !!likedPosts[post.id];
                  const totalLikes = post.likes + (isLiked ? 1 : 0);

                  return (
                    <article
                      key={post.id}
                      className="bg-white rounded-lg p-3 border border-[#E4E6EB] shadow-xs space-y-2 hover:border-[#1877F2]/40 transition-colors"
                    >
                      {/* Tiêu đề bài viết */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#654329] text-[#DFC7A7] flex items-center justify-center font-bold text-[10px] shrink-0">
                            CL
                          </div>
                          <div>
                            <a
                              href={getFacebookHref()}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-bold text-[11px] text-[#1C1E21] hover:underline leading-tight block"
                            >
                              Cao Luật Decor Nội Thất
                            </a>
                            <p className="text-[9px] text-[#65676B] leading-none">
                              {post.time}
                            </p>
                          </div>
                        </div>

                        <a
                          href={getFacebookHref()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-[#1877F2] hover:underline flex items-center gap-0.5 shrink-0"
                          title="Xem bài này trên Facebook"
                        >
                          <span>Xem FB</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>

                      {/* Nội dung bài viết */}
                      <p className="text-[11px] text-[#1C1E21] leading-relaxed">
                        {post.caption}
                      </p>

                      {/* Ảnh bài viết kèm link */}
                      <a
                        href={getFacebookHref()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block rounded-md overflow-hidden border border-[#E4E6EB] group relative cursor-pointer"
                        title="Bấm để xem ảnh và bài viết trên Facebook"
                      >
                        <img
                          src={post.image}
                          alt="Nội thất Cao Luật Decor"
                          className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute bottom-1.5 right-1.5 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded flex items-center gap-1 group-hover:bg-[#1877F2] transition-colors">
                          <ExternalLink className="w-2.5 h-2.5" />
                          <span>Mở trên Facebook</span>
                        </div>
                      </a>

                      {/* Lượt tương tác */}
                      <div className="flex items-center justify-between text-[10px] text-[#65676B] pt-1 border-b border-[#F0F2F5] pb-1.5">
                        <div className="flex items-center gap-1">
                          <span className="w-4 h-4 rounded-full bg-[#1877F2] text-white flex items-center justify-center text-[9px]">
                            👍
                          </span>
                          <span>{totalLikes}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>{post.comments} bình luận</span>
                          <span>•</span>
                          <span>{post.shares} chia sẻ</span>
                        </div>
                      </div>

                      {/* Nút Like - Bình luận - Chia sẻ */}
                      <div className="grid grid-cols-3 gap-1 pt-0.5 text-[#65676B]">
                        <button
                          type="button"
                          onClick={(e) => toggleLike(post.id, e)}
                          className={`py-1 rounded flex items-center justify-center gap-1 font-semibold text-[10px] transition-colors hover:bg-[#F2F2F2] ${
                            isLiked ? 'text-[#1877F2]' : ''
                          }`}
                        >
                          <ThumbsUp className={`w-3 h-3 ${isLiked ? 'fill-current' : ''}`} />
                          <span>{isLiked ? 'Đã thích' : 'Thích'}</span>
                        </button>

                        <a
                          href={getFacebookHref()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-1 rounded flex items-center justify-center gap-1 font-semibold text-[10px] transition-colors hover:bg-[#F2F2F2]"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>Bình luận</span>
                        </a>

                        <a
                          href={getFacebookHref()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-1 rounded flex items-center justify-center gap-1 font-semibold text-[10px] transition-colors hover:bg-[#F2F2F2]"
                        >
                          <Share2 className="w-3 h-3" />
                          <span>Chia sẻ</span>
                        </a>
                      </div>
                    </article>
                  );
                })}

                {/* Chân trang danh sách bài viết */}
                <div className="text-center py-2 space-y-1.5">
                  <p className="text-[10px] text-[#65676B]">
                    Bạn đang xem các bài viết mới nhất từ Cao Luật Decor
                  </p>
                  <a
                    href={getFacebookHref()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-[#1877F2] hover:bg-[#166FE5] text-white px-3 py-1.5 rounded-full font-semibold text-[11px] shadow-sm transition-colors"
                  >
                    <Facebook className="w-3.5 h-3.5 fill-current" />
                    <span>Xem toàn bộ trên Facebook thực tế</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* CỘT 4: CHỈ ĐƯỜNG */}
          <div className="space-y-3 lg:border-l lg:border-[#E5E7EB] lg:pl-6">
            <div className="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-1.5">
              <h3 className="font-bold text-[#1A1A1A] text-sm uppercase tracking-wide">
                CHỈ ĐƯỜNG
              </h3>
              <a
                href={getMapsHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-[#1877F2] hover:text-[#166FE5] flex items-center gap-1 font-semibold transition-colors"
                title="Mở trong Google Maps"
              >
                <span>Mở trong Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Embedded Google Maps Container */}
            <div className="relative border border-[#DADDE1] rounded-lg overflow-hidden bg-white shadow-sm h-[340px]">
              <iframe
                title="Bản đồ chỉ đường Cao Luật Decor"
                src={CONTACT_INFO.showroom.googleMapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
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


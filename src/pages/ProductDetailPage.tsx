import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  PhoneCall,
  MessageSquare,
  ShieldCheck,
  Ruler,
  Layers,
  Award,
  Factory,
  CheckCircle2,
  Share2,
  Check,
} from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { ProductCard } from '../components/products/ProductCard';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { Product } from '../types';
import {
  CONTACT_INFO,
  getTelHref,
  getZaloHref,
} from '../config/contact';

interface ProductDetailPageProps {
  onOpenQuote: (product: Product) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ onOpenQuote }) => {
  const { slug } = useParams<{ slug: string }>();
  const product = PRODUCTS.find((p) => p.slug === slug);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    setActiveImageIndex(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-[#FAF8F5]">
        <h2 className="text-2xl font-serif font-bold text-[#29231F] mb-3">
          Sản Phẩm Không Tồn Tại
        </h2>
        <p className="text-xs text-[#6E665E] max-w-md mb-6">
          Sản phẩm bạn đang tìm kiếm có thể đã được cập nhật hoặc không còn hiển thị trong bộ sưu tập.
        </p>
        <Link
          to="/san-pham"
          className="bg-[#654329] text-white px-6 py-2.5 rounded-md text-xs uppercase font-semibold tracking-wider hover:bg-[#533722]"
        >
          Quay lại danh sách sản phẩm
        </Link>
      </div>
    );
  }

  // Related products
  const relatedProducts = PRODUCTS.filter(
    (p) => p.id !== product.id && (p.categoryId === product.categoryId || p.isFeatured)
  ).slice(0, 4);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const formattedPrice = product.price
    ? `${product.price.toLocaleString('vi-VN')} đ`
    : product.displayPrice || 'Liên hệ báo giá';

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-20">
      {/* Breadcrumb Bar */}
      <div className="bg-white border-b border-[#E7DCce]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { label: 'Sản phẩm', path: '/san-pham' },
              {
                label: product.categoryName,
                path: `/san-pham?category=${product.categoryId}`,
              },
              { label: product.name },
            ]}
          />
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Gallery (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Featured Photo */}
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-[#E7DCce] bg-white shadow-sm">
              <ImageWithFallback
                src={product.images[activeImageIndex]}
                alt={`${product.name} - ảnh ${activeImageIndex + 1}`}
                className="w-full h-full object-cover transition-all duration-300"
              />
              <span className="absolute top-4 left-4 bg-[#29231F]/80 backdrop-blur-sm text-[#DFC7A7] text-xs font-mono font-semibold px-3 py-1 rounded shadow">
                MÃ: {product.code}
              </span>
            </div>

            {/* Thumbnail Strip */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                      activeImageIndex === idx
                        ? 'border-[#654329] shadow-md scale-95'
                        : 'border-[#E7DCce] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <ImageWithFallback
                      src={imgUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Craftsmanship Note */}
            <div className="bg-white p-5 rounded-xl border border-[#E7DCce] space-y-3">
              <h3 className="font-serif font-bold text-base text-[#29231F] flex items-center gap-2">
                <Factory className="w-5 h-5 text-[#654329]" />
                <span>Tiêu Chuẩn Sản Xuất Tại Xưởng Cao Luật Decor</span>
              </h3>
              <p className="text-xs text-[#6E665E] leading-relaxed">
                Tất cả sản phẩm đều được sản xuất theo kích thước và chất liệu chỉ định. Quý khách có thể yêu cầu điều chỉnh màu vân gỗ, màu da bọc, chất liệu đá mặt bàn hoặc kích thước theo đúng diện tích thực tế của ngôi nhà.
              </p>
            </div>
          </div>

          {/* Right: Product Details & Actions (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 sm:p-7 rounded-xl border border-[#E7DCce] shadow-sm space-y-6">
              {/* Category & Code */}
              <div className="flex items-center justify-between">
                <Link
                  to={`/san-pham?category=${product.categoryId}`}
                  className="text-xs uppercase tracking-wider font-semibold text-[#654329] hover:underline"
                >
                  {product.categoryName}
                </Link>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 text-xs text-[#877B70] hover:text-[#29231F] transition-colors"
                  title="Sao chép liên kết sản phẩm"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-600 font-medium">Đã sao chép</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4" />
                      <span>Chia sẻ</span>
                    </>
                  )}
                </button>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-bold text-[#29231F] leading-tight">
                {product.name}
              </h1>

              {/* Price Box */}
              <div className="bg-[#FAF8F5] p-4 rounded-lg border border-[#E7DCce]">
                <span className="text-xs text-[#877B70] block mb-1">
                  Mức giá tham khảo:
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-bold text-[#654329]">
                    {formattedPrice}
                  </span>
                  {product.price && (
                    <span className="text-xs text-[#877B70]">
                      (Đã bao gồm hoàn thiện)
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#877B70] mt-2 border-t border-[#E7DCce]/60 pt-2">
                  * Giá chỉ mang tính tham khảo. Giá thực tế phụ thuộc vào vật liệu, quy cách phụ kiện và kích thước đặt làm.
                </p>
              </div>

              {/* Short Description */}
              <p className="text-xs sm:text-sm text-[#473E37] leading-relaxed">
                {product.shortDescription}
              </p>

              {/* Specifications Table */}
              <div className="space-y-2.5 pt-2">
                <h4 className="text-xs uppercase tracking-wider font-bold text-[#29231F]">
                  Thông Số Kỹ Thuật
                </h4>
                <div className="divide-y divide-[#F7F3ED] text-xs border-y border-[#F7F3ED]">
                  <div className="py-2.5 flex items-start justify-between gap-4">
                    <span className="text-[#877B70] flex items-center gap-1.5 shrink-0">
                      <Layers className="w-3.5 h-3.5 text-[#C5A880]" />
                      Chất liệu
                    </span>
                    <span className="font-medium text-[#29231F] text-right">
                      {product.material}
                    </span>
                  </div>

                  <div className="py-2.5 flex items-start justify-between gap-4">
                    <span className="text-[#877B70] flex items-center gap-1.5 shrink-0">
                      <Ruler className="w-3.5 h-3.5 text-[#C5A880]" />
                      Kích thước
                    </span>
                    <span className="font-medium text-[#29231F] text-right">
                      {product.dimensions}
                    </span>
                  </div>

                  <div className="py-2.5 flex items-start justify-between gap-4">
                    <span className="text-[#877B70] flex items-center gap-1.5 shrink-0">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
                      Bảo hành
                    </span>
                    <span className="font-medium text-[#29231F] text-right">
                      {product.warranty}
                    </span>
                  </div>

                  <div className="py-2.5 flex items-start justify-between gap-4">
                    <span className="text-[#877B70] flex items-center gap-1.5 shrink-0">
                      <Award className="w-3.5 h-3.5 text-[#C5A880]" />
                      Xuất xứ
                    </span>
                    <span className="font-medium text-[#29231F] text-right">
                      {product.origin}
                    </span>
                  </div>
                </div>
              </div>

              {/* Feature Highlights */}
              {product.features && product.features.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs uppercase tracking-wider font-bold text-[#29231F]">
                    Ưu Điểm Nổi Bật
                  </h4>
                  <ul className="space-y-1.5 text-xs text-[#473E37]">
                    {product.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Priority Contact CTAs */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={() => onOpenQuote(product)}
                  className="w-full luxury-btn bg-[#654329] hover:bg-[#533722] text-[#FAF8F5] py-3.5 px-6 rounded-md font-semibold text-xs sm:text-sm uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <PhoneCall className="w-4 h-4 text-[#DFC7A7]" />
                  <span>LIÊN HỆ BÁO GIÁ MAY ĐO</span>
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={getTelHref()}
                    className="py-3 px-4 bg-[#D97706] hover:bg-[#B45309] text-white rounded-md text-xs font-semibold text-center flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Gọi {CONTACT_INFO.hotline.display}</span>
                  </a>

                  <a
                    href={getZaloHref()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-4 bg-[#0068FF] hover:bg-[#0052cc] text-white rounded-md text-xs font-semibold text-center flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Tư vấn qua Zalo</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Description Tab / Section */}
        <section className="mt-12 bg-white p-6 sm:p-8 rounded-xl border border-[#E7DCce] shadow-sm">
          <h2 className="text-xl font-serif font-bold text-[#29231F] mb-4 pb-3 border-b border-[#E7DCce]">
            Chi Tiết Sản Phẩm &amp; Ý Tưởng Thiết Kế
          </h2>
          <div className="prose max-w-none text-xs sm:text-sm text-[#473E37] leading-relaxed space-y-4">
            <p>{product.description}</p>
            <p>
              Tại xưởng sản xuất <strong>Cao Luật Decor</strong>, mỗi sản phẩm trước khi giao đến tay khách hàng đều trải qua quy trình kiểm tra chất lượng nghiêm ngặt về độ phẳng, mộng ghép, bề mặt sơn và phụ kiện giảm chấn.
            </p>
          </div>
        </section>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-[#654329] block mb-1">
                  GỢI Ý CÙNG KHÔNG GIAN
                </span>
                <h2 className="text-2xl font-serif font-bold text-[#29231F]">
                  Sản Phẩm Tương Tự
                </h2>
              </div>
              <Link
                to={`/san-pham?category=${product.categoryId}`}
                className="text-xs font-semibold text-[#654329] hover:underline"
              >
                Xem thêm trong danh mục &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relProduct) => (
                <ProductCard
                  key={relProduct.id}
                  product={relProduct}
                  onOpenQuote={onOpenQuote}
                />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

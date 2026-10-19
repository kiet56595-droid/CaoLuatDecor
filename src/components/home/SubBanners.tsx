import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { ImageWithFallback } from '../common/ImageWithFallback';

export const SubBanners: React.FC = () => {
  const banners = [
    {
      title: 'Không Gian Phòng Ăn',
      subtitle: 'Ấm Cúng & Gắn Kết',
      desc: 'Bộ bàn ăn mặt đá Ceramic & gỗ sồi tự nhiên cho những bữa cơm tròn vị.',
      image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1000&q=80',
      link: '/san-pham?category=ban-an-ghe-an',
    },
    {
      title: 'Không Gian Phòng Ngủ',
      subtitle: 'Thư Thái & Sang Trọng',
      desc: 'Giường ngủ bọc da, tủ áo cánh kính chuẩn gu nghỉ dưỡng đẳng cấp.',
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=80',
      link: '/san-pham?category=giuong-ngu',
    },
    {
      title: 'Hệ Tủ Bếp Hiện Đại',
      subtitle: 'Công Năng & Đẳng Cấp',
      desc: 'Tủ bếp Acrylic bóng gương An Cường, tối ưu hóa mọi góc chết căn bếp.',
      image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=80',
      link: '/san-pham?category=tu-bep',
    },
  ];

  return (
    <section className="py-12 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {banners.map((item, idx) => (
            <Link
              key={idx}
              to={item.link}
              className="group relative rounded-xl overflow-hidden aspect-[4/3] sm:aspect-[16/11] border border-[#E7DCce] shadow-sm block"
            >
              {/* Image */}
              <ImageWithFallback
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#21160D]/90 via-[#21160D]/40 to-transparent transition-opacity group-hover:opacity-90" />

              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                <span className="text-[11px] uppercase tracking-wider text-[#DFC7A7] font-semibold mb-1">
                  {item.subtitle}
                </span>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-serif font-bold text-xl sm:text-2xl text-white group-hover:text-[#DFC7A7] transition-colors">
                    {item.title}
                  </h3>
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white group-hover:bg-[#654329] group-hover:text-[#DFC7A7] transition-all shrink-0">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-xs text-[#E5D8C5] line-clamp-2 mt-1.5 opacity-90">
                  {item.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

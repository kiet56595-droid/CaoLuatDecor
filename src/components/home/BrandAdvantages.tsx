import React from 'react';
import { Compass, Hammer, ShieldCheck, Palette, CheckCircle } from 'lucide-react';

export const BrandAdvantages: React.FC = () => {
  const steps = [
    {
      icon: Compass,
      step: '01',
      title: 'Tư Vấn & Khảo Sát Hiện Trạng',
      desc: 'Lắng nghe nhu cầu thực tế của gia đình, đo đạc kích thước hiện trạng tỉ mỉ để tối ưu hóa không gian sử dụng.',
    },
    {
      icon: Palette,
      step: '02',
      title: 'Thiết Kế 3D Cá Nhân Hóa',
      desc: 'Hiện thực hóa ý tưởng trên bản vẽ phối cảnh 3D trực quan, lựa chọn vật liệu, mã màu sắc theo gu thẩm mỹ riêng.',
    },
    {
      icon: Hammer,
      step: '03',
      title: 'Sản Xuất May Đo Tại Xưởng',
      desc: 'Gia công trực tiếp từ gỗ chống ẩm An Cường, da cao cấp và đá tự nhiên trên dây chuyền máy móc chuẩn xác.',
    },
    {
      icon: ShieldCheck,
      step: '04',
      title: 'Thi Công Lắp Đặt & Bảo Hành',
      desc: 'Đội ngũ thợ mộc tay nghề cao lắp đặt gọn gàng, vệ sinh sạch sẽ trước khi bàn giao và bảo hành chu đáo.',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Brand Story & Philosophy */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#654329] block">
              VÌ SAO CHỌN CAO LUẬT DECOR
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#29231F] leading-tight">
              Tâm Huyết Trong Từng <br />
              <span className="text-[#654329] italic font-normal">Chi Tiết Không Gian Sống</span>
            </h2>
            <p className="text-sm text-[#6E665E] leading-relaxed">
              Tại <strong>Cao Luật Decor Nội Thất</strong>, chúng tôi không chỉ bán một món đồ gỗ, mà mang đến giải pháp không gian sống đồng bộ, ấm cúng và phản chiếu cá tính của gia chủ.
            </p>

            <ul className="space-y-3 text-xs sm:text-sm text-[#473E37]">
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-[#654329] shrink-0 mt-0.5" />
                <span>Trực tiếp sản xuất, không qua trung gian giúp giá thành cạnh tranh và kiểm soát chất lượng chặt chẽ.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-[#654329] shrink-0 mt-0.5" />
                <span>Chỉ sử dụng vật liệu có nguồn gốc rõ ràng: Cốt gỗ An Cường, da bò Ý, đá Marble & Ceramic chống ố.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-[#654329] shrink-0 mt-0.5" />
                <span>Cam kết đúng tiến độ, bảo hành kết cấu 3 - 5 năm và bảo trì tận tâm.</span>
              </li>
            </ul>
          </div>

          {/* Right Column: 4-step workflow */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {steps.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#FAF8F5] p-6 rounded-xl border border-[#E7DCce] hover:border-[#654329] transition-colors relative"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-[#654329]/10 text-[#654329] flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-serif font-bold text-[#D5C3AF]">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-base text-[#29231F] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#6E665E] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

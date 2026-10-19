import React from 'react';
import { TESTIMONIALS } from '../../data/testimonials';
import { Star, Quote, Info } from 'lucide-react';
import { ImageWithFallback } from '../common/ImageWithFallback';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-16 bg-[#F7F3ED]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-wider font-semibold text-[#654329] block mb-2">
            TRẢI NGHIỆM GIA CHỦ
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif text-[#29231F] mb-3">
            Cảm Nhận Về Không Gian Hoàn Thiện
          </h2>
          <p className="text-xs sm:text-sm text-[#6E665E]">
            Sự hài lòng của mỗi khách hàng là động lực lớn nhất để đội ngũ Cao Luật Decor không ngừng hoàn thiện.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((item) => (
            <div
              key={item.id}
              className="bg-white p-6 rounded-xl border border-[#E7DCce] shadow-sm flex flex-col justify-between relative"
            >
              <Quote className="w-8 h-8 text-[#E7DCce] absolute top-5 right-5" />
              <div>
                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-[#D97706] mb-3">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-[#473E37] italic leading-relaxed mb-6">
                  "{item.comment}"
                </p>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-[#F7F3ED]">
                <ImageWithFallback
                  src={item.avatar}
                  alt={item.clientName}
                  className="w-10 h-10 rounded-full object-cover shrink-0"
                />
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#29231F]">
                    {item.clientName}
                  </h4>
                  <span className="text-[11px] text-[#877B70] block">
                    {item.projectType}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Explicit Demo Disclaimer as required by Requirement 3 */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-1.5 bg-white/80 border border-[#D5C3AF]/60 text-[#877B70] text-[11px] px-3.5 py-1.5 rounded-full">
            <Info className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Nội dung minh họa giao diện demo — Sẽ thay bằng cảm nhận thực tế khi bàn giao công trình.</span>
          </div>
        </div>
      </div>
    </section>
  );
};

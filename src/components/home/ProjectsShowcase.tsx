import React from 'react';
import { Link } from 'react-router-dom';
import { PROJECTS } from '../../data/projects';
import { ArrowRight, MapPin, Maximize2 } from 'lucide-react';
import { ImageWithFallback } from '../common/ImageWithFallback';

export const ProjectsShowcase: React.FC = () => {
  const showcaseProjects = PROJECTS.slice(0, 3);

  return (
    <section className="py-16 sm:py-20 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-[#654329] block mb-2">
              DẤU ẤN THI CÔNG THỰC TẾ
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif text-[#29231F]">
              Dự Án Nội Thất Đã Thực Hiện
            </h2>
            <p className="text-xs sm:text-sm text-[#6E665E] mt-1">
              Khám phá các công trình căn hộ cao cấp, nhà phố và biệt thự được hoàn thiện bởi đội ngũ Cao Luật Decor.
            </p>
          </div>

          <Link
            to="/du-an"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#654329] hover:text-[#432C1B] transition-colors"
          >
            <span>Xem tất cả dự án</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 3 Large Project Showcase Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {showcaseProjects.map((project) => (
            <div
              key={project.id}
              className="group bg-white rounded-xl overflow-hidden border border-[#E7DCce] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[#FAF8F5]">
                <ImageWithFallback
                  src={project.thumbnail}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 bg-[#29231F]/80 backdrop-blur-sm text-[#DFC7A7] text-[11px] font-medium px-2.5 py-1 rounded">
                  {project.categoryLabel}
                </span>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-3 text-[11px] text-[#877B70] mb-2">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#C5A880]" />
                    {project.location}
                  </span>
                  <span>•</span>
                  <span>{project.area}</span>
                </div>

                <h3 className="font-serif font-bold text-lg text-[#29231F] group-hover:text-[#654329] transition-colors mb-2">
                  {project.title}
                </h3>

                <p className="text-xs text-[#6E665E] line-clamp-2 mb-4 leading-relaxed">
                  {project.description}
                </p>

                <div className="mt-auto pt-4 border-t border-[#F7F3ED] flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#654329]">
                    Phong cách: {project.style}
                  </span>
                  <Link
                    to="/du-an"
                    className="text-xs font-semibold text-[#29231F] group-hover:text-[#654329] flex items-center gap-1"
                  >
                    <span>Xem chi tiết</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

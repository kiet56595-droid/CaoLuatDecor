import React, { useState } from 'react';
import { PageHeader } from '../components/common/PageHeader';
import { PROJECTS } from '../data/projects';
import { Project, ProjectCategory } from '../types';
import { MapPin, Maximize2, Calendar, Sparkles, X, ChevronRight, Info } from 'lucide-react';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { CONTACT_INFO, getTelHref, getZaloHref } from '../config/contact';

export const ProjectsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('all');
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  const filterTabs: { label: string; value: ProjectCategory }[] = [
    { label: 'Tất cả dự án', value: 'all' },
    { label: 'Nội thất căn hộ', value: 'can-ho' },
    { label: 'Nội thất nhà phố', value: 'nha-pho' },
    { label: 'Nội thất biệt thự', value: 'biet-thu' },
    { label: 'Phòng khách', value: 'phong-khach' },
    { label: 'Phòng ngủ', value: 'phong-ngu' },
    { label: 'Nhà bếp', value: 'nha-bep' },
  ];

  const filteredProjects = selectedCategory === 'all'
    ? PROJECTS
    : PROJECTS.filter((p) => p.category === selectedCategory);

  const openProjectModal = (project: Project) => {
    setActiveProject(project);
    setModalImageIndex(0);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-20">
      <PageHeader
        title="Dự Án Nội Thất Tiêu Biểu"
        subtitle="Tổng hợp các không gian sống thực tế do Cao Luật Decor thiết kế 3D và trực tiếp sản xuất, thi công hoàn thiện trọn gói."
        breadcrumbs={[{ label: 'Dự án' }]}
        backgroundImage="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none justify-start lg:justify-center">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setSelectedCategory(tab.value)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                selectedCategory === tab.value
                  ? 'bg-[#654329] text-white shadow-md'
                  : 'bg-white text-[#473E37] border border-[#E7DCce] hover:bg-[#F7F3ED]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group bg-white rounded-xl border border-[#E7DCce] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Thumbnail with Click to Expand */}
              <div
                onClick={() => openProjectModal(project)}
                className="relative aspect-[16/10] overflow-hidden bg-[#FAF8F5] cursor-pointer"
              >
                <ImageWithFallback
                  src={project.thumbnail}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 bg-[#29231F]/80 backdrop-blur-sm text-[#DFC7A7] text-[11px] font-medium px-2.5 py-1 rounded">
                  {project.categoryLabel}
                </span>

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-white text-[#29231F] text-xs font-semibold py-2 px-4 rounded-full shadow flex items-center gap-1.5">
                    <Maximize2 className="w-3.5 h-3.5 text-[#654329]" />
                    <span>Xem ảnh chi tiết</span>
                  </span>
                </div>
              </div>

              {/* Information */}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-3 text-xs text-[#877B70] mb-2">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#C5A880]" />
                    {project.location}
                  </span>
                  <span>•</span>
                  <span>{project.area}</span>
                </div>

                <h3
                  onClick={() => openProjectModal(project)}
                  className="font-serif font-bold text-lg text-[#29231F] group-hover:text-[#654329] transition-colors mb-2 cursor-pointer"
                >
                  {project.title}
                </h3>

                <p className="text-xs text-[#6E665E] line-clamp-2 mb-4 leading-relaxed">
                  {project.description}
                </p>

                <div className="mt-auto pt-4 border-t border-[#F7F3ED] space-y-2">
                  <div className="text-[11px] text-[#473E37]">
                    <strong>Phong cách:</strong> {project.style}
                  </div>
                  <div className="text-[11px] text-[#473E37]">
                    <strong>Hạng mục:</strong> {project.scopeOfWork}
                  </div>

                  <button
                    onClick={() => openProjectModal(project)}
                    className="w-full mt-3 py-2 px-3 bg-[#FAF8F5] group-hover:bg-[#654329] text-[#29231F] group-hover:text-white rounded text-center text-xs font-semibold tracking-wider transition-colors flex items-center justify-center gap-1"
                  >
                    <span>Xem bộ ảnh dự án ({project.gallery.length} ảnh)</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Demo Data Notice as requested by Requirement 6 */}
        <div className="mt-14 bg-white p-6 rounded-xl border border-[#E7DCce] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-[#C5A880] shrink-0 mt-0.5" />
            <div className="text-xs text-[#6E665E]">
              <strong className="text-[#29231F] block text-sm mb-0.5">
                Dữ liệu dự án là nội dung mẫu minh họa:
              </strong>
              Các hình ảnh và thông số dự án trên đây được dựng làm mẫu trưng bày. Để thay thế bằng hình ảnh công trình thực tế của quý xưởng, bạn chỉ cần chỉnh sửa file <code className="bg-[#FAF8F5] px-1.5 py-0.5 rounded text-[#654329] font-mono">src/data/projects.ts</code>.
            </div>
          </div>
        </div>
      </main>

      {/* Project Lightbox & Details Modal */}
      {activeProject && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full overflow-hidden border border-[#E7DCce] animate-scaleUp">
            {/* Modal Header */}
            <div className="bg-[#654329] text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#DFC7A7] font-semibold block">
                  {activeProject.categoryLabel} • {activeProject.location}
                </span>
                <h3 className="text-xl font-serif font-bold text-white truncate max-w-md sm:max-w-xl">
                  {activeProject.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveProject(null)}
                className="text-white/80 hover:text-white p-1 rounded-md"
                aria-label="Đóng"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Main Photo Viewer */}
              <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-black/5">
                <ImageWithFallback
                  src={activeProject.gallery[modalImageIndex]}
                  alt={`${activeProject.title} - ảnh ${modalImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnails */}
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {activeProject.gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setModalImageIndex(idx)}
                    className={`relative w-20 h-14 rounded overflow-hidden border-2 shrink-0 transition-all ${
                      modalImageIndex === idx ? 'border-[#654329] scale-95' : 'border-[#E7DCce] opacity-70'
                    }`}
                  >
                    <ImageWithFallback
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Project Meta Details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[#FAF8F5] rounded-lg border border-[#E7DCce] text-xs">
                <div>
                  <span className="text-[#877B70] block">Diện tích:</span>
                  <span className="font-semibold text-[#29231F]">{activeProject.area}</span>
                </div>
                <div>
                  <span className="text-[#877B70] block">Phong cách:</span>
                  <span className="font-semibold text-[#29231F]">{activeProject.style}</span>
                </div>
                <div>
                  <span className="text-[#877B70] block">Vị trí:</span>
                  <span className="font-semibold text-[#29231F]">{activeProject.location}</span>
                </div>
                <div>
                  <span className="text-[#877B70] block">Năm hoàn thành:</span>
                  <span className="font-semibold text-[#29231F]">{activeProject.year}</span>
                </div>
              </div>

              <div className="text-xs text-[#473E37] leading-relaxed">
                <p className="mb-2">{activeProject.description}</p>
                <p><strong>Hạng mục thi công trọn gói:</strong> {activeProject.scopeOfWork}</p>
              </div>

              {/* Consultation trigger */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#E7DCce]">
                <span className="text-xs text-[#6E665E]">
                  Bạn yêu thích phong cách này cho ngôi nhà của mình?
                </span>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <a
                    href={getTelHref()}
                    className="flex-1 sm:flex-none py-2.5 px-4 bg-[#654329] text-white rounded text-xs font-semibold hover:bg-[#533722] text-center"
                  >
                    Gọi tư vấn ngay
                  </a>
                  <a
                    href={getZaloHref()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none py-2.5 px-4 bg-[#0068FF] text-white rounded text-xs font-semibold hover:bg-[#0052cc] text-center"
                  >
                    Chat Zalo
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

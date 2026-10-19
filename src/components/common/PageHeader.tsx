import React from 'react';
import { Breadcrumb, BreadcrumbItem } from './Breadcrumb';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs: BreadcrumbItem[];
  backgroundImage?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
  backgroundImage = 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80',
}) => {
  return (
    <div className="relative bg-[#29231F] text-[#FAF8F5] py-14 sm:py-20 overflow-hidden">
      {/* Background Image with Dark Gradient Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25 scale-105 transition-transform duration-1000"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#29231F] via-[#29231F]/80 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-white/80 mb-3">
          <Breadcrumb items={breadcrumbs} />
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif tracking-tight text-white mb-3">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm sm:text-base text-[#E5D8C5] max-w-2xl font-light">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

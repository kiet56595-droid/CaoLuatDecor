import React from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { CONTACT_INFO, getTelHref, getMailtoHref, getMapsHref } from '../../config/contact';

export const TopBar: React.FC = () => {
  return (
    <div className="bg-[#29231F] text-[#E5D8C5] text-xs py-2 px-4 border-b border-[#3A322C]">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Left: Address & Hours */}
        <div className="flex items-center flex-wrap justify-center sm:justify-start gap-4 text-center sm:text-left">
          <a
            href={getMapsHref()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-white transition-colors"
            title="Xem vị trí showroom trên Google Maps"
          >
            <MapPin className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
            <span className="truncate max-w-[280px] sm:max-w-none">
              Showroom: {CONTACT_INFO.showroom.address}, {CONTACT_INFO.showroom.districtCity}
            </span>
          </a>
          <span className="hidden md:inline-flex items-center gap-1.5 text-[#9E978F]">
            <Clock className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
            <span>{CONTACT_INFO.workingHours.weekdays}</span>
          </span>
        </div>

        {/* Right: Hotline & Email */}
        <div className="flex items-center gap-4">
          <a
            href={getTelHref()}
            className="flex items-center gap-1.5 font-semibold text-white hover:text-[#DFC7A7] transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
            <span>Hotline: {CONTACT_INFO.hotline.display}</span>
          </a>
          <span className="text-[#473E37]">|</span>
          <a
            href={getMailtoHref()}
            className="hidden lg:flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
            <span>{CONTACT_INFO.email.display}</span>
          </a>
        </div>
      </div>
    </div>
  );
};

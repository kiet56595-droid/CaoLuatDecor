import React, { useState, useEffect } from 'react';
import { Phone, MessageSquare, ArrowUp, Send } from 'lucide-react';
import {
  CONTACT_INFO,
  getTelHref,
  getZaloHref,
  getFacebookHref,
} from '../../config/contact';

interface FloatingContactProps {
  onOpenQuoteModal?: () => void;
}

export const FloatingContact: React.FC<FloatingContactProps> = ({ onOpenQuoteModal }) => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-6 right-5 z-40 flex flex-col items-end gap-3 pointer-events-auto">
      {/* Quick Consultation Trigger */}
      {onOpenQuoteModal && (
        <button
          onClick={onOpenQuoteModal}
          className="group flex items-center bg-[#654329] hover:bg-[#533722] text-white p-3 rounded-full shadow-lg transition-all transform hover:scale-105"
          title="Nhận báo giá nhanh"
          aria-label="Nhận báo giá nhanh"
        >
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out text-xs font-semibold px-0 group-hover:px-2">
            Báo Giá Nhanh
          </span>
          <Send className="w-5 h-5 text-[#DFC7A7]" />
        </button>
      )}

      {/* Zalo Button */}
      <a
        href={getZaloHref()}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center bg-[#0068FF] hover:bg-[#0052cc] text-white p-3 rounded-full shadow-lg transition-all transform hover:scale-105"
        title="Chat Zalo ngay"
        aria-label="Chat Zalo ngay"
      >
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out text-xs font-semibold px-0 group-hover:px-2">
          Chat Zalo
        </span>
        <div className="w-5 h-5 flex items-center justify-center font-bold text-xs">
          Z
        </div>
      </a>

      {/* Hotline Button (with pulse ring) */}
      <a
        href={getTelHref()}
        className="group flex items-center bg-[#D97706] hover:bg-[#B45309] text-white p-3.5 rounded-full shadow-xl transition-all transform hover:scale-105 pulse-ring"
        title={`Gọi ngay: ${CONTACT_INFO.hotline.display}`}
        aria-label={`Gọi ngay: ${CONTACT_INFO.hotline.display}`}
      >
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out text-xs font-semibold px-0 group-hover:px-2">
          Hotline: {CONTACT_INFO.hotline.display}
        </span>
        <Phone className="w-5 h-5 animate-bounce" />
      </a>

      {/* Scroll to Top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="bg-[#29231F]/80 hover:bg-[#29231F] text-white p-2.5 rounded-full shadow-md transition-all backdrop-blur-sm"
          title="Lên đầu trang"
          aria-label="Lên đầu trang"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, PhoneCall, Search } from 'lucide-react';
import { CONTACT_INFO, getTelHref, getZaloHref } from '../../config/contact';
import { UserMenu } from '../auth/UserMenu';
import { AuthModal } from '../auth/AuthModal';

interface HeaderProps {
  onOpenQuoteModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenQuoteModal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/san-pham?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setMobileMenuOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { label: 'Trang chủ', path: '/' },
    { label: 'Sản phẩm', path: '/san-pham' },
    { label: 'Danh mục', path: '/danh-muc' },
    { label: 'Giới thiệu', path: '/gioi-thieu' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md py-2.5'
          : 'bg-white border-b border-[#E7DCce]/60 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-[#654329] flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:bg-[#533722] transition-colors">
              <span className="tracking-tighter text-[#DFC7A7]">CL</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg sm:text-xl tracking-wide text-[#654329] group-hover:text-[#432C1B] transition-colors leading-tight">
                CAO LUẬT DECOR
              </span>
              <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-[#877B70]">
                NỘI THẤT CAO CẤP
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-semibold rounded-md transition-all ${
                    isActive
                      ? 'text-[#654329] bg-[#F7F3ED]'
                      : 'text-[#473E37] hover:text-[#654329] hover:bg-[#FAF8F5]'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Header Action Buttons */}
          <div className="hidden sm:flex items-center gap-2">
            {/* Quick search button */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-[#473E37] hover:text-[#654329] hover:bg-[#F7F3ED] rounded-full transition-colors"
              title="Tìm kiếm sản phẩm"
              aria-label="Tìm kiếm sản phẩm"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* UserMenu: hiển thị nút Đăng nhập (Guest) hoặc Avatar dropdown (Authenticated) */}
            <UserMenu onOpenAuth={() => setAuthModalOpen(true)} />

            {/* Quick Consultation CTA */}
            {onOpenQuoteModal ? (
              <button
                onClick={onOpenQuoteModal}
                className="luxury-btn bg-[#654329] hover:bg-[#533722] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold py-2.5 px-4 rounded-md shadow-sm transition-all flex items-center gap-2"
              >
                <PhoneCall className="w-4 h-4 text-[#DFC7A7]" />
                <span>Báo Giá Nhanh</span>
              </button>
            ) : (
              <a
                href={getTelHref()}
                className="luxury-btn bg-[#654329] hover:bg-[#533722] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold py-2.5 px-4 rounded-md shadow-sm transition-all flex items-center gap-2"
              >
                <PhoneCall className="w-4 h-4 text-[#DFC7A7]" />
                <span>Liên Hệ Ngay</span>
              </a>
            )}
          </div>

          {/* Mobile Menu & Search Trigger */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-[#473E37] hover:text-[#654329] rounded-md"
              aria-label="Tìm kiếm"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#29231F] hover:text-[#654329] rounded-md focus:outline-none"
              aria-label="Mở menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Search Bar Dropdown */}
        {searchOpen && (
          <form
            onSubmit={handleSearchSubmit}
            className="pt-3 pb-2 border-t border-[#E7DCce] mt-3 flex items-center gap-2 animate-fadeIn"
          >
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Nhập tên sản phẩm (vd: Sofa, Bàn ăn, Bàn trà, Tủ bếp...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full pl-10 pr-4 py-2 border border-[#D5C3AF] rounded-md text-sm focus:outline-none focus:border-[#654329] bg-[#FAF8F5]"
              />
              <Search className="w-4 h-4 text-[#877B70] absolute left-3 top-3" />
            </div>
            <button
              type="submit"
              className="bg-[#654329] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#533722]"
            >
              Tìm
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="p-2 text-[#877B70] hover:text-black text-xs"
            >
              Hủy
            </button>
          </form>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <nav
            aria-label="Mobile Navigation"
            className="lg:hidden pt-4 pb-6 border-t border-[#E7DCce] mt-3 space-y-1"
          >
            {navLinks.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-2.5 rounded-md text-base font-medium transition-colors ${
                    isActive
                      ? 'text-[#654329] bg-[#F7F3ED] font-semibold'
                      : 'text-[#473E37] hover:text-[#654329] hover:bg-[#FAF8F5]'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}

            <div className="pt-4 mt-4 border-t border-[#E7DCce] space-y-2 px-2">
              <a
                href={getTelHref()}
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-[#654329] text-white font-medium rounded-md text-sm"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Gọi Hotline: {CONTACT_INFO.hotline.display}</span>
              </a>
              <a
                href={getZaloHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-[#0068FF] text-white font-medium rounded-md text-sm"
              >
                <span>Nhắn tin Zalo tư vấn</span>
              </a>
            </div>
          </nav>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </header>
  );
};

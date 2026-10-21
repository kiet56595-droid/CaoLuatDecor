import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, PhoneCall, Search, ChevronDown } from 'lucide-react';
import { CONTACT_INFO, getTelHref, getZaloHref } from '../../config/contact';
import { CATEGORIES } from '../../data/categories';
import { UserMenu } from '../auth/UserMenu';
import { AuthModal } from '../auth/AuthModal';

export interface CategoryNavGroup {
  label: string;
  path: string;
  categoryId?: string;
  items?: { label: string; categoryId: string; path: string }[];
}

export const CATEGORY_NAV_GROUPS: CategoryNavGroup[] = [
  {
    label: 'NỘI THẤT PHÒNG KHÁCH',
    path: '/san-pham?category=phong-khach',
    categoryId: 'phong-khach',
    items: [
      { label: 'Sofa Phòng Khách', categoryId: 'sofa-phong-khach', path: '/san-pham?category=sofa-phong-khach' },
      { label: 'Bàn Trà Mặt Đá & Gỗ', categoryId: 'ban-tra', path: '/san-pham?category=ban-tra' },
      { label: 'Kệ Tivi Hiện Đại', categoryId: 'ke-tivi', path: '/san-pham?category=ke-tivi' },
    ],
  },
  {
    label: 'PHÒNG ĂN',
    path: '/san-pham?category=ban-an-ghe-an',
    categoryId: 'ban-an-ghe-an',
    items: [
      { label: 'Bàn Ăn & Ghế Ăn Cao Cấp', categoryId: 'ban-an-ghe-an', path: '/san-pham?category=ban-an-ghe-an' },
    ],
  },
  {
    label: 'NỘI THẤT PHÒNG NGỦ',
    path: '/san-pham?category=phong-ngu',
    categoryId: 'phong-ngu',
    items: [
      { label: 'Giường Ngủ Hiện Đại', categoryId: 'giuong-ngu', path: '/san-pham?category=giuong-ngu' },
      { label: 'Tủ Quần Áo Cánh Kính', categoryId: 'tu-quan-ao', path: '/san-pham?category=tu-quan-ao' },
    ],
  },
  {
    label: 'TỦ BẾP',
    path: '/san-pham?category=tu-bep',
    categoryId: 'tu-bep',
    items: [
      { label: 'Tủ Bếp Acrylic & MDF An Cường', categoryId: 'tu-bep', path: '/san-pham?category=tu-bep' },
    ],
  },
  {
    label: 'PHÒNG EM BÉ',
    path: '/san-pham?category=noi-that-tre-em',
    categoryId: 'noi-that-tre-em',
  },
  {
    label: 'VĂN PHÒNG',
    path: '/san-pham?category=noi-that-van-phong',
    categoryId: 'noi-that-van-phong',
  },
  {
    label: 'ĐỒ TRANG TRÍ',
    path: '/san-pham?category=do-decor-trang-tri',
    categoryId: 'do-decor-trang-tri',
  },
  {
    label: 'TẤT CẢ SẢN PHẨM',
    path: '/san-pham',
  },
];

interface HeaderProps {
  onOpenQuoteModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenQuoteModal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileActiveCategory, setMobileActiveCategory] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('all');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim());
    }
    if (searchCategory !== 'all') {
      params.set('category', searchCategory);
    }
    navigate(`/san-pham?${params.toString()}`);
    setMobileMenuOpen(false);
  };

  const handleMouseEnter = (label: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setOpenDropdown(label);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  };

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${isScrolled ? 'shadow-md' : ''}`}>
      {/* ── Main Header Bar (Logo + Search Bar + Actions) ── */}
      <div className="bg-white border-b border-[#E7DCce]/70 py-3 sm:py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-3 group shrink-0">
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

            {/* Center: Search Bar with Category Select (Decor3mien style) */}
            <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center flex-1 max-w-xl mx-2 lg:mx-6">
              <div className="flex w-full border border-[#D5C3AF] hover:border-[#654329] focus-within:border-[#654329] rounded-md overflow-hidden bg-white shadow-sm transition-colors">
                <select
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className="bg-[#FAF8F5] text-xs font-medium text-[#473E37] px-3 py-2 border-r border-[#E7DCce] focus:outline-none cursor-pointer shrink-0"
                >
                  <option value="all">Tất cả danh mục</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Tìm nhanh sản phẩm (Sofa, Bàn ăn, Bàn trà, Tủ bếp...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-3.5 py-2 text-xs sm:text-sm text-[#29231F] focus:outline-none bg-white placeholder:text-[#9E978F]"
                />
                <button
                  type="submit"
                  className="bg-[#654329] hover:bg-[#533722] text-white px-4 flex items-center justify-center transition-colors shrink-0"
                  title="Tìm kiếm"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Header Right Actions */}
            <div className="flex items-center gap-2.5 shrink-0">
              {/* User Account Menu */}
              <UserMenu onOpenAuth={() => setAuthModalOpen(true)} />

              {/* Quick Quote / Hotline Button */}
              {onOpenQuoteModal ? (
                <button
                  onClick={onOpenQuoteModal}
                  className="hidden sm:flex bg-[#654329] hover:bg-[#533722] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold py-2 px-3.5 rounded-md shadow-sm transition-all items-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-[#DFC7A7]" />
                  <span>Báo Giá Nhanh</span>
                </button>
              ) : (
                <a
                  href={getTelHref()}
                  className="hidden sm:flex bg-[#654329] hover:bg-[#533722] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold py-2 px-3.5 rounded-md shadow-sm transition-all items-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-[#DFC7A7]" />
                  <span>{CONTACT_INFO.hotline.display}</span>
                </a>
              )}

              {/* Mobile Menu Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-[#29231F] hover:text-[#654329] rounded-md focus:outline-none lg:hidden"
                aria-label="Mở menu danh mục"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Search Input */}
          <form onSubmit={handleSearchSubmit} className="mt-3 md:hidden flex items-center gap-1.5">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Tìm nhanh sản phẩm nội thất..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-[#D5C3AF] rounded-md text-xs bg-[#FAF8F5] focus:outline-none focus:border-[#654329]"
              />
              <Search className="w-4 h-4 text-[#877B70] absolute left-3 top-2.5" />
            </div>
            <button
              type="submit"
              className="bg-[#654329] text-white px-3 py-2 rounded-md text-xs font-semibold"
            >
              Tìm
            </button>
          </form>
        </div>
      </div>

      {/* ── Category Navigation Bar (Decor3mien style horizontal strip) ── */}
      <nav aria-label="Danh mục sản phẩm" className="bg-[#3A322C] text-white border-b border-[#29231F] hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center justify-between text-xs font-semibold tracking-wide">
            {CATEGORY_NAV_GROUPS.map((group) => {
              const hasDropdown = group.items && group.items.length > 0;
              const isOpen = openDropdown === group.label;

              return (
                <li
                  key={group.label}
                  className="relative group py-2.5"
                  onMouseEnter={() => hasDropdown && handleMouseEnter(group.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    to={group.path}
                    className="flex items-center gap-1 px-2.5 py-1 text-[#FAF8F5] hover:text-[#DFC7A7] transition-colors rounded hover:bg-white/10"
                  >
                    <span>{group.label}</span>
                    {hasDropdown && (
                      <ChevronDown className={`w-3.5 h-3.5 text-[#C5A880] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                    )}
                  </Link>

                  {/* Dropdown Menu */}
                  {hasDropdown && isOpen && (
                    <div
                      className="absolute top-full left-0 w-64 bg-white text-[#29231F] shadow-xl rounded-b-md border border-[#E7DCce] py-2 z-50 animate-fadeIn"
                      onMouseEnter={() => handleMouseEnter(group.label)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#9E978F] border-b border-[#F7F3ED] mb-1">
                        {group.label}
                      </div>
                      {group.items?.map((item) => (
                        <Link
                          key={item.categoryId}
                          to={item.path}
                          onClick={() => setOpenDropdown(null)}
                          className="block px-4 py-2 text-xs text-[#473E37] hover:text-[#654329] hover:bg-[#F7F3ED] font-medium transition-colors"
                        >
                          {item.label}
                        </Link>
                      ))}
                      <div className="pt-1 mt-1 border-t border-[#F7F3ED] px-3">
                        <Link
                          to={group.path}
                          onClick={() => setOpenDropdown(null)}
                          className="text-[11px] text-[#654329] font-semibold hover:underline block py-1"
                        >
                          Xem tất cả {group.label.toLowerCase()} →
                        </Link>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* ── Mobile Drawer (Shows all category groups & subcategories) ── */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#E7DCce] shadow-xl max-h-[80vh] overflow-y-auto">
          <div className="p-4 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-[#654329] px-2 mb-2">
              DANH MỤC NỘI THẤT
            </div>
            {CATEGORY_NAV_GROUPS.map((group) => {
              const hasDropdown = group.items && group.items.length > 0;
              const isExpanded = mobileActiveCategory === group.label;

              return (
                <div key={group.label} className="border-b border-[#F7F3ED] pb-1">
                  <div className="flex items-center justify-between">
                    <Link
                      to={group.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex-1 py-2 px-2 text-sm font-semibold text-[#29231F] hover:text-[#654329]"
                    >
                      {group.label}
                    </Link>
                    {hasDropdown && (
                      <button
                        onClick={() => setMobileActiveCategory(isExpanded ? null : group.label)}
                        className="p-2 text-[#877B70] hover:text-[#654329]"
                        aria-label="Mở danh mục con"
                      >
                        <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                    )}
                  </div>

                  {hasDropdown && isExpanded && (
                    <div className="pl-4 pb-2 space-y-1 bg-[#FAF8F5] rounded-md">
                      {group.items?.map((item) => (
                        <Link
                          key={item.categoryId}
                          to={item.path}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block py-1.5 px-3 text-xs text-[#6E665E] hover:text-[#654329] hover:font-semibold"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            <div className="pt-4 space-y-2">
              <a
                href={getTelHref()}
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-[#654329] text-white font-medium rounded-md text-xs"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Hotline: {CONTACT_INFO.hotline.display}</span>
              </a>
              <a
                href={getZaloHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-[#0068FF] text-white font-medium rounded-md text-xs"
              >
                <span>Nhắn tin Zalo tư vấn</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </header>
  );
};

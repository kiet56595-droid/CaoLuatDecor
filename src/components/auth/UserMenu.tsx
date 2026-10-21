import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, ChevronDown, LogOut, Settings, ShoppingBag, Shield, Store,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface UserMenuProps {
  onOpenAuth: () => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({ onOpenAuth }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Đóng khi click ra ngoài
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate('/');
  };

  // Lấy chữ cái đầu của tên
  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).slice(-2).join('').toUpperCase()
    : 'U';

  const roleLabel: Record<string, { label: string; color: string }> = {
    CUSTOMER: { label: 'Khách hàng', color: 'text-blue-600 bg-blue-50' },
    SHOP_OWNER: { label: 'Chủ shop', color: 'text-emerald-600 bg-emerald-50' },
    ADMIN: { label: 'Quản trị viên', color: 'text-[#654329] bg-[#F7F3ED]' },
  };

  if (!isAuthenticated || !user) {
    return (
      <button
        id="btn-open-auth-modal"
        onClick={onOpenAuth}
        className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-[#654329] hover:bg-[#F7F3ED] rounded-md transition-all border border-[#D5C3AF] hover:border-[#654329]"
      >
        <User className="w-4 h-4" />
        <span>Đăng nhập</span>
      </button>
    );
  }

  const menuItems = [
    {
      icon: <User className="w-4 h-4" />,
      label: 'Hồ sơ cá nhân',
      onClick: () => { setOpen(false); navigate('/tai-khoan'); },
      show: user.role === 'CUSTOMER',
    },
    {
      icon: <ShoppingBag className="w-4 h-4" />,
      label: 'Lịch sử báo giá',
      onClick: () => { setOpen(false); navigate('/tai-khoan/bao-gia'); },
      show: user.role === 'CUSTOMER',
    },
    {
      icon: <Store className="w-4 h-4" />,
      label: 'Quản lý Shop',
      onClick: () => { setOpen(false); navigate('/shop/dashboard'); },
      show: user.role === 'SHOP_OWNER',
    },
    {
      icon: <Shield className="w-4 h-4" />,
      label: 'Bảng điều khiển Admin',
      onClick: () => { setOpen(false); navigate('/admin/dashboard'); },
      show: user.role === 'ADMIN',
    },
    {
      icon: <Settings className="w-4 h-4" />,
      label: 'Cài đặt tài khoản',
      onClick: () => { setOpen(false); navigate('/tai-khoan/cai-dat'); },
      show: true,
    },
  ].filter((item) => item.show);

  const roleInfo = roleLabel[user.role] ?? { label: user.role, color: 'text-gray-600 bg-gray-100' };

  return (
    <div className="relative" ref={menuRef}>
      <button
        id="btn-user-menu"
        onClick={() => setOpen(!open)}
        aria-haspopup="true"
        aria-expanded={open}
        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[#F7F3ED] transition-colors"
      >
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#654329] to-[#8B5E3C] flex items-center justify-center text-white text-xs font-bold shadow-sm">
          {initials}
        </div>
        <div className="hidden sm:flex flex-col items-start">
          <span className="text-xs font-semibold text-[#29231F] leading-tight max-w-[100px] truncate">
            {user.name}
          </span>
          <span className={`text-[10px] font-medium px-1.5 rounded-full ${roleInfo.color}`}>
            {roleInfo.label}
          </span>
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#877B70] transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-[#E7DCce] rounded-xl shadow-xl z-50 overflow-hidden animate-fadeIn">
          {/* User info header */}
          <div className="px-4 py-3 bg-[#FAF8F5] border-b border-[#E7DCce]">
            <p className="font-semibold text-sm text-[#29231F] truncate">{user.name}</p>
            <p className="text-xs text-[#877B70] truncate">{user.email}</p>
            <span className={`inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${roleInfo.color}`}>
              {roleInfo.label}
            </span>
          </div>

          {/* Menu items */}
          <div className="py-1">
            {menuItems.map((item, idx) => (
              <button
                key={idx}
                onClick={item.onClick}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#473E37] hover:bg-[#FAF8F5] hover:text-[#654329] transition-colors text-left"
              >
                <span className="text-[#B5A090]">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>

          {/* Logout */}
          <div className="border-t border-[#E7DCce] py-1">
            <button
              id="btn-logout"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

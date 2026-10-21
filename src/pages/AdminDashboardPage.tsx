import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Package, FolderOpen, MessageSquare,
  TrendingUp, ShieldCheck, Settings, Bell, Eye, Trash2, CheckCircle,
  XCircle, Clock, BarChart3, ArrowUpRight, ArrowDownRight, Store,
  LogOut, ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// ── Types ──────────────────────────────────────────────────────
type AdminTab = 'overview' | 'users' | 'products' | 'quotes' | 'settings';

// ── Mock stats ─────────────────────────────────────────────────
const STATS = [
  { label: 'Người dùng', value: '1,284', change: +12.5, icon: Users, color: 'from-blue-500 to-blue-600' },
  { label: 'Sản phẩm', value: '348', change: +5.2, icon: Package, color: 'from-emerald-500 to-emerald-600' },
  { label: 'Yêu cầu báo giá', value: '93', change: +28.4, icon: MessageSquare, color: 'from-amber-500 to-amber-600' },
  { label: 'Doanh thu (Tháng)', value: '₫ 285M', change: -3.1, icon: TrendingUp, color: 'from-[#654329] to-[#8B5E3C]' },
];

const MOCK_USERS = [
  { id: '1', name: 'Nguyễn Thị Lan', email: 'lan@gmail.com', role: 'CUSTOMER', status: 'ACTIVE', joined: '12/10/2026' },
  { id: '2', name: 'Trần Văn Hùng', email: 'hung@gmail.com', role: 'CUSTOMER', status: 'ACTIVE', joined: '08/10/2026' },
  { id: '3', name: 'Cao Minh Xưởng', email: 'xuong@gmail.com', role: 'SHOP_OWNER', status: 'PENDING_APPROVAL', joined: '05/10/2026' },
  { id: '4', name: 'Lê Thị Mai', email: 'mai@gmail.com', role: 'CUSTOMER', status: 'BANNED', joined: '01/09/2026' },
  { id: '5', name: 'Phạm Bảo Long', email: 'long@gmail.com', role: 'CUSTOMER', status: 'ACTIVE', joined: '20/08/2026' },
];

const MOCK_QUOTES = [
  { id: 'Q001', customer: 'Nguyễn Thị Lan', product: 'Sofa Da Ý Milano', status: 'PENDING', date: '21/10/2026' },
  { id: 'Q002', customer: 'Trần Văn Hùng', product: 'Tủ bếp Acrylic', status: 'RESPONDED', date: '20/10/2026' },
  { id: 'Q003', customer: 'Phạm Bảo Long', product: 'Giường gỗ sồi', status: 'CLOSED', date: '18/10/2026' },
  { id: 'Q004', customer: 'Võ Thị Hoa', product: 'Bàn ăn mặt đá', status: 'PENDING', date: '17/10/2026' },
];

const RECENT_ACTIVITY = [
  { action: 'Khách hàng mới đăng ký', name: 'Nguyễn Thị Lan', time: '5 phút trước', type: 'user' },
  { action: 'Yêu cầu báo giá mới', name: 'Sofa Milano — Trần Văn Hùng', time: '23 phút trước', type: 'quote' },
  { action: 'Chủ shop chờ duyệt', name: 'Cao Minh Xưởng', time: '1 giờ trước', type: 'shop' },
  { action: 'Sản phẩm hết hàng', name: 'Kệ TV gỗ óc chó', time: '2 giờ trước', type: 'product' },
];

// ── Helpers ────────────────────────────────────────────────────
const roleColors: Record<string, string> = {
  CUSTOMER: 'bg-blue-50 text-blue-700',
  SHOP_OWNER: 'bg-emerald-50 text-emerald-700',
  ADMIN: 'bg-amber-50 text-amber-700',
};
const statusColors: Record<string, string> = {
  ACTIVE: 'bg-green-50 text-green-700',
  BANNED: 'bg-red-50 text-red-700',
  PENDING_APPROVAL: 'bg-orange-50 text-orange-700',
};
const statusLabels: Record<string, string> = {
  ACTIVE: 'Hoạt động',
  BANNED: 'Đã khóa',
  PENDING_APPROVAL: 'Chờ duyệt',
};
const roleLabels: Record<string, string> = {
  CUSTOMER: 'Khách hàng',
  SHOP_OWNER: 'Chủ shop',
  ADMIN: 'Admin',
};
const quoteStatusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  PENDING: { label: 'Chờ xử lý', color: 'bg-amber-50 text-amber-700', icon: <Clock className="w-3 h-3" /> },
  RESPONDED: { label: 'Đã phản hồi', color: 'bg-green-50 text-green-700', icon: <CheckCircle className="w-3 h-3" /> },
  CLOSED: { label: 'Đã đóng', color: 'bg-gray-100 text-gray-500', icon: <XCircle className="w-3 h-3" /> },
};

// ── Sidebar Nav ────────────────────────────────────────────────
const NAV_ITEMS: { tab: AdminTab; label: string; icon: React.FC<{ className?: string }> }[] = [
  { tab: 'overview', label: 'Tổng quan', icon: LayoutDashboard },
  { tab: 'users', label: 'Người dùng', icon: Users },
  { tab: 'products', label: 'Sản phẩm', icon: Package },
  { tab: 'quotes', label: 'Báo giá', icon: MessageSquare },
  { tab: 'settings', label: 'Cài đặt', icon: Settings },
];

// ─────────────────────────────────────────────────────────────────
export const AdminDashboardPage: React.FC = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
        <div className="w-10 h-10 border-4 border-[#654329] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* ── Sidebar ── */}
      <aside
        className={`${sidebarOpen ? 'w-60' : 'w-16'} bg-[#1C1714] text-white flex flex-col transition-all duration-300 shrink-0 sticky top-0 h-screen overflow-hidden`}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-[#654329] flex items-center justify-center font-serif font-bold text-sm text-[#DFC7A7] shrink-0">
            CL
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <p className="font-bold text-sm leading-tight whitespace-nowrap">CAO LUẬT DECOR</p>
              <p className="text-[10px] text-white/40 whitespace-nowrap">Admin Panel</p>
            </div>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4 space-y-0.5 px-2">
          {NAV_ITEMS.map(({ tab, label, icon: Icon }) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab
                  ? 'bg-[#654329] text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
              title={!sidebarOpen ? label : undefined}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {sidebarOpen && <span className="whitespace-nowrap">{label}</span>}
            </button>
          ))}
        </nav>

        {/* User info + logout */}
        <div className="border-t border-white/10 p-3 space-y-2">
          {sidebarOpen && (
            <div className="px-2 py-1">
              <p className="text-xs font-semibold text-white truncate">{user.name}</p>
              <p className="text-[10px] text-white/40">Quản trị viên</p>
            </div>
          )}
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/60 hover:text-red-400 hover:bg-red-900/20 transition-all"
            title="Đăng xuất"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {sidebarOpen && <span>Đăng xuất</span>}
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-400 hover:text-gray-700 transition-colors"
              aria-label="Toggle sidebar"
            >
              <BarChart3 className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base font-semibold text-gray-800">
                {NAV_ITEMS.find((n) => n.tab === activeTab)?.label}
              </h1>
              <p className="text-xs text-gray-400">
                {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-all">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#654329] to-[#8B5E3C] flex items-center justify-center text-white text-xs font-bold">
                AD
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">{user.name}</span>
            </div>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 p-6 overflow-auto">

          {/* ── OVERVIEW TAB ── */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {STATS.map((s) => (
                  <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-start gap-4">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shrink-0`}>
                      <s.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium">{s.label}</p>
                      <p className="text-xl font-bold text-gray-800 mt-0.5">{s.value}</p>
                      <div className={`flex items-center gap-1 text-xs font-semibold mt-1 ${s.change >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {s.change >= 0
                          ? <ArrowUpRight className="w-3.5 h-3.5" />
                          : <ArrowDownRight className="w-3.5 h-3.5" />}
                        {Math.abs(s.change)}% tháng này
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent activity */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800">Hoạt động gần đây</h3>
                    <span className="text-xs text-gray-400">Hôm nay</span>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {RECENT_ACTIVITY.map((a, i) => (
                      <div key={i} className="px-5 py-3.5 flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          a.type === 'user' ? 'bg-blue-100' :
                          a.type === 'quote' ? 'bg-amber-100' :
                          a.type === 'shop' ? 'bg-emerald-100' : 'bg-red-100'
                        }`}>
                          {a.type === 'user' && <Users className="w-3.5 h-3.5 text-blue-600" />}
                          {a.type === 'quote' && <MessageSquare className="w-3.5 h-3.5 text-amber-600" />}
                          {a.type === 'shop' && <Store className="w-3.5 h-3.5 text-emerald-600" />}
                          {a.type === 'product' && <Package className="w-3.5 h-3.5 text-red-600" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-700 font-medium truncate">{a.action}</p>
                          <p className="text-xs text-gray-400 truncate">{a.name}</p>
                        </div>
                        <span className="text-xs text-gray-400 whitespace-nowrap shrink-0">{a.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick actions */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                  <div className="px-5 py-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-800">Thao tác nhanh</h3>
                  </div>
                  <div className="p-4 space-y-2">
                    {[
                      { label: 'Duyệt chủ shop mới', color: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100', count: 1 },
                      { label: 'Xử lý báo giá chờ', color: 'bg-amber-50 text-amber-700 hover:bg-amber-100', count: 2 },
                      { label: 'Thêm sản phẩm mới', color: 'bg-blue-50 text-blue-700 hover:bg-blue-100', count: null },
                      { label: 'Xuất báo cáo tháng', color: 'bg-purple-50 text-purple-700 hover:bg-purple-100', count: null },
                    ].map((a) => (
                      <button
                        key={a.label}
                        onClick={() => a.count && setActiveTab('users')}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all ${a.color}`}
                      >
                        <span>{a.label}</span>
                        <div className="flex items-center gap-2">
                          {a.count && (
                            <span className="bg-white text-red-500 text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                              {a.count}
                            </span>
                          )}
                          <ChevronRight className="w-3.5 h-3.5" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── USERS TAB ── */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">Quản lý người dùng</h3>
                <button className="bg-[#654329] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#533722] transition-colors flex items-center gap-2">
                  <Users className="w-4 h-4" /> Tạo tài khoản mới
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-3 text-left">Người dùng</th>
                      <th className="px-6 py-3 text-left">Vai trò</th>
                      <th className="px-6 py-3 text-left">Trạng thái</th>
                      <th className="px-6 py-3 text-left">Ngày tham gia</th>
                      <th className="px-6 py-3 text-left">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {MOCK_USERS.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#654329] to-[#8B5E3C] flex items-center justify-center text-white text-xs font-bold shrink-0">
                              {u.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{u.name}</p>
                              <p className="text-xs text-gray-400">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleColors[u.role]}`}>
                            {roleLabels[u.role]}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[u.status]}`}>
                            {statusLabels[u.status]}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500">{u.joined}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Xem">
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            {u.status === 'PENDING_APPROVAL' && (
                              <button className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all" title="Duyệt">
                                <CheckCircle className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {u.status !== 'BANNED' && (
                              <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Khóa">
                                <XCircle className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Xóa">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── PRODUCTS TAB ── */}
          {activeTab === 'products' && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-800">Quản lý sản phẩm</h3>
                <button className="bg-[#654329] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#533722] transition-colors flex items-center gap-2">
                  <Package className="w-4 h-4" /> Thêm sản phẩm
                </button>
              </div>
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Package className="w-12 h-12 text-gray-300 mb-4" />
                <p className="text-gray-500 font-medium">Quản lý toàn bộ sản phẩm trong hệ thống</p>
                <p className="text-gray-400 text-sm mt-1">Tích hợp dữ liệu từ API sản phẩm hiện có</p>
                <a
                  href="/san-pham"
                  className="mt-4 text-sm text-[#654329] font-medium hover:underline flex items-center gap-1"
                >
                  Xem trang sản phẩm <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}

          {/* ── QUOTES TAB ── */}
          {activeTab === 'quotes' && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800">Quản lý yêu cầu báo giá</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-3 text-left">Mã YC</th>
                      <th className="px-6 py-3 text-left">Khách hàng</th>
                      <th className="px-6 py-3 text-left">Sản phẩm</th>
                      <th className="px-6 py-3 text-left">Trạng thái</th>
                      <th className="px-6 py-3 text-left">Ngày gửi</th>
                      <th className="px-6 py-3 text-left">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {MOCK_QUOTES.map((q) => {
                      const qs = quoteStatusConfig[q.status];
                      return (
                        <tr key={q.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 font-mono text-xs text-gray-500">{q.id}</td>
                          <td className="px-6 py-4 font-medium text-gray-800">{q.customer}</td>
                          <td className="px-6 py-4 text-gray-600">{q.product}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${qs.color}`}>
                              {qs.icon} {qs.label}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-500">{q.date}</td>
                          <td className="px-6 py-4">
                            <button className="text-xs text-[#654329] font-medium hover:underline flex items-center gap-1">
                              Xem chi tiết <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── SETTINGS TAB ── */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl space-y-6">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#654329]" /> Cấu hình hệ thống
                </h3>
                <div className="space-y-4">
                  {[
                    { label: 'Cho phép đăng ký tự do', desc: 'Khách hàng có thể tự tạo tài khoản', enabled: true },
                    { label: 'Duyệt chủ shop thủ công', desc: 'Admin cần duyệt trước khi cho phép', enabled: true },
                    { label: 'Thông báo qua email', desc: 'Gửi email khi có báo giá mới', enabled: false },
                    { label: 'Bảo trì hệ thống', desc: 'Tắt website để bảo trì', enabled: false },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{item.label}</p>
                        <p className="text-xs text-gray-400">{item.desc}</p>
                      </div>
                      <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${item.enabled ? 'bg-[#654329]' : 'bg-gray-200'}`}>
                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${item.enabled ? 'left-5' : 'left-0.5'}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-[#654329]" /> Thông tin Admin
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-500">Tên đăng nhập</span>
                    <span className="font-medium text-gray-800">{user.name}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-500">Email</span>
                    <span className="font-medium text-gray-800">{user.email}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-500">Vai trò</span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700">
                      <ShieldCheck className="w-3 h-3" /> Quản trị viên
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-500">Trạng thái</span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600">
                      <CheckCircle className="w-3 h-3" /> Đang hoạt động
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

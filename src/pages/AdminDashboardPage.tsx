import React, { useState, useEffect, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Package, ShieldCheck, Bell, Eye, Trash2, CheckCircle,
  XCircle, Clock, BarChart3, ArrowUpRight, Store,
  LogOut, ChevronRight, RefreshCw, Plus, Check, MessageSquare
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DBProfile, DBQuoteRequest, Product, UserRole, UserStatus } from '../types';
import {
  fetchProfiles,
  updateProfileRole,
  updateProfileStatus,
  deleteProfile,
  fetchQuoteRequests,
  updateQuoteRequestStatus,
  deleteQuoteRequest,
  fetchProductsFromDB,
  toggleProductStockInDB,
  deleteProductInDB,
  seedProductsToSupabase,
} from '../lib/supabase';

type AdminTab = 'overview' | 'users' | 'products' | 'quotes' | 'settings';

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
  SHOP_OWNER: 'Chủ xưởng/Shop',
  ADMIN: 'Quản trị viên',
};

const quoteStatusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: 'Chờ xử lý', color: 'bg-amber-50 text-amber-700', icon: <Clock className="w-3 h-3" /> },
  contacted: { label: 'Đã liên hệ', color: 'bg-blue-50 text-blue-700', icon: <CheckCircle className="w-3 h-3" /> },
  completed: { label: 'Đã hoàn thành', color: 'bg-green-50 text-green-700', icon: <CheckCircle className="w-3 h-3" /> },
  cancelled: { label: 'Đã hủy', color: 'bg-gray-100 text-gray-500', icon: <XCircle className="w-3 h-3" /> },
};

const NAV_ITEMS: { tab: AdminTab; label: string; icon: React.FC<{ className?: string }> }[] = [
  { tab: 'overview', label: 'Tổng quan', icon: LayoutDashboard },
  { tab: 'users', label: 'Người dùng', icon: Users },
  { tab: 'products', label: 'Sản phẩm', icon: Package },
  { tab: 'quotes', label: 'Báo giá', icon: MessageSquare },
  { tab: 'settings', label: 'Cài đặt', icon: ShieldCheck },
];

export const AdminDashboardPage: React.FC = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Dữ liệu từ Supabase Database
  const [profiles, setProfiles] = useState<DBProfile[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [quotes, setQuotes] = useState<DBQuoteRequest[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const loadAllData = useCallback(async () => {
    setDataLoading(true);
    try {
      const [uData, pData, qData] = await Promise.all([
        fetchProfiles(),
        fetchProductsFromDB(),
        fetchQuoteRequests(),
      ]);
      setProfiles(uData);
      setProducts(pData);
      setQuotes(qData);
    } catch (err) {
      console.warn('Lỗi tải dữ liệu Supabase:', err);
    } finally {
      setDataLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'ADMIN') {
      loadAllData();
    }
  }, [isAuthenticated, user, loadAllData]);

  // Hành động với User
  const handleToggleUserStatus = async (targetUser: DBProfile) => {
    const nextStatus: UserStatus =
      targetUser.status === 'ACTIVE' ? 'BANNED' : 'ACTIVE';
    const res = await updateProfileStatus(targetUser.id, nextStatus);
    if (res.success) {
      setProfiles((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, status: nextStatus } : u))
      );
      showNotice(`Đã chuyển trạng thái của ${targetUser.name} sang ${statusLabels[nextStatus]}`);
    }
  };

  const handleApproveShop = async (targetUser: DBProfile) => {
    const res = await updateProfileStatus(targetUser.id, 'ACTIVE');
    if (res.success) {
      setProfiles((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, status: 'ACTIVE' } : u))
      );
      showNotice(`Đã phê duyệt xưởng cho ${targetUser.name}!`);
    }
  };

  const handleChangeRole = async (targetUser: DBProfile, newRole: UserRole) => {
    const res = await updateProfileRole(targetUser.id, newRole);
    if (res.success) {
      setProfiles((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, role: newRole } : u))
      );
      showNotice(`Đã đổi vai trò ${targetUser.name} thành ${roleLabels[newRole]}`);
    }
  };

  const handleDeleteUser = async (targetUser: DBProfile) => {
    if (!window.confirm(`Bạn có chắc muốn xóa tài khoản ${targetUser.name}?`)) return;
    const res = await deleteProfile(targetUser.id);
    if (res.success) {
      setProfiles((prev) => prev.filter((u) => u.id !== targetUser.id));
      showNotice(`Đã xóa tài khoản ${targetUser.name}`);
    }
  };

  // Hành động với Báo giá
  const handleUpdateQuoteStatus = async (quoteId: string, newStatus: string) => {
    const res = await updateQuoteRequestStatus(quoteId, newStatus);
    if (res.success) {
      setQuotes((prev) =>
        prev.map((q) => (q.id === quoteId ? { ...q, status: newStatus } : q))
      );
      showNotice('Đã cập nhật trạng thái yêu cầu báo giá');
    }
  };

  const handleDeleteQuote = async (quoteId: string) => {
    if (!window.confirm('Xóa yêu cầu báo giá này?')) return;
    const res = await deleteQuoteRequest(quoteId);
    if (res.success) {
      setQuotes((prev) => prev.filter((q) => q.id !== quoteId));
      showNotice('Đã xóa yêu cầu báo giá');
    }
  };

  // Hành động với Sản phẩm
  const handleToggleProductStock = async (product: Product) => {
    const res = await toggleProductStockInDB(product.id, !!product.inStock);
    if (res.success) {
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, inStock: !p.inStock } : p))
      );
      showNotice(`Đã cập nhật tồn kho cho "${product.name}"`);
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    if (!window.confirm(`Xóa sản phẩm "${product.name}" khỏi cơ sở dữ liệu?`)) return;
    const res = await deleteProductInDB(product.id);
    if (res.success) {
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      showNotice(`Đã xóa sản phẩm "${product.name}"`);
    }
  };

  const handleSeedProducts = async () => {
    if (!window.confirm('Nạp toàn bộ danh mục sản phẩm mẫu lên Supabase Database?')) return;
    setSeeding(true);
    const res = await seedProductsToSupabase();
    setSeeding(false);
    if (res.success) {
      showNotice(`Đồng bộ thành công ${res.count} sản phẩm lên Database!`);
      loadAllData();
    } else {
      showNotice(`Lỗi: ${res.error}`);
    }
  };

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

  // Thống kê thực tế từ Supabase
  const pendingQuotesCount = quotes.filter((q) => q.status === 'pending').length;
  const pendingShopsCount = profiles.filter((u) => u.status === 'PENDING_APPROVAL').length;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Toast thông báo */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1C1714] text-white px-5 py-3 rounded-xl shadow-xl border border-white/20 text-sm flex items-center gap-3 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-400" />
          {notification}
        </div>
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-[#1C1714] text-white flex flex-col transition-all duration-300 shrink-0 sticky top-0 h-screen overflow-hidden z-40`}
      >
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <div className="w-9 h-9 rounded-lg bg-[#654329] flex items-center justify-center font-serif font-bold text-sm text-[#DFC7A7] shrink-0">
            CL
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <p className="font-bold text-sm leading-tight whitespace-nowrap">CAO LUẬT DECOR</p>
              <p className="text-[10px] text-white/40 whitespace-nowrap">Hệ Thống Quản Trị CSDL</p>
            </div>
          )}
        </div>

        <nav className="flex-1 py-4 space-y-1 px-3">
          {NAV_ITEMS.map(({ tab, label, icon: Icon }) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab
                  ? 'bg-[#654329] text-white shadow-sm'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {sidebarOpen && (
                <span className="flex-1 text-left whitespace-nowrap flex items-center justify-between">
                  {label}
                  {tab === 'quotes' && pendingQuotesCount > 0 && (
                    <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                      {pendingQuotesCount}
                    </span>
                  )}
                  {tab === 'users' && pendingShopsCount > 0 && (
                    <span className="bg-orange-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                      {pendingShopsCount}
                    </span>
                  )}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="border-t border-white/10 p-3 space-y-2">
          {sidebarOpen && (
            <div className="px-2 py-1">
              <p className="text-xs font-semibold text-white truncate">{user.name}</p>
              <p className="text-[10px] text-white/40">Quản trị viên CSDL</p>
            </div>
          )}
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/60 hover:text-red-400 hover:bg-red-900/20 transition-all"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {sidebarOpen && <span>Đăng xuất</span>}
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-400 hover:text-gray-700 transition-colors p-1"
            >
              <BarChart3 className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base font-semibold text-gray-800">
                {NAV_ITEMS.find((n) => n.tab === activeTab)?.label}
              </h1>
              <p className="text-xs text-gray-400">Dữ liệu thời gian thực từ Supabase PostgreSQL</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadAllData}
              disabled={dataLoading}
              className="p-2 text-gray-500 hover:text-[#654329] hover:bg-gray-100 rounded-lg transition-all flex items-center gap-1.5 text-xs font-medium"
              title="Làm mới dữ liệu từ Database"
            >
              <RefreshCw className={`w-4 h-4 ${dataLoading ? 'animate-spin text-[#654329]' : ''}`} />
              <span className="hidden sm:inline">Làm mới CSDL</span>
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#654329] to-[#8B5E3C] flex items-center justify-center text-white text-xs font-bold">
                AD
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">{user.name}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          {/* ── TAB 1: OVERVIEW ── */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Người dùng (Profiles)</p>
                    <p className="text-2xl font-bold text-gray-800 mt-0.5">{profiles.length}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {profiles.filter((u) => u.role === 'SHOP_OWNER').length} Chủ xưởng / {profiles.filter((u) => u.role === 'CUSTOMER').length} Khách hàng
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shrink-0">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Sản phẩm (Products)</p>
                    <p className="text-2xl font-bold text-gray-800 mt-0.5">{products.length}</p>
                    <p className="text-xs text-emerald-600 font-semibold mt-1">
                      {products.filter((p) => p.inStock).length} Đang bán trên sàn
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Yêu cầu báo giá</p>
                    <p className="text-2xl font-bold text-gray-800 mt-0.5">{quotes.length}</p>
                    <p className="text-xs text-amber-600 font-semibold mt-1">
                      {pendingQuotesCount} Yêu cầu chờ xử lý
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#654329] to-[#8B5E3C] flex items-center justify-center shrink-0">
                    <Store className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Xưởng chờ duyệt</p>
                    <p className="text-2xl font-bold text-gray-800 mt-0.5">{pendingShopsCount}</p>
                    <button
                      onClick={() => setActiveTab('users')}
                      className="text-xs text-[#654329] font-semibold mt-1 hover:underline flex items-center gap-1"
                    >
                      Kiểm duyệt ngay <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Danh sách báo giá mới nhất */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-800">Yêu cầu báo giá mới tiếp nhận từ khách</h3>
                  <button
                    onClick={() => setActiveTab('quotes')}
                    className="text-xs text-[#654329] font-medium hover:underline flex items-center gap-1"
                  >
                    Xem tất cả ({quotes.length}) <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                {quotes.length === 0 ? (
                  <p className="text-center py-8 text-gray-400 text-sm">Chưa có yêu cầu báo giá nào trong database.</p>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {quotes.slice(0, 5).map((q) => {
                      const qs = quoteStatusConfig[q.status] || quoteStatusConfig.pending;
                      return (
                        <div key={q.id} className="py-3 flex items-center justify-between gap-4">
                          <div>
                            <p className="text-sm font-semibold text-gray-800">
                              {q.customer_name} — <span className="text-blue-600">{q.phone}</span>
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              Sản phẩm: <span className="font-medium text-[#654329]">{q.product_name}</span>
                              {q.note && ` — "${q.note}"`}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${qs.color}`}>
                              {qs.icon} {qs.label}
                            </span>
                            <span className="text-xs text-gray-400">
                              {new Date(q.created_at).toLocaleDateString('vi-VN')}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── TAB 2: USERS (PROFILES) ── */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">Quản lý Tài khoản (Bảng `profiles`)</h3>
                  <p className="text-xs text-gray-400">Quản lý phân quyền, duyệt đối tác xưởng và khóa tài khoản</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-3 text-left">Người dùng</th>
                      <th className="px-6 py-3 text-left">Số điện thoại</th>
                      <th className="px-6 py-3 text-left">Vai trò (Role)</th>
                      <th className="px-6 py-3 text-left">Trạng thái (Status)</th>
                      <th className="px-6 py-3 text-left">Ngày tạo</th>
                      <th className="px-6 py-3 text-left">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {profiles.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#654329] to-[#8B5E3C] flex items-center justify-center text-white text-xs font-bold shrink-0">
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{u.name}</p>
                              <p className="text-xs text-gray-400">{u.email || 'Chưa có email'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{u.phone || '—'}</td>
                        <td className="px-6 py-4">
                          <select
                            value={u.role}
                            onChange={(e) => handleChangeRole(u, e.target.value as UserRole)}
                            className="text-xs font-semibold px-2 py-1 rounded border border-gray-200 bg-white"
                          >
                            <option value="CUSTOMER">CUSTOMER (Khách)</option>
                            <option value="SHOP_OWNER">SHOP_OWNER (Xưởng)</option>
                            <option value="ADMIN">ADMIN (Quản trị)</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[u.status] || 'bg-gray-100 text-gray-600'}`}>
                            {statusLabels[u.status] || u.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-400 text-xs">
                          {new Date(u.created_at).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {u.status === 'PENDING_APPROVAL' && (
                              <button
                                onClick={() => handleApproveShop(u)}
                                className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-all"
                                title="Phê duyệt đối tác xưởng"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleToggleUserStatus(u)}
                              className={`p-1.5 rounded-lg transition-all ${
                                u.status === 'BANNED'
                                  ? 'text-green-600 hover:bg-green-50'
                                  : 'text-orange-500 hover:bg-orange-50'
                              }`}
                              title={u.status === 'BANNED' ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
                            >
                              {u.status === 'BANNED' ? <Check className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                              title="Xóa hồ sơ"
                            >
                              <Trash2 className="w-4 h-4" />
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

          {/* ── TAB 3: PRODUCTS ── */}
          {activeTab === 'products' && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-gray-800">Quản lý Sản phẩm (Bảng `products`)</h3>
                  <p className="text-xs text-gray-400">Toàn bộ sản phẩm được đồng bộ trong database PostgreSQL</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSeedProducts}
                    disabled={seeding}
                    className="bg-[#FAF8F5] border border-[#654329] text-[#654329] text-xs font-semibold px-3 py-2 rounded-lg hover:bg-[#F7F3ED] transition-colors flex items-center gap-1.5"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${seeding ? 'animate-spin' : ''}`} />
                    {seeding ? 'Đang nạp...' : 'Nạp dữ liệu mẫu lên Supabase'}
                  </button>
                  <a
                    href="/san-pham"
                    target="_blank"
                    className="bg-[#654329] text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-[#533722] transition-colors flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" /> Xem ngoài website
                  </a>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-3 text-left">Sản phẩm</th>
                      <th className="px-6 py-3 text-left">Mã SKU</th>
                      <th className="px-6 py-3 text-left">Danh mục</th>
                      <th className="px-6 py-3 text-left">Giá niêm yết</th>
                      <th className="px-6 py-3 text-left">Tình trạng kho</th>
                      <th className="px-6 py-3 text-left">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.images?.[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=100&q=80'}
                              alt={p.name}
                              className="w-10 h-10 object-cover rounded-lg border border-gray-100 shrink-0"
                            />
                            <div>
                              <p className="font-semibold text-gray-800">{p.name}</p>
                              <p className="text-xs text-gray-400">{p.dimensions || 'Kích thước tiêu chuẩn'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-gray-600">{p.code}</td>
                        <td className="px-6 py-4 text-gray-600 text-xs">{p.categoryName || p.categoryId}</td>
                        <td className="px-6 py-4 font-semibold text-[#654329]">
                          {p.price ? `${p.price.toLocaleString('vi-VN')} đ` : 'Liên hệ'}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleToggleProductStock(p)}
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                              p.inStock
                                ? 'bg-green-50 text-green-700 hover:bg-green-100'
                                : 'bg-red-50 text-red-600 hover:bg-red-100'
                            }`}
                          >
                            {p.inStock ? '✓ Còn hàng' : '✕ Hết hàng'}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleDeleteProduct(p)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Xóa sản phẩm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── TAB 4: QUOTES ── */}
          {activeTab === 'quotes' && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">Yêu cầu Báo giá (Bảng `quote_requests`)</h3>
                  <p className="text-xs text-gray-400">Danh sách khách hàng điền form yêu cầu tư vấn trên website</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-3 text-left">Khách hàng</th>
                      <th className="px-6 py-3 text-left">Số điện thoại</th>
                      <th className="px-6 py-3 text-left">Sản phẩm quan tâm</th>
                      <th className="px-6 py-3 text-left">Ghi chú</th>
                      <th className="px-6 py-3 text-left">Trạng thái</th>
                      <th className="px-6 py-3 text-left">Ngày gửi</th>
                      <th className="px-6 py-3 text-left">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {quotes.map((q) => {
                      const qs = quoteStatusConfig[q.status] || quoteStatusConfig.pending;
                      return (
                        <tr key={q.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 font-semibold text-gray-800">{q.customer_name}</td>
                          <td className="px-6 py-4">
                            <a
                              href={`tel:${q.phone}`}
                              className="font-mono text-blue-600 hover:underline font-semibold"
                            >
                              {q.phone}
                            </a>
                          </td>
                          <td className="px-6 py-4 text-[#654329] font-medium">{q.product_name}</td>
                          <td className="px-6 py-4 text-xs text-gray-500 max-w-xs truncate">{q.note || '—'}</td>
                          <td className="px-6 py-4">
                            <select
                              value={q.status}
                              onChange={(e) => handleUpdateQuoteStatus(q.id, e.target.value)}
                              className={`text-xs font-semibold px-2.5 py-1 rounded border border-gray-200 ${qs.color}`}
                            >
                              <option value="pending">Chờ xử lý</option>
                              <option value="contacted">Đã liên hệ</option>
                              <option value="completed">Đã hoàn thành</option>
                              <option value="cancelled">Đã hủy</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 text-xs text-gray-400">
                            {new Date(q.created_at).toLocaleDateString('vi-VN')}
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleDeleteQuote(q.id)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                              title="Xóa yêu cầu"
                            >
                              <Trash2 className="w-4 h-4" />
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

          {/* ── TAB 5: SETTINGS ── */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl space-y-6">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#654329]" /> Kết nối Supabase PostgreSQL
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-500">Supabase Project URL</span>
                    <span className="font-mono text-xs text-gray-800">https://beogjxnmmglnlgurplfn.supabase.co</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-500">Trạng thái kết nối</span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600">
                      <CheckCircle className="w-3.5 h-3.5" /> Đã kết nối thời gian thực
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-500">Quyền hạn tài khoản</span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700">
                      ADMIN (Toàn quyền)
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

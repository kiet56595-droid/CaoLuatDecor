import React, { useState, useEffect, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, MessageSquare, Star,
  Plus, Eye, Edit, ToggleLeft, ToggleRight,
  Bell, LogOut, Store, CheckCircle, Clock, XCircle,
  ArrowUpRight, RefreshCw, Trash2, Check, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DBQuoteRequest, DBReview, Product } from '../types';
import {
  fetchQuoteRequests,
  updateQuoteRequestStatus,
  fetchProductsFromDB,
  toggleProductStockInDB,
  createProductInDB,
  deleteProductInDB,
  fetchReviewsFromDB,
  seedProductsToSupabase,
} from '../lib/supabase';

type ShopTab = 'overview' | 'products' | 'quotes' | 'reviews';

const quoteStatusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: 'Chờ xử lý', color: 'bg-amber-50 text-amber-700', icon: <Clock className="w-3 h-3" /> },
  contacted: { label: 'Đã liên hệ', color: 'bg-blue-50 text-blue-700', icon: <CheckCircle className="w-3 h-3" /> },
  completed: { label: 'Đã chốt', color: 'bg-green-50 text-green-700', icon: <CheckCircle className="w-3 h-3" /> },
  cancelled: { label: 'Đã hủy', color: 'bg-gray-100 text-gray-500', icon: <XCircle className="w-3 h-3" /> },
};

const NAV_ITEMS: { tab: ShopTab; label: string; icon: React.FC<{ className?: string }> }[] = [
  { tab: 'overview', label: 'Tổng quan xưởng', icon: LayoutDashboard },
  { tab: 'products', label: 'Sản phẩm của xưởng', icon: Package },
  { tab: 'quotes', label: 'Yêu cầu báo giá', icon: MessageSquare },
  { tab: 'reviews', label: 'Đánh giá khách hàng', icon: Star },
];

export const ShopDashboardPage: React.FC = () => {
  const { user, isAuthenticated, isLoading, logout, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<ShopTab>('overview');

  // Database states
  const [products, setProducts] = useState<Product[]>([]);
  const [quotes, setQuotes] = useState<DBQuoteRequest[]>([]);
  const [reviews, setReviews] = useState<DBReview[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // Modal thêm sản phẩm
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('sofa-phong-khach');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdMaterial, setNewProdMaterial] = useState('');
  const [newProdImage, setNewProdImage] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [addingProduct, setAddingProduct] = useState(false);

  // Shop Profile state
  const [shopNameInput, setShopNameInput] = useState(user?.shopId || 'Xưởng Mộc Cao Luật');
  const [savingShopInfo, setSavingShopInfo] = useState(false);

  const showNotification = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3500);
  };

  const loadShopData = useCallback(async () => {
    setDataLoading(true);
    try {
      const [pData, qData, rData] = await Promise.all([
        fetchProductsFromDB(),
        fetchQuoteRequests(user?.id),
        fetchReviewsFromDB(),
      ]);
      setProducts(pData);
      setQuotes(qData);
      setReviews(rData);
    } catch (err) {
      console.warn('Lỗi tải dữ liệu Shop Dashboard:', err);
    } finally {
      setDataLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'SHOP_OWNER') {
      loadShopData();
    }
  }, [isAuthenticated, user, loadShopData]);

  // Hành động cập nhật kho
  const handleToggleStock = async (product: Product) => {
    const res = await toggleProductStockInDB(product.id, !!product.inStock);
    if (res.success) {
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, inStock: !p.inStock } : p))
      );
      showNotification(`Đã chuyển trạng thái kho của "${product.name}"`);
    }
  };

  // Hành động xóa sản phẩm
  const handleDeleteProduct = async (product: Product) => {
    if (!window.confirm(`Xóa sản phẩm "${product.name}"?`)) return;
    const res = await deleteProductInDB(product.id);
    if (res.success) {
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      showNotification(`Đã xóa sản phẩm "${product.name}"`);
    }
  };

  // Thêm sản phẩm mới vào Supabase
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    setAddingProduct(true);
    const parsedPrice = newProdPrice ? Number(newProdPrice.replace(/\D/g, '')) : null;
    const defaultImg =
      newProdImage.trim() ||
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80';

    const res = await createProductInDB({
      name: newProdName.trim(),
      categoryId: newProdCategory,
      price: parsedPrice,
      material: newProdMaterial.trim() || 'Gỗ tự nhiên cao cấp',
      images: [defaultImg],
      description: newProdDesc.trim() || 'Sản phẩm nội thất sản xuất trực tiếp từ xưởng.',
      shopId: user?.id,
      inStock: true,
    });

    setAddingProduct(false);
    if (res.success) {
      setShowAddModal(false);
      setNewProdName('');
      setNewProdPrice('');
      setNewProdMaterial('');
      setNewProdImage('');
      setNewProdDesc('');
      showNotification('Thêm sản phẩm mới thành công vào Database!');
      loadShopData();
    } else {
      showNotification(`Lỗi: ${res.error}`);
    }
  };

  // Cập nhật trạng thái báo giá
  const handleUpdateQuote = async (quoteId: string, newStatus: string) => {
    const res = await updateQuoteRequestStatus(quoteId, newStatus);
    if (res.success) {
      setQuotes((prev) =>
        prev.map((q) => (q.id === quoteId ? { ...q, status: newStatus } : q))
      );
      showNotification('Đã cập nhật trạng thái báo giá');
    }
  };

  // Nạp dữ liệu sản phẩm mẫu lên Supabase
  const handleSeedProducts = async () => {
    if (!window.confirm('Đồng bộ dữ liệu mẫu lên Supabase?')) return;
    setSeeding(true);
    const res = await seedProductsToSupabase(user?.id);
    setSeeding(false);
    if (res.success) {
      showNotification(`Đồng bộ thành công ${res.count} sản phẩm lên Database!`);
      loadShopData();
    } else {
      showNotification(`Lỗi: ${res.error}`);
    }
  };

  // Cập nhật thông tin xưởng
  const handleSaveShopProfile = async () => {
    setSavingShopInfo(true);
    await updateProfile({ shopId: shopNameInput });
    setSavingShopInfo(false);
    showNotification('Đã lưu thông tin xưởng thành công!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
        <div className="w-10 h-10 border-4 border-[#654329] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'SHOP_OWNER') {
    return <Navigate to="/" replace />;
  }

  const initials = user.name.split(' ').map((w) => w[0]).slice(-2).join('').toUpperCase();
  const pendingQuotes = quotes.filter((q) => q.status === 'pending');

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex">
      {/* Toast thông báo */}
      {notice && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1C1714] text-white px-5 py-3 rounded-xl shadow-xl border border-white/20 text-sm flex items-center gap-3 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-400" />
          {notice}
        </div>
      )}

      {/* ── Sidebar ── */}
      <aside className="w-64 bg-white border-r border-[#E7DCce] flex flex-col sticky top-0 h-screen shrink-0 z-40">
        <div className="flex items-center gap-3 px-5 py-5 border-b border-[#E7DCce]">
          <div className="w-9 h-9 rounded-lg bg-[#654329] flex items-center justify-center font-serif font-bold text-sm text-[#DFC7A7] shrink-0">
            CL
          </div>
          <div>
            <p className="font-bold text-sm text-[#29231F] leading-tight">CAO LUẬT DECOR</p>
            <p className="text-[10px] text-[#B5A090]">Cổng Quản Trị Đối Tác Xưởng</p>
          </div>
        </div>

        <div className="px-4 py-4 border-b border-[#E7DCce] bg-[#FAF8F5]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#654329] to-[#8B5E3C] flex items-center justify-center text-white text-sm font-bold">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#29231F] truncate">{user.name}</p>
              <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium truncate">
                <Store className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{user.shopId || 'Đối tác Xưởng'}</span>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {NAV_ITEMS.map(({ tab, label, icon: Icon }) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab
                  ? 'bg-[#F7F3ED] text-[#654329] font-semibold'
                  : 'text-[#473E37] hover:bg-[#FAF8F5] hover:text-[#654329]'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="flex-1 text-left flex items-center justify-between">
                {label}
                {tab === 'quotes' && pendingQuotes.length > 0 && (
                  <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                    {pendingQuotes.length}
                  </span>
                )}
              </span>
            </button>
          ))}
        </nav>

        <div className="border-t border-[#E7DCce] p-3 space-y-1">
          <a
            href="/"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#473E37] hover:bg-[#FAF8F5] transition-colors"
          >
            <Eye className="w-4 h-4 shrink-0" /> Xem website
          </a>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#877B70] hover:text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-4 h-4 shrink-0" /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-[#E7DCce] px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div>
            <h1 className="text-base font-semibold text-[#29231F]">
              {NAV_ITEMS.find((n) => n.tab === activeTab)?.label}
            </h1>
            <p className="text-xs text-[#877B70]">
              Xin chào, <span className="font-medium text-[#654329]">{user.name}</span>! Quản lý dữ liệu xưởng thời gian thực.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadShopData}
              disabled={dataLoading}
              className="p-2 text-[#654329] hover:bg-[#FAF8F5] rounded-lg transition-all flex items-center gap-1.5 text-xs font-medium border border-[#E7DCce]"
              title="Tải lại dữ liệu từ CSDL"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${dataLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Làm mới</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-[#654329] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#533722] transition-colors flex items-center gap-2 font-medium"
            >
              <Plus className="w-4 h-4" /> Thêm sản phẩm
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          {/* ── OVERVIEW TAB ── */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border border-[#E7DCce] shadow-sm p-5 flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#654329] to-[#8B5E3C] flex items-center justify-center shrink-0">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-[#877B70] font-medium">Sản phẩm của xưởng</p>
                    <p className="text-2xl font-bold text-[#29231F] mt-0.5">{products.length}</p>
                    <p className="text-xs text-emerald-600 font-semibold mt-1">
                      {products.filter((p) => p.inStock).length} Sản phẩm còn hàng
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-[#E7DCce] shadow-sm p-5 flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-[#877B70] font-medium">Báo giá nhận được</p>
                    <p className="text-2xl font-bold text-[#29231F] mt-0.5">{quotes.length}</p>
                    <p className="text-xs text-amber-600 font-semibold mt-1">
                      {pendingQuotes.length} Cần liên hệ tư vấn
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-[#E7DCce] shadow-sm p-5 flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center shrink-0">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-[#877B70] font-medium">Đánh giá khách hàng</p>
                    <p className="text-2xl font-bold text-[#29231F] mt-0.5">5.0 ⭐</p>
                    <p className="text-xs text-[#877B70] mt-1">{reviews.length} Lượt đánh giá</p>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-[#E7DCce] shadow-sm p-5 flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shrink-0">
                    <Store className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-[#877B70] font-medium">Tên xưởng đối tác</p>
                    <p className="text-sm font-bold text-[#29231F] mt-1 truncate max-w-[150px]">
                      {user.shopId || 'Xưởng Cao Luật'}
                    </p>
                    <p className="text-xs text-green-600 font-medium mt-1">✓ Đã xác thực CSDL</p>
                  </div>
                </div>
              </div>

              {/* Báo giá gần đây */}
              <div className="bg-white rounded-xl border border-[#E7DCce] shadow-sm p-5">
                <div className="flex items-center justify-between pb-4 border-b border-[#E7DCce]">
                  <h3 className="font-semibold text-[#29231F]">Yêu cầu báo giá cần phản hồi ngay</h3>
                  <button
                    onClick={() => setActiveTab('quotes')}
                    className="text-xs text-[#654329] font-medium hover:underline flex items-center gap-1"
                  >
                    Xem tất cả ({quotes.length})
                  </button>
                </div>
                {quotes.length === 0 ? (
                  <p className="text-center py-6 text-sm text-[#877B70]">Chưa có yêu cầu báo giá mới nào.</p>
                ) : (
                  <div className="divide-y divide-[#F7F3ED]">
                    {quotes.slice(0, 4).map((q) => {
                      const qs = quoteStatusConfig[q.status] || quoteStatusConfig.pending;
                      return (
                        <div key={q.id} className="py-3 flex items-center justify-between gap-4">
                          <div>
                            <p className="text-sm font-semibold text-[#29231F]">
                              {q.customer_name} — <a href={`tel:${q.phone}`} className="text-blue-600 font-mono">{q.phone}</a>
                            </p>
                            <p className="text-xs text-[#877B70] mt-0.5">
                              Quan tâm: <span className="font-medium text-[#654329]">{q.product_name}</span>
                            </p>
                          </div>
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${qs.color}`}>
                            {qs.icon} {qs.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Thông tin hồ sơ xưởng */}
              <div className="bg-white rounded-xl border border-[#E7DCce] p-6 shadow-sm">
                <h3 className="font-semibold text-[#29231F] mb-3">Cài đặt thông tin thương hiệu Xưởng</h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={shopNameInput}
                    onChange={(e) => setShopNameInput(e.target.value)}
                    placeholder="Tên xưởng của bạn..."
                    className="flex-1 px-4 py-2 border border-[#D5C3AF] rounded-lg text-sm bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#654329]/30"
                  />
                  <button
                    onClick={handleSaveShopProfile}
                    disabled={savingShopInfo}
                    className="bg-[#654329] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#533722] transition-colors"
                  >
                    {savingShopInfo ? 'Đang lưu...' : 'Lưu tên xưởng'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── PRODUCTS TAB ── */}
          {activeTab === 'products' && (
            <div className="bg-white rounded-xl border border-[#E7DCce] shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-[#E7DCce] flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-[#29231F]">Danh sách sản phẩm của xưởng</h3>
                  <p className="text-xs text-[#877B70]">Dữ liệu được lưu trữ trực tiếp trên database Supabase</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSeedProducts}
                    disabled={seeding}
                    className="bg-[#FAF8F5] border border-[#654329] text-[#654329] text-xs font-semibold px-3 py-2 rounded-lg hover:bg-[#F7F3ED] transition-colors flex items-center gap-1.5"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${seeding ? 'animate-spin' : ''}`} />
                    {seeding ? 'Đang đồng bộ...' : 'Nạp sản phẩm mẫu xưởng'}
                  </button>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-[#654329] text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-[#533722] transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> Thêm sản phẩm mới
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#FAF8F5] text-xs text-[#877B70] uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-3 text-left">Sản phẩm</th>
                      <th className="px-6 py-3 text-left">Chất liệu</th>
                      <th className="px-6 py-3 text-left">Giá bán</th>
                      <th className="px-6 py-3 text-left">Trạng thái kho</th>
                      <th className="px-6 py-3 text-left">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F7F3ED]">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.images?.[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=100&q=80'}
                              alt={p.name}
                              className="w-10 h-10 object-cover rounded-lg border border-[#E7DCce] shrink-0"
                            />
                            <div>
                              <p className="font-semibold text-[#29231F]">{p.name}</p>
                              <p className="text-xs text-[#877B70]">{p.dimensions || 'Kích thước tiêu chuẩn'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-[#6E665E] max-w-[200px] truncate">{p.material}</td>
                        <td className="px-6 py-4 font-semibold text-[#654329]">
                          {p.price ? `${p.price.toLocaleString('vi-VN')} đ` : 'Liên hệ'}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleToggleStock(p)}
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
                            className="p-1.5 text-[#877B70] hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
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

          {/* ── QUOTES TAB ── */}
          {activeTab === 'quotes' && (
            <div className="bg-white rounded-xl border border-[#E7DCce] shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-[#E7DCce] flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-[#29231F]">Danh sách yêu cầu báo giá từ khách</h3>
                  <p className="text-xs text-[#877B70]">Cập nhật trạng thái sau khi đã gọi điện hoặc chốt hợp đồng</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#FAF8F5] text-xs text-[#877B70] uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-3 text-left">Khách hàng</th>
                      <th className="px-6 py-3 text-left">Số điện thoại</th>
                      <th className="px-6 py-3 text-left">Sản phẩm</th>
                      <th className="px-6 py-3 text-left">Ghi chú</th>
                      <th className="px-6 py-3 text-left">Trạng thái xử lý</th>
                      <th className="px-6 py-3 text-left">Thời gian</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F7F3ED]">
                    {quotes.map((q) => {
                      const qs = quoteStatusConfig[q.status] || quoteStatusConfig.pending;
                      return (
                        <tr key={q.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                          <td className="px-6 py-4 font-semibold text-[#29231F]">{q.customer_name}</td>
                          <td className="px-6 py-4">
                            <a href={`tel:${q.phone}`} className="font-mono text-blue-600 font-semibold hover:underline">
                              {q.phone}
                            </a>
                          </td>
                          <td className="px-6 py-4 text-[#654329] font-medium">{q.product_name}</td>
                          <td className="px-6 py-4 text-xs text-[#877B70] max-w-xs truncate">{q.note || '—'}</td>
                          <td className="px-6 py-4">
                            <select
                              value={q.status}
                              onChange={(e) => handleUpdateQuote(q.id, e.target.value)}
                              className={`text-xs font-semibold px-2.5 py-1 rounded border border-[#E7DCce] ${qs.color}`}
                            >
                              <option value="pending">Chờ xử lý</option>
                              <option value="contacted">Đã liên hệ tư vấn</option>
                              <option value="completed">Đã chốt hợp đồng</option>
                              <option value="cancelled">Đã hủy</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 text-xs text-[#877B70]">
                            {new Date(q.created_at).toLocaleDateString('vi-VN')}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── REVIEWS TAB ── */}
          {activeTab === 'reviews' && (
            <div className="bg-white rounded-xl border border-[#E7DCce] shadow-sm p-6">
              <h3 className="font-semibold text-[#29231F] mb-4">Phản hồi và Đánh giá từ khách hàng</h3>
              {reviews.length === 0 ? (
                <div className="text-center py-8 text-sm text-[#877B70]">
                  Chưa có đánh giá nào được ghi nhận trên cơ sở dữ liệu.
                </div>
              ) : (
                <div className="divide-y divide-[#F7F3ED]">
                  {reviews.map((r) => (
                    <div key={r.id} className="py-4 flex items-start gap-4">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#654329] to-[#8B5E3C] flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {r.client_name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-sm text-[#29231F]">{r.client_name}</p>
                          <div className="flex items-center text-yellow-500">
                            {Array.from({ length: r.rating }).map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-current" />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-[#473E37] mt-1">{r.comment}</p>
                        <p className="text-[11px] text-[#B5A090] mt-1">
                          {new Date(r.created_at).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Modal Thêm sản phẩm mới */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E7DCce]">
            <div className="flex items-center justify-between pb-4 border-b border-[#E7DCce]">
              <h3 className="font-bold text-lg text-[#29231F]">Thêm sản phẩm mới vào Xưởng</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-gray-400 hover:text-gray-700 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#877B70] uppercase mb-1">
                  Tên sản phẩm *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Sofa Da Bò Ý Milano"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full px-3 py-2 border border-[#D5C3AF] rounded-lg text-sm bg-[#FAF8F5]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#877B70] uppercase mb-1">
                    Danh mục
                  </label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-[#D5C3AF] rounded-lg text-sm bg-[#FAF8F5]"
                  >
                    <option value="sofa-phong-khach">Sofa Phòng Khách</option>
                    <option value="ban-tra">Bàn Trà</option>
                    <option value="ke-tivi">Kệ Tivi</option>
                    <option value="ban-an-ghe-an">Bàn Ăn & Ghế Ăn</option>
                    <option value="giuong-ngu">Giường Ngủ</option>
                    <option value="tu-quan-ao">Tủ Quần Áo</option>
                    <option value="tu-bep">Tủ Bếp</option>
                    <option value="noi-that-van-phong">Nội Thất Văn Phòng</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#877B70] uppercase mb-1">
                    Giá bán (VNĐ)
                  </label>
                  <input
                    type="number"
                    placeholder="25000000"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-[#D5C3AF] rounded-lg text-sm bg-[#FAF8F5]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#877B70] uppercase mb-1">
                  Chất liệu chính
                </label>
                <input
                  type="text"
                  placeholder="Gỗ sồi Nga tự nhiên, đệm D40..."
                  value={newProdMaterial}
                  onChange={(e) => setNewProdMaterial(e.target.value)}
                  className="w-full px-3 py-2 border border-[#D5C3AF] rounded-lg text-sm bg-[#FAF8F5]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#877B70] uppercase mb-1">
                  Link ảnh sản phẩm (URL)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newProdImage}
                  onChange={(e) => setNewProdImage(e.target.value)}
                  className="w-full px-3 py-2 border border-[#D5C3AF] rounded-lg text-sm bg-[#FAF8F5]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#877B70] uppercase mb-1">
                  Mô tả sản phẩm
                </label>
                <textarea
                  rows={3}
                  placeholder="Mô tả ưu điểm và thông số của sản phẩm..."
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-[#D5C3AF] rounded-lg text-sm bg-[#FAF8F5]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-[#E7DCce]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={addingProduct}
                  className="px-5 py-2 bg-[#654329] text-white rounded-lg text-sm font-semibold hover:bg-[#533722] disabled:opacity-60"
                >
                  {addingProduct ? 'Đang thêm...' : 'Lưu sản phẩm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

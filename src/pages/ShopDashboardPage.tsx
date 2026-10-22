import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, MessageSquare, Star,
  Plus, Eye, Edit, ToggleLeft, ToggleRight,
  Bell, LogOut, Store, CheckCircle, Clock, XCircle,
  ArrowUpRight, RefreshCw, Trash2, Check, X, Search, Loader2, Camera,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DBQuoteRequest, DBReview, Product } from '../types';
import {
  fetchQuoteRequests,
  updateQuoteRequestStatus,
  fetchProductsFromDB,
  toggleProductStockInDB,
  createProductInDB,
  updateProductInDB,
  deleteProductInDB,
  fetchReviewsFromDB,
  seedProductsToSupabase,
} from '../lib/supabase';
import { ProductImagesManager } from '../components/products/ProductImagesManager';

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

  // Quotes filter & search
  const [quoteFilter, setQuoteFilter] = useState('all');
  const [quoteSearch, setQuoteSearch] = useState('');

  // Modal: Thêm / Sửa sản phẩm
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState('sofa-phong-khach');
  const [prodPrice, setProdPrice] = useState('');
  const [prodMaterial, setProdMaterial] = useState('');
  const [prodDimensions, setProdDimensions] = useState('');
  const [prodImages, setProdImages] = useState<string[]>([]);
  const [prodDesc, setProdDesc] = useState('');
  const [savingProduct, setSavingProduct] = useState(false);

  // Modal: Phản hồi báo giá
  const [selectedQuote, setSelectedQuote] = useState<DBQuoteRequest | null>(null);
  const [replyNote, setReplyNote] = useState('');
  const [replyStatus, setReplyStatus] = useState('contacted');
  const [savingReply, setSavingReply] = useState(false);

  // Modal: Cập nhật hồ sơ xưởng
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [shopNameInput, setShopNameInput] = useState(user?.shopId || 'Xưởng Mộc Cao Luật');
  const [shopPhoneInput, setShopPhoneInput] = useState(user?.phone || '');
  const [shopAddressInput, setShopAddressInput] = useState(user?.address || '');
  const [savingProfile, setSavingProfile] = useState(false);

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
    if (!window.confirm(`Xóa sản phẩm "${product.name}" khỏi CSDL?`)) return;
    const res = await deleteProductInDB(product.id);
    if (res.success) {
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      showNotification(`Đã xóa sản phẩm "${product.name}"`);
    }
  };

  // Mở modal Thêm mới
  const handleOpenAddModal = () => {
    setEditingProductId(null);
    setProdName('');
    setProdCategory('sofa-phong-khach');
    setProdPrice('');
    setProdMaterial('Gỗ tự nhiên cao cấp');
    setProdDimensions('Kích thước theo yêu cầu');
    setProdImages([]);
    setProdDesc('');
    setShowProductModal(true);
  };

  // Mở modal Sửa
  const handleOpenEditModal = (p: Product) => {
    setEditingProductId(p.id);
    setProdName(p.name);
    setProdCategory(p.categoryId || 'sofa-phong-khach');
    setProdPrice(p.price ? p.price.toString() : '');
    setProdMaterial(p.material || '');
    setProdDimensions(p.dimensions || '');
    setProdImages(p.images && p.images.length > 0 ? p.images : []);
    setProdDesc(p.description || '');
    setShowProductModal(true);
  };

  // Lưu sản phẩm (Thêm hoặc Sửa)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) return;

    setSavingProduct(true);
    const parsedPrice = prodPrice ? Number(prodPrice.replace(/\D/g, '')) : null;
    const defaultImg =
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80';
    const finalImages = prodImages.length > 0 ? prodImages : [defaultImg];

    if (editingProductId) {
      const res = await updateProductInDB(editingProductId, {
        name: prodName.trim(),
        categoryId: prodCategory,
        price: parsedPrice,
        material: prodMaterial.trim(),
        dimensions: prodDimensions.trim(),
        description: prodDesc.trim(),
        images: finalImages,
      });
      setSavingProduct(false);
      if (res.success) {
        setShowProductModal(false);
        showNotification('Đã cập nhật sản phẩm thành công!');
        loadShopData();
      } else {
        showNotification(`Lỗi: ${res.error}`);
      }
    } else {
      const res = await createProductInDB({
        name: prodName.trim(),
        categoryId: prodCategory,
        price: parsedPrice,
        material: prodMaterial.trim(),
        dimensions: prodDimensions.trim(),
        images: finalImages,
        description: prodDesc.trim(),
        shopId: user?.id,
        inStock: true,
      });
      setSavingProduct(false);
      if (res.success) {
        setShowProductModal(false);
        showNotification('Thêm sản phẩm mới thành công vào Database!');
        loadShopData();
      } else {
        showNotification(`Lỗi: ${res.error}`);
      }
    }
  };

  // Lưu phản hồi báo giá
  const handleSaveReplyQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuote) return;

    setSavingReply(true);
    const res = await updateQuoteRequestStatus(
      selectedQuote.id,
      replyStatus,
      replyNote.trim()
    );
    setSavingReply(false);

    if (res.success) {
      setQuotes((prev) =>
        prev.map((q) =>
          q.id === selectedQuote.id
            ? { ...q, status: replyStatus, admin_note: replyNote.trim() }
            : q
        )
      );
      setSelectedQuote(null);
      showNotification('Đã gửi phản hồi và cập nhật tiến độ báo giá!');
    } else {
      showNotification(`Lỗi: ${res.error}`);
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
  const handleSaveShopProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    await updateProfile({
      shopId: shopNameInput.trim(),
      phone: shopPhoneInput.trim(),
      address: shopAddressInput.trim(),
    });
    setSavingProfile(false);
    setShowProfileModal(false);
    showNotification('Đã lưu thông tin xưởng vào Database!');
  };

  // Lọc Quotes
  const filteredQuotes = useMemo(() => {
    return quotes.filter((q) => {
      const matchStatus = quoteFilter === 'all' || q.status === quoteFilter;
      const qSearch = quoteSearch.toLowerCase().trim();
      const matchSearch =
        !qSearch ||
        q.customer_name.toLowerCase().includes(qSearch) ||
        q.phone.includes(qSearch) ||
        (q.product_name && q.product_name.toLowerCase().includes(qSearch));
      return matchStatus && matchSearch;
    });
  }, [quotes, quoteFilter, quoteSearch]);

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
                  ? 'bg-[#F7F3ED] text-[#654329] font-semibold shadow-xs'
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
              <span className="hidden sm:inline">Làm mới CSDL</span>
            </button>
            <button
              onClick={handleOpenAddModal}
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
                    <button
                      onClick={() => setShowProfileModal(true)}
                      className="text-xs text-[#654329] font-medium mt-1 hover:underline flex items-center gap-1"
                    >
                      Cài đặt xưởng <ChevronRight className="w-3.5 h-3.5" />
                    </button>
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
                    Xem tất cả ({quotes.length}) <ChevronRight className="w-3.5 h-3.5" />
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
                              {q.note && ` — "${q.note}"`}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${qs.color}`}>
                              {qs.icon} {qs.label}
                            </span>
                            <button
                              onClick={() => {
                                setSelectedQuote(q);
                                setReplyNote(q.admin_note || '');
                                setReplyStatus(q.status === 'pending' ? 'contacted' : q.status);
                              }}
                              className="text-xs text-[#654329] font-semibold px-2.5 py-1 bg-[#FAF8F5] border border-[#E7DCce] rounded hover:bg-[#F7F3ED]"
                            >
                              Phản hồi
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Banner cập nhật xưởng */}
              <div className="bg-gradient-to-r from-[#654329] to-[#8B5E3C] rounded-2xl p-6 text-white flex items-center justify-between shadow-md">
                <div>
                  <p className="font-serif text-xl font-bold">Hồ sơ xưởng: {user.shopId || 'Cao Luật Decor'}</p>
                  <p className="text-white/80 text-sm mt-1">Cập nhật hotline, địa chỉ xưởng sản xuất để khách hàng dễ dàng liên hệ may đo.</p>
                </div>
                <button
                  onClick={() => setShowProfileModal(true)}
                  className="bg-white text-[#654329] font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-white/90 transition-colors flex items-center gap-2 shrink-0 shadow-sm"
                >
                  <Camera className="w-4 h-4" /> Cập nhật xưởng
                </button>
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
                    onClick={handleOpenAddModal}
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
                          <div className="flex items-center gap-1.5">
                            <a
                              href={`/san-pham/${p.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 text-[#877B70] hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                              title="Xem trang sản phẩm"
                            >
                              <Eye className="w-4 h-4" />
                            </a>
                            <button
                              onClick={() => handleOpenEditModal(p)}
                              className="p-1.5 text-[#877B70] hover:text-[#654329] hover:bg-[#F7F3ED] rounded-lg transition-all"
                              title="Chỉnh sửa sản phẩm"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p)}
                              className="p-1.5 text-[#877B70] hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                              title="Xóa sản phẩm"
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

          {/* ── QUOTES TAB ── */}
          {activeTab === 'quotes' && (
            <div className="bg-white rounded-xl border border-[#E7DCce] shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-[#E7DCce] space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-[#29231F]">Danh sách yêu cầu báo giá từ khách</h3>
                    <p className="text-xs text-[#877B70]">Cập nhật trạng thái sau khi đã gọi điện hoặc chốt hợp đồng</p>
                  </div>
                </div>

                {/* Bộ lọc trạng thái & Search */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { key: 'all', label: 'Tất cả' },
                      { key: 'pending', label: 'Chờ xử lý' },
                      { key: 'contacted', label: 'Đã liên hệ' },
                      { key: 'completed', label: 'Đã chốt' },
                      { key: 'cancelled', label: 'Đã hủy' },
                    ].map((f) => (
                      <button
                        key={f.key}
                        onClick={() => setQuoteFilter(f.key)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                          quoteFilter === f.key
                            ? 'bg-[#654329] text-white shadow-xs'
                            : 'bg-[#FAF8F5] text-[#473E37] border border-[#E7DCce] hover:bg-[#F7F3ED]'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Tìm tên, SĐT khách..."
                      value={quoteSearch}
                      onChange={(e) => setQuoteSearch(e.target.value)}
                      className="pl-8 pr-3 py-1.5 border border-[#D5C3AF] rounded-lg text-xs w-56 bg-[#FAF8F5] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#FAF8F5] text-xs text-[#877B70] uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-3 text-left">Khách hàng</th>
                      <th className="px-6 py-3 text-left">Số điện thoại</th>
                      <th className="px-6 py-3 text-left">Sản phẩm</th>
                      <th className="px-6 py-3 text-left">Ghi chú khách</th>
                      <th className="px-6 py-3 text-left">Trạng thái xử lý</th>
                      <th className="px-6 py-3 text-left">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F7F3ED]">
                    {filteredQuotes.map((q) => {
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
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${qs.color}`}>
                              {qs.icon} {qs.label}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => {
                                setSelectedQuote(q);
                                setReplyNote(q.admin_note || '');
                                setReplyStatus(q.status === 'pending' ? 'contacted' : q.status);
                              }}
                              className="px-3 py-1 bg-[#654329] text-white rounded-md text-xs font-semibold hover:bg-[#533722] transition-colors flex items-center gap-1"
                            >
                              <MessageSquare className="w-3 h-3" /> Phản hồi
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

      {/* Modal Thêm hoặc Sửa sản phẩm */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#E7DCce]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7DCce]">
              <h3 className="font-bold text-base text-[#29231F]">
                {editingProductId ? 'Chỉnh sửa sản phẩm xưởng' : 'Thêm sản phẩm mới vào Xưởng'}
              </h3>
              <button
                onClick={() => setShowProductModal(false)}
                className="p-1 text-gray-400 hover:text-gray-700 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="mt-4 space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-[#877B70] uppercase mb-1">
                  Tên sản phẩm *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Sofa Da Bò Ý Milano"
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  className="w-full px-3 py-2 border border-[#D5C3AF] rounded-lg text-sm bg-[#FAF8F5]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#877B70] uppercase mb-1">
                    Danh mục
                  </label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
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
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-[#D5C3AF] rounded-lg text-sm bg-[#FAF8F5]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#877B70] uppercase mb-1">
                    Chất liệu chính
                  </label>
                  <input
                    type="text"
                    placeholder="Gỗ sồi Nga tự nhiên, đệm D40..."
                    value={prodMaterial}
                    onChange={(e) => setProdMaterial(e.target.value)}
                    className="w-full px-3 py-2 border border-[#D5C3AF] rounded-lg text-sm bg-[#FAF8F5]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#877B70] uppercase mb-1">
                    Kích thước
                  </label>
                  <input
                    type="text"
                    placeholder="2800 x 1700 x 850 mm"
                    value={prodDimensions}
                    onChange={(e) => setProdDimensions(e.target.value)}
                    className="w-full px-3 py-2 border border-[#D5C3AF] rounded-lg text-sm bg-[#FAF8F5]"
                  />
                </div>
              </div>

              <ProductImagesManager images={prodImages} onChange={setProdImages} />

              <div>
                <label className="block text-xs font-semibold text-[#877B70] uppercase mb-1">
                  Mô tả sản phẩm
                </label>
                <textarea
                  rows={2}
                  placeholder="Mô tả ưu điểm và thông số của sản phẩm..."
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-[#D5C3AF] rounded-lg text-sm bg-[#FAF8F5]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-[#E7DCce]">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-xs text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={savingProduct}
                  className="px-5 py-2 bg-[#654329] text-white rounded-lg text-xs font-semibold hover:bg-[#533722] disabled:opacity-60 flex items-center gap-1.5"
                >
                  {savingProduct ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  {savingProduct ? 'Đang lưu...' : 'Lưu sản phẩm vào CSDL'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Phản hồi báo giá */}
      {selectedQuote && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E7DCce]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7DCce]">
              <h3 className="font-bold text-base text-[#29231F]">
                Phản hồi khách #{selectedQuote.id.slice(0, 8)}
              </h3>
              <button onClick={() => setSelectedQuote(null)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveReplyQuote} className="mt-4 space-y-3 text-sm">
              <div className="p-3 bg-[#FAF8F5] rounded-xl text-xs space-y-1">
                <p>Khách hàng: <strong>{selectedQuote.customer_name}</strong></p>
                <p>Số điện thoại: <a href={`tel:${selectedQuote.phone}`} className="text-blue-600 font-semibold">{selectedQuote.phone}</a></p>
                <p>Sản phẩm: <strong>{selectedQuote.product_name}</strong></p>
                {selectedQuote.note && <p className="italic text-gray-500">"{selectedQuote.note}"</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#877B70] uppercase mb-1">
                  Trạng thái sau khi tư vấn
                </label>
                <select
                  value={replyStatus}
                  onChange={(e) => setReplyStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-[#D5C3AF] rounded-lg text-xs bg-[#FAF8F5] font-semibold"
                >
                  <option value="contacted">Đã liên hệ tư vấn</option>
                  <option value="completed">Đã chốt hợp đồng</option>
                  <option value="cancelled">Khách hủy yêu cầu</option>
                  <option value="pending">Chờ gọi lại sau</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#877B70] uppercase mb-1">
                  Ghi chú kết quả tư vấn
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Ghi lại báo giá sơ bộ, kích thước khách yêu cầu, hoặc thời gian hẹn đo đạc..."
                  value={replyNote}
                  onChange={(e) => setReplyNote(e.target.value)}
                  className="w-full px-3 py-2 border border-[#D5C3AF] rounded-lg text-xs bg-[#FAF8F5]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#E7DCce]">
                <button
                  type="button"
                  onClick={() => setSelectedQuote(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-xs text-gray-700"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  disabled={savingReply}
                  className="px-5 py-2 bg-[#654329] text-white rounded-lg text-xs font-semibold hover:bg-[#533722]"
                >
                  {savingReply ? 'Đang lưu...' : 'Lưu kết quả tư vấn'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Cập nhật hồ sơ xưởng */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E7DCce]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7DCce]">
              <h3 className="font-bold text-base text-[#29231F]">Cài đặt thương hiệu Xưởng</h3>
              <button onClick={() => setShowProfileModal(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveShopProfile} className="mt-4 space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-[#877B70] uppercase mb-1">
                  Tên thương hiệu xưởng *
                </label>
                <input
                  type="text"
                  required
                  value={shopNameInput}
                  onChange={(e) => setShopNameInput(e.target.value)}
                  className="w-full px-3 py-2 border border-[#D5C3AF] rounded-lg text-xs bg-[#FAF8F5]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#877B70] uppercase mb-1">
                  Hotline tư vấn xưởng
                </label>
                <input
                  type="tel"
                  value={shopPhoneInput}
                  onChange={(e) => setShopPhoneInput(e.target.value)}
                  className="w-full px-3 py-2 border border-[#D5C3AF] rounded-lg text-xs bg-[#FAF8F5]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#877B70] uppercase mb-1">
                  Địa chỉ xưởng sản xuất
                </label>
                <input
                  type="text"
                  value={shopAddressInput}
                  onChange={(e) => setShopAddressInput(e.target.value)}
                  className="w-full px-3 py-2 border border-[#D5C3AF] rounded-lg text-xs bg-[#FAF8F5]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#E7DCce]">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-xs text-gray-700"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-5 py-2 bg-[#654329] text-white rounded-lg text-xs font-semibold hover:bg-[#533722]"
                >
                  {savingProfile ? 'Đang lưu...' : 'Lưu hồ sơ vào CSDL'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, MessageSquare, Star, TrendingUp,
  Plus, Eye, Edit, ToggleLeft, ToggleRight, ChevronRight,
  Bell, LogOut, Store, CheckCircle, Clock, XCircle,
  ArrowUpRight, Camera,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

type ShopTab = 'overview' | 'products' | 'quotes' | 'reviews';

const SHOP_STATS = [
  { label: 'Sản phẩm đang bán', value: '42', change: +3, icon: Package, color: 'from-[#654329] to-[#8B5E3C]' },
  { label: 'Báo giá nhận được', value: '18', change: +6, icon: MessageSquare, color: 'from-amber-500 to-amber-600' },
  { label: 'Đánh giá trung bình', value: '4.8 ⭐', change: +0.2, icon: Star, color: 'from-yellow-500 to-yellow-600' },
  { label: 'Lượt xem tháng này', value: '2,340', change: +15.4, icon: TrendingUp, color: 'from-blue-500 to-blue-600' },
];

const SHOP_PRODUCTS = [
  { id: 'P001', name: 'Sofa Da Ý Milano 3 Chỗ', category: 'Phòng khách', price: '₫ 35.500.000', stock: true, views: 234 },
  { id: 'P002', name: 'Tủ bếp Acrylic chữ L', category: 'Phòng bếp', price: '₫ 68.000.000', stock: true, views: 189 },
  { id: 'P003', name: 'Giường gỗ sồi Bắc Mỹ', category: 'Phòng ngủ', price: '₫ 28.900.000', stock: false, views: 156 },
  { id: 'P004', name: 'Bàn ăn mặt đá Marble 6 chỗ', category: 'Phòng ăn', price: '₫ 42.000.000', stock: true, views: 302 },
];

const SHOP_QUOTES = [
  { id: 'Q011', customer: 'Nguyễn Thị Lan', product: 'Sofa Milano', status: 'PENDING', date: '21/10/2026', note: 'Hỏi về màu xám tro' },
  { id: 'Q012', customer: 'Trần Bình', product: 'Tủ bếp Acrylic', status: 'RESPONDED', date: '20/10/2026', note: 'Kích thước 3.5m' },
  { id: 'Q013', customer: 'Lê Văn Sơn', product: 'Bàn ăn đá Marble', status: 'CLOSED', date: '18/10/2026', note: '' },
];

const SHOP_REVIEWS = [
  { customer: 'Nguyễn T. A.', product: 'Sofa Da Ý Milano', rating: 5, comment: 'Chất lượng tuyệt vời, đúng như mô tả. Dịch vụ nhiệt tình.', date: '15/10/2026' },
  { customer: 'Trần V. B.', product: 'Tủ bếp Acrylic', rating: 4, comment: 'Sản phẩm đẹp, thi công tốt. Giao hàng hơi trễ so với hẹn.', date: '10/10/2026' },
  { customer: 'Phạm T. C.', product: 'Giường gỗ sồi', rating: 5, comment: 'Rất hài lòng! Gỗ sồi thật, nặng, chắc chắn.', date: '05/10/2026' },
];

const quoteStatusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  PENDING: { label: 'Chờ xử lý', color: 'bg-amber-50 text-amber-700', icon: <Clock className="w-3 h-3" /> },
  RESPONDED: { label: 'Đã phản hồi', color: 'bg-green-50 text-green-700', icon: <CheckCircle className="w-3 h-3" /> },
  CLOSED: { label: 'Đã đóng', color: 'bg-gray-100 text-gray-500', icon: <XCircle className="w-3 h-3" /> },
};

const NAV_ITEMS: { tab: ShopTab; label: string; icon: React.FC<{ className?: string }> }[] = [
  { tab: 'overview', label: 'Tổng quan', icon: LayoutDashboard },
  { tab: 'products', label: 'Sản phẩm của tôi', icon: Package },
  { tab: 'quotes', label: 'Yêu cầu báo giá', icon: MessageSquare },
  { tab: 'reviews', label: 'Đánh giá', icon: Star },
];

export const ShopDashboardPage: React.FC = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<ShopTab>('overview');

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

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex">
      {/* ── Sidebar ── */}
      <aside className="w-60 bg-white border-r border-[#E7DCce] flex flex-col sticky top-0 h-screen shrink-0">
        {/* Brand */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-[#E7DCce]">
          <div className="w-9 h-9 rounded-lg bg-[#654329] flex items-center justify-center font-serif font-bold text-sm text-[#DFC7A7] shrink-0">
            CL
          </div>
          <div>
            <p className="font-bold text-sm text-[#29231F] leading-tight">CAO LUẬT DECOR</p>
            <p className="text-[10px] text-[#B5A090]">Shop Portal</p>
          </div>
        </div>

        {/* Shop info */}
        <div className="px-4 py-4 border-b border-[#E7DCce] bg-[#FAF8F5]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#654329] to-[#8B5E3C] flex items-center justify-center text-white text-sm font-bold">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#29231F] truncate">{user.name}</p>
              <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
                <Store className="w-3 h-3" /> Chủ shop
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-0.5">
          {NAV_ITEMS.map(({ tab, label, icon: Icon }) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab
                  ? 'bg-[#F7F3ED] text-[#654329]'
                  : 'text-[#473E37] hover:bg-[#FAF8F5] hover:text-[#654329]'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="border-t border-[#E7DCce] p-3 space-y-1">
          <a
            href="/"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#473E37] hover:bg-[#FAF8F5] transition-colors"
          >
            <Eye className="w-4 h-4 shrink-0" /> Xem trang web
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
        {/* Topbar */}
        <header className="bg-white border-b border-[#E7DCce] px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div>
            <h1 className="text-base font-semibold text-[#29231F]">
              {NAV_ITEMS.find((n) => n.tab === activeTab)?.label}
            </h1>
            <p className="text-xs text-[#877B70]">
              Xin chào, <span className="font-medium text-[#654329]">{user.name}</span>! 👋
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-[#877B70] hover:text-[#654329] rounded-lg hover:bg-[#F7F3ED] transition-all">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className="luxury-btn bg-[#654329] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#533722] transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Thêm sản phẩm
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">

          {/* ── OVERVIEW ── */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {SHOP_STATS.map((s) => (
                  <div key={s.label} className="bg-white rounded-xl border border-[#E7DCce] shadow-sm p-5 flex items-start gap-4">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shrink-0`}>
                      <s.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-[#877B70] font-medium">{s.label}</p>
                      <p className="text-xl font-bold text-[#29231F] mt-0.5">{s.value}</p>
                      <div className="flex items-center gap-1 text-xs font-semibold text-green-600 mt-1">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        +{s.change}{typeof s.change === 'number' && s.label.includes('Lượt') ? '%' : ''} tháng này
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top products */}
                <div className="bg-white rounded-xl border border-[#E7DCce] shadow-sm">
                  <div className="px-5 py-4 border-b border-[#E7DCce] flex items-center justify-between">
                    <h3 className="font-semibold text-[#29231F]">Sản phẩm nổi bật</h3>
                    <button onClick={() => setActiveTab('products')} className="text-xs text-[#654329] font-medium hover:underline flex items-center gap-1">
                      Xem tất cả <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="divide-y divide-[#F7F3ED]">
                    {SHOP_PRODUCTS.slice(0, 3).map((p) => (
                      <div key={p.id} className="px-5 py-3.5 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-lg bg-[#F7F3ED] flex items-center justify-center shrink-0">
                            <Package className="w-4 h-4 text-[#B5A090]" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-[#29231F] truncate">{p.name}</p>
                            <p className="text-xs text-[#877B70]">{p.price}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Eye className="w-3.5 h-3.5 text-[#B5A090]" />
                          <span className="text-xs text-[#877B70]">{p.views}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent quotes */}
                <div className="bg-white rounded-xl border border-[#E7DCce] shadow-sm">
                  <div className="px-5 py-4 border-b border-[#E7DCce] flex items-center justify-between">
                    <h3 className="font-semibold text-[#29231F]">Báo giá gần đây</h3>
                    <button onClick={() => setActiveTab('quotes')} className="text-xs text-[#654329] font-medium hover:underline flex items-center gap-1">
                      Xem tất cả <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="divide-y divide-[#F7F3ED]">
                    {SHOP_QUOTES.map((q) => {
                      const qs = quoteStatusConfig[q.status];
                      return (
                        <div key={q.id} className="px-5 py-3.5 flex items-center justify-between gap-4">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-[#29231F]">{q.customer}</p>
                            <p className="text-xs text-[#877B70] truncate">{q.product}</p>
                          </div>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${qs.color}`}>
                            {qs.icon} {qs.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Shop profile banner */}
              <div className="bg-gradient-to-r from-[#654329] to-[#8B5E3C] rounded-2xl p-6 text-white flex items-center justify-between">
                <div>
                  <p className="font-serif text-xl font-bold">Hồ sơ shop của bạn</p>
                  <p className="text-white/70 text-sm mt-1">Cập nhật ảnh đại diện, mô tả và thông tin liên hệ để thu hút khách hàng hơn.</p>
                </div>
                <button className="bg-white text-[#654329] font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-white/90 transition-colors flex items-center gap-2 shrink-0">
                  <Camera className="w-4 h-4" /> Cập nhật
                </button>
              </div>
            </div>
          )}

          {/* ── PRODUCTS ── */}
          {activeTab === 'products' && (
            <div className="bg-white rounded-xl border border-[#E7DCce] shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-[#E7DCce] flex items-center justify-between">
                <h3 className="font-semibold text-[#29231F]">Sản phẩm của shop</h3>
                <button className="bg-[#654329] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#533722] transition-colors flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Thêm sản phẩm mới
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#FAF8F5] text-xs text-[#877B70] uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-3 text-left">Sản phẩm</th>
                      <th className="px-6 py-3 text-left">Danh mục</th>
                      <th className="px-6 py-3 text-left">Giá</th>
                      <th className="px-6 py-3 text-left">Trạng thái</th>
                      <th className="px-6 py-3 text-left">Lượt xem</th>
                      <th className="px-6 py-3 text-left">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F7F3ED]">
                    {SHOP_PRODUCTS.map((p) => (
                      <tr key={p.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-[#F7F3ED] flex items-center justify-center shrink-0">
                              <Package className="w-4 h-4 text-[#B5A090]" />
                            </div>
                            <p className="font-medium text-[#29231F]">{p.name}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-[#877B70]">{p.category}</td>
                        <td className="px-6 py-4 font-semibold text-[#654329]">{p.price}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${p.stock ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                            {p.stock
                              ? <><ToggleRight className="w-3.5 h-3.5" /> Còn hàng</>
                              : <><ToggleLeft className="w-3.5 h-3.5" /> Hết hàng</>
                            }
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="flex items-center gap-1 text-[#877B70]">
                            <Eye className="w-3.5 h-3.5" /> {p.views}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button className="p-1.5 text-[#877B70] hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Xem">
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button className="p-1.5 text-[#877B70] hover:text-[#654329] hover:bg-[#F7F3ED] rounded-lg transition-all" title="Sửa">
                              <Edit className="w-3.5 h-3.5" />
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

          {/* ── QUOTES ── */}
          {activeTab === 'quotes' && (
            <div className="space-y-4">
              <div className="flex gap-3">
                {['Tất cả', 'Chờ xử lý', 'Đã phản hồi', 'Đã đóng'].map((f) => (
                  <button key={f} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${f === 'Tất cả' ? 'bg-[#654329] text-white' : 'bg-white text-[#473E37] border border-[#D5C3AF] hover:border-[#654329] hover:text-[#654329]'}`}>
                    {f}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                {SHOP_QUOTES.map((q) => {
                  const qs = quoteStatusConfig[q.status];
                  return (
                    <div key={q.id} className="bg-white border border-[#E7DCce] rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-mono text-xs bg-[#FAF8F5] text-[#877B70] px-2 py-0.5 rounded">{q.id}</span>
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${qs.color}`}>
                              {qs.icon} {qs.label}
                            </span>
                          </div>
                          <p className="font-semibold text-[#29231F]">{q.customer}</p>
                          <p className="text-sm text-[#654329] font-medium mt-0.5">{q.product}</p>
                          {q.note && <p className="text-sm text-[#877B70] mt-1 italic">"{q.note}"</p>}
                          <p className="text-xs text-[#B5A090] mt-2">{q.date}</p>
                        </div>
                        {q.status === 'PENDING' && (
                          <button className="luxury-btn bg-[#654329] text-white text-sm px-4 py-2 rounded-lg hover:bg-[#533722] transition-colors shrink-0 flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" /> Phản hồi
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── REVIEWS ── */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              {/* Summary */}
              <div className="bg-white rounded-xl border border-[#E7DCce] shadow-sm p-6 flex items-center gap-8">
                <div className="text-center">
                  <p className="text-5xl font-bold text-[#654329]">4.8</p>
                  <div className="flex justify-center gap-0.5 mt-1">
                    {[1,2,3,4,5].map((i) => (
                      <Star key={i} className={`w-4 h-4 ${i <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-yellow-400 fill-yellow-200'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-[#877B70] mt-1">{SHOP_REVIEWS.length} đánh giá</p>
                </div>
                <div className="flex-1 space-y-2">
                  {[5,4,3,2,1].map((star) => {
                    const count = SHOP_REVIEWS.filter((r) => r.rating === star).length;
                    const pct = (count / SHOP_REVIEWS.length) * 100;
                    return (
                      <div key={star} className="flex items-center gap-2 text-xs">
                        <span className="text-[#877B70] w-3">{star}</span>
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <div className="flex-1 h-1.5 bg-[#F7F3ED] rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-[#877B70] w-4">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Review list */}
              <div className="space-y-3">
                {SHOP_REVIEWS.map((r, i) => (
                  <div key={i} className="bg-white border border-[#E7DCce] rounded-xl p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#654329] to-[#8B5E3C] flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {r.customer.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-[#29231F]">{r.customer}</p>
                          <p className="text-xs text-[#654329]">{r.product}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 shrink-0">
                        {[1,2,3,4,5].map((i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i <= r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-[#473E37] mt-3 leading-relaxed">"{r.comment}"</p>
                    <p className="text-xs text-[#B5A090] mt-2">{r.date}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import {
  User, Phone, Mail, MapPin, Calendar, Edit3, Save, X, CheckCircle2, Shield,
  MessageSquare, Clock, CheckCircle, XCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PageHeader } from '../components/common/PageHeader';
import { DBQuoteRequest } from '../types';
import { fetchQuoteRequests } from '../lib/supabase';

export const AccountPage: React.FC = () => {
  const { user, isAuthenticated, isLoading, updateProfile, logout } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [userQuotes, setUserQuotes] = useState<DBQuoteRequest[]>([]);
  const [loadingQuotes, setLoadingQuotes] = useState(false);
  const [form, setForm] = useState({
    name: user?.name ?? '',
    phone: user?.phone ?? '',
    address: user?.address ?? '',
    city: user?.city ?? '',
  });

  useEffect(() => {
    if (user) {
      setLoadingQuotes(true);
      fetchQuoteRequests().then((data) => {
        const mine = data.filter(
          (q) =>
            (user.id && q.user_id === user.id) ||
            (user.phone && q.phone === user.phone) ||
            (user.email && q.email === user.email)
        );
        setUserQuotes(mine);
        setLoadingQuotes(false);
      });
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#654329] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  const handleEdit = () => {
    setForm({ name: user.name, phone: user.phone, address: user.address ?? '', city: user.city ?? '' });
    setEditMode(true);
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    await updateProfile(form);
    setSaving(false);
    setEditMode(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const initials = user.name.split(' ').map((w) => w[0]).slice(-2).join('').toUpperCase();

  const roleInfo: Record<string, { label: string; badge: string; icon: React.ReactNode }> = {
    CUSTOMER: {
      label: 'Khách hàng thành viên',
      badge: 'bg-blue-100 text-blue-700',
      icon: <User className="w-4 h-4" />,
    },
    SHOP_OWNER: {
      label: 'Chủ shop / Quản lý xưởng',
      badge: 'bg-emerald-100 text-emerald-700',
      icon: <Shield className="w-4 h-4" />,
    },
    ADMIN: {
      label: 'Quản trị viên hệ thống',
      badge: 'bg-amber-100 text-amber-700',
      icon: <Shield className="w-4 h-4" />,
    },
  };

  const info = roleInfo[user.role] ?? roleInfo['CUSTOMER'];

  return (
    <>
      <PageHeader
        title="Tài Khoản Của Tôi"
        subtitle="Quản lý thông tin cá nhân và theo dõi lịch sử giao dịch"
        breadcrumbs={[{ label: 'Trang chủ', path: '/' }, { label: 'Tài khoản' }]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* ─── Left sidebar ─── */}
          <div className="md:col-span-1 space-y-4">
            {/* Avatar card */}
            <div className="bg-white border border-[#E7DCce] rounded-2xl p-6 text-center shadow-sm">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#654329] to-[#8B5E3C] flex items-center justify-center text-white text-2xl font-bold mx-auto shadow-md mb-4">
                {initials}
              </div>
              <h2 className="font-serif text-xl text-[#29231F] font-bold">{user.name}</h2>
              <p className="text-sm text-[#877B70] mt-1">{user.email}</p>
              <div className={`inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full text-xs font-semibold ${info.badge}`}>
                {info.icon}
                {info.label}
              </div>
              <div className="mt-4 pt-4 border-t border-[#E7DCce] text-left space-y-2">
                <div className="flex items-center gap-2 text-sm text-[#877B70]">
                  <Calendar className="w-4 h-4 shrink-0" />
                  <span>
                    Thành viên từ{' '}
                    {new Date(user.createdAt).toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#877B70]">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-green-500" />
                  <span>Tài khoản đã xác minh</span>
                </div>
              </div>
            </div>

            {/* Quick links */}
            <div className="bg-white border border-[#E7DCce] rounded-2xl p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#877B70] mb-3 px-2">Truy cập nhanh</p>
              <nav className="space-y-1">
                {[
                  { label: 'Hồ sơ cá nhân', path: '/tai-khoan', active: true },
                  { label: 'Lịch sử báo giá', path: '/tai-khoan/bao-gia' },
                  { label: 'Sản phẩm yêu thích', path: '/tai-khoan/yeu-thich' },
                  { label: 'Cài đặt & Bảo mật', path: '/tai-khoan/cai-dat' },
                ].map((item) => (
                  <a
                    key={item.path}
                    href={item.path}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      item.active
                        ? 'bg-[#F7F3ED] text-[#654329]'
                        : 'text-[#473E37] hover:bg-[#FAF8F5] hover:text-[#654329]'
                    }`}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
              <div className="mt-3 pt-3 border-t border-[#E7DCce]">
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>

          {/* ─── Right content ─── */}
          <div className="md:col-span-2 space-y-6">
            {/* Profile info card */}
            <div className="bg-white border border-[#E7DCce] rounded-2xl shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#E7DCce]">
                <h3 className="font-serif text-lg font-semibold text-[#29231F]">Thông tin cá nhân</h3>
                {!editMode ? (
                  <button
                    id="btn-edit-profile"
                    onClick={handleEdit}
                    className="flex items-center gap-1.5 text-sm text-[#654329] hover:text-[#533722] font-medium transition-colors"
                  >
                    <Edit3 className="w-4 h-4" /> Chỉnh sửa
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditMode(false)}
                      className="flex items-center gap-1 text-sm text-[#877B70] hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" /> Hủy
                    </button>
                    <button
                      id="btn-save-profile"
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-1.5 text-sm bg-[#654329] text-white px-3 py-1.5 rounded-lg hover:bg-[#533722] transition-colors disabled:opacity-60"
                    >
                      <Save className="w-4 h-4" />
                      {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                  </div>
                )}
              </div>

              {saved && (
                <div className="mx-6 mt-4 flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 text-sm text-green-700">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  Thông tin đã được cập nhật thành công!
                </div>
              )}

              <div className="p-6 space-y-5">
                {/* Họ tên */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#877B70] mb-2">
                    <User className="w-3.5 h-3.5" /> Họ và tên
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-2.5 border border-[#D5C3AF] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#654329]/30 focus:border-[#654329] bg-[#FAF8F5]"
                    />
                  ) : (
                    <p className="text-[#29231F] font-medium">{user.name}</p>
                  )}
                </div>

                {/* Email (không cho sửa) */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#877B70] mb-2">
                    <Mail className="w-3.5 h-3.5" /> Email
                  </label>
                  <p className="text-[#473E37]">{user.email}</p>
                  <p className="text-xs text-[#B5A090] mt-1">Email không thể thay đổi</p>
                </div>

                {/* SĐT */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#877B70] mb-2">
                    <Phone className="w-3.5 h-3.5" /> Số điện thoại
                  </label>
                  {editMode ? (
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-2.5 border border-[#D5C3AF] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#654329]/30 focus:border-[#654329] bg-[#FAF8F5]"
                    />
                  ) : (
                    <p className="text-[#473E37]">{user.phone || 'Chưa cập nhật'}</p>
                  )}
                </div>

                {/* Địa chỉ */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#877B70] mb-2">
                    <MapPin className="w-3.5 h-3.5" /> Địa chỉ / Tỉnh thành
                  </label>
                  {editMode ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Số nhà, tên đường, phường/xã..."
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                        className="w-full px-4 py-2.5 border border-[#D5C3AF] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#654329]/30 focus:border-[#654329] bg-[#FAF8F5]"
                      />
                      <input
                        type="text"
                        placeholder="Tỉnh / Thành phố"
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                        className="w-full px-4 py-2.5 border border-[#D5C3AF] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#654329]/30 focus:border-[#654329] bg-[#FAF8F5]"
                      />
                    </div>
                  ) : (
                    <p className="text-[#473E37]">
                      {user.address && user.city
                        ? `${user.address}, ${user.city}`
                        : user.address || user.city || 'Chưa cập nhật'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Lịch sử yêu cầu báo giá thực tế từ Database */}
            <div className="bg-white border border-[#E7DCce] rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg font-semibold text-[#29231F]">
                  Lịch sử yêu cầu báo giá của bạn
                </h3>
                <span className="text-xs text-[#877B70] bg-[#FAF8F5] px-2.5 py-1 rounded-full border border-[#E7DCce]">
                  {userQuotes.length} yêu cầu
                </span>
              </div>

              {loadingQuotes ? (
                <div className="py-8 text-center text-xs text-gray-400">Đang tải dữ liệu từ CSDL...</div>
              ) : userQuotes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="w-14 h-14 bg-[#F7F3ED] rounded-full flex items-center justify-center mb-3">
                    <Calendar className="w-6 h-6 text-[#B5A090]" />
                  </div>
                  <p className="text-[#877B70] text-sm">Chưa có yêu cầu báo giá nào.</p>
                  <p className="text-[#B5A090] text-xs mt-1">
                    Khi bạn gửi form báo giá cho sản phẩm, tiến độ xử lý sẽ xuất hiện tại đây.
                  </p>
                  <a
                    href="/san-pham"
                    className="mt-4 inline-block bg-[#654329] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#533722] transition-colors"
                  >
                    Khám phá sản phẩm
                  </a>
                </div>
              ) : (
                <div className="divide-y divide-[#F7F3ED]">
                  {userQuotes.map((q) => {
                    const statusBadge =
                      q.status === 'completed'
                        ? { label: 'Đã hoàn thành', color: 'bg-green-50 text-green-700' }
                        : q.status === 'contacted'
                        ? { label: 'Đã liên hệ tư vấn', color: 'bg-blue-50 text-blue-700' }
                        : q.status === 'cancelled'
                        ? { label: 'Đã hủy', color: 'bg-gray-100 text-gray-500' }
                        : { label: 'Đang chờ xử lý', color: 'bg-amber-50 text-amber-700' };

                    return (
                      <div key={q.id} className="py-3.5 flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-[#29231F] truncate">
                            {q.product_name}
                          </p>
                          <p className="text-xs text-[#877B70] mt-0.5">
                            Ngày gửi: {new Date(q.created_at).toLocaleDateString('vi-VN')}
                            {q.note && ` — "${q.note}"`}
                          </p>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${statusBadge.color}`}>
                          {statusBadge.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

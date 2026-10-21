import React, { useState, useEffect, useRef } from 'react';
import { X, Eye, EyeOff, User, Mail, Phone, Lock, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

type AuthTab = 'login' | 'register';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: AuthTab;
  /** Callback sau khi đăng nhập/đăng ký thành công */
  onSuccess?: () => void;
}

const CITIES = [
  'TP. Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ', 'Bình Dương',
  'Đồng Nai', 'Long An', 'Hải Phòng', 'Bà Rịa – Vũng Tàu', 'Khác',
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'login',
  onSuccess,
}) => {
  const { login, register } = useAuth();
  const [tab, setTab] = useState<AuthTab>(defaultTab);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [regForm, setRegForm] = useState({
    name: '', email: '', phone: '', password: '', confirm: '', city: '',
  });

  useEffect(() => {
    if (isOpen) {
      setTab(defaultTab);
      setErrorMsg('');
      setSuccessMsg('');
      setLoginForm({ email: '', password: '' });
      setRegForm({ name: '', email: '', phone: '', password: '', confirm: '', city: '' });
      setTimeout(() => firstInputRef.current?.focus(), 120);
    }
  }, [isOpen, defaultTab]);

  // Đóng khi nhấn Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!loginForm.email || !loginForm.password) {
      setErrorMsg('Vui lòng điền đầy đủ thông tin.');
      return;
    }
    setIsSubmitting(true);
    const result = await login({ email: loginForm.email, password: loginForm.password });
    setIsSubmitting(false);
    if (result.success) {
      setSuccessMsg('Đăng nhập thành công! Chào mừng bạn.');
      setTimeout(() => { onSuccess?.(); onClose(); }, 1200);
    } else {
      setErrorMsg(result.error || 'Đã có lỗi xảy ra.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!regForm.name || !regForm.email || !regForm.phone || !regForm.password) {
      setErrorMsg('Vui lòng điền đầy đủ các trường bắt buộc.');
      return;
    }
    if (regForm.password.length < 6) {
      setErrorMsg('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }
    if (regForm.password !== regForm.confirm) {
      setErrorMsg('Mật khẩu xác nhận không khớp.');
      return;
    }
    const phoneReg = /^(0|\+84)[0-9]{9}$/;
    if (!phoneReg.test(regForm.phone.replace(/\s/g, ''))) {
      setErrorMsg('Số điện thoại không hợp lệ.');
      return;
    }
    setIsSubmitting(true);
    const result = await register({
      name: regForm.name,
      email: regForm.email,
      phone: regForm.phone,
      password: regForm.password,
      address: regForm.city,
    });
    setIsSubmitting(false);
    if (result.success) {
      setSuccessMsg('Đăng ký thành công! Chào mừng bạn đến với Cao Luật Decor.');
      setTimeout(() => { onSuccess?.(); onClose(); }, 1400);
    } else {
      setErrorMsg(result.error || 'Đã có lỗi xảy ra.');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={tab === 'login' ? 'Đăng nhập' : 'Đăng ký tài khoản'}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header strip */}
        <div className="bg-gradient-to-r from-[#654329] to-[#8B5E3C] px-6 pt-7 pb-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors p-1"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Brand */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center font-serif font-bold text-lg text-[#DFC7A7]">
              CL
            </div>
            <div>
              <p className="font-serif font-bold text-base leading-tight">CAO LUẬT DECOR</p>
              <p className="text-xs text-white/60 tracking-widest uppercase">Nội Thất Cao Cấp</p>
            </div>
          </div>

          {/* Tab switcher */}
          <div className="flex bg-white/15 rounded-xl p-1 gap-1">
            {(['login', 'register'] as const).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setErrorMsg(''); setSuccessMsg(''); }}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                  tab === t
                    ? 'bg-white text-[#654329] shadow-sm'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {t === 'login' ? 'Đăng Nhập' : 'Đăng Ký'}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {/* Alert messages */}
          {successMsg && (
            <div className="flex items-start gap-2 bg-green-50 border border-green-200 rounded-lg p-3 mb-4 text-sm text-green-700">
              <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}
          {errorMsg && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-sm text-red-600">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* ─── LOGIN FORM ─── */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4" noValidate>
              <div>
                <label className="block text-xs font-semibold text-[#473E37] uppercase tracking-wide mb-1.5" htmlFor="login-email">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#B5A090] absolute left-3 top-3" />
                  <input
                    ref={firstInputRef}
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    placeholder="example@email.com"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border border-[#D5C3AF] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#654329]/30 focus:border-[#654329] bg-[#FAF8F5] placeholder:text-[#C5B8A8] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#473E37] uppercase tracking-wide mb-1.5" htmlFor="login-password">
                  Mật khẩu *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#B5A090] absolute left-3 top-3" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Nhập mật khẩu"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="w-full pl-10 pr-10 py-2.5 border border-[#D5C3AF] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#654329]/30 focus:border-[#654329] bg-[#FAF8F5] placeholder:text-[#C5B8A8] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-[#B5A090] hover:text-[#654329]"
                    tabIndex={-1}
                    aria-label="Hiện/ẩn mật khẩu"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="luxury-btn w-full bg-[#654329] hover:bg-[#533722] disabled:opacity-60 text-white font-semibold py-3 rounded-lg text-sm transition-all flex items-center justify-center gap-2 mt-2"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Đang xử lý...</>
                ) : (
                  'Đăng Nhập'
                )}
              </button>

              {/* Demo hint */}
              <div className="bg-[#F7F3ED] rounded-lg p-3 text-xs text-[#877B70] space-y-0.5">
                <p className="font-semibold text-[#654329] mb-1">Tài khoản demo:</p>
                <p>👤 Khách hàng: <span className="font-mono">khachhang@demo.vn</span> / <span className="font-mono">123456</span></p>
                <p>🏪 Chủ shop: <span className="font-mono">owner@caoluatdecor.vn</span> / <span className="font-mono">Owner@2024</span></p>
                <p>🔐 Admin: <span className="font-mono">admin@caoluatdecor.vn</span> / <span className="font-mono">Admin@2024</span></p>
              </div>

              <p className="text-center text-sm text-[#877B70]">
                Chưa có tài khoản?{' '}
                <button
                  type="button"
                  onClick={() => setTab('register')}
                  className="text-[#654329] font-semibold hover:underline"
                >
                  Đăng ký ngay
                </button>
              </p>
            </form>
          )}

          {/* ─── REGISTER FORM ─── */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4" noValidate>
              <div className="grid grid-cols-1 gap-4">
                {/* Họ tên */}
                <div>
                  <label className="block text-xs font-semibold text-[#473E37] uppercase tracking-wide mb-1.5" htmlFor="reg-name">
                    Họ và tên *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#B5A090] absolute left-3 top-3" />
                    <input
                      ref={firstInputRef}
                      id="reg-name"
                      type="text"
                      autoComplete="name"
                      placeholder="Nguyễn Văn A"
                      value={regForm.name}
                      onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 border border-[#D5C3AF] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#654329]/30 focus:border-[#654329] bg-[#FAF8F5] placeholder:text-[#C5B8A8] transition-all"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-[#473E37] uppercase tracking-wide mb-1.5" htmlFor="reg-email">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#B5A090] absolute left-3 top-3" />
                    <input
                      id="reg-email"
                      type="email"
                      autoComplete="email"
                      placeholder="example@email.com"
                      value={regForm.email}
                      onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 border border-[#D5C3AF] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#654329]/30 focus:border-[#654329] bg-[#FAF8F5] placeholder:text-[#C5B8A8] transition-all"
                    />
                  </div>
                </div>

                {/* SĐT */}
                <div>
                  <label className="block text-xs font-semibold text-[#473E37] uppercase tracking-wide mb-1.5" htmlFor="reg-phone">
                    Số điện thoại *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#B5A090] absolute left-3 top-3" />
                    <input
                      id="reg-phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="0901 234 567"
                      value={regForm.phone}
                      onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 border border-[#D5C3AF] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#654329]/30 focus:border-[#654329] bg-[#FAF8F5] placeholder:text-[#C5B8A8] transition-all"
                    />
                  </div>
                </div>

                {/* Tỉnh/Thành phố */}
                <div>
                  <label className="block text-xs font-semibold text-[#473E37] uppercase tracking-wide mb-1.5" htmlFor="reg-city">
                    Tỉnh / Thành phố
                  </label>
                  <select
                    id="reg-city"
                    value={regForm.city}
                    onChange={(e) => setRegForm({ ...regForm, city: e.target.value })}
                    className="w-full px-4 py-2.5 border border-[#D5C3AF] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#654329]/30 focus:border-[#654329] bg-[#FAF8F5] text-[#29231F] transition-all"
                  >
                    <option value="">-- Chọn tỉnh/thành phố --</option>
                    {CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Mật khẩu */}
                <div>
                  <label className="block text-xs font-semibold text-[#473E37] uppercase tracking-wide mb-1.5" htmlFor="reg-password">
                    Mật khẩu * <span className="text-[#B5A090] font-normal">(ít nhất 6 ký tự)</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#B5A090] absolute left-3 top-3" />
                    <input
                      id="reg-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="Tạo mật khẩu mạnh"
                      value={regForm.password}
                      onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                      className="w-full pl-10 pr-10 py-2.5 border border-[#D5C3AF] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#654329]/30 focus:border-[#654329] bg-[#FAF8F5] placeholder:text-[#C5B8A8] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-[#B5A090] hover:text-[#654329]"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {/* Strength indicator */}
                  {regForm.password && (
                    <div className="flex gap-1 mt-1.5">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-all ${
                            regForm.password.length >= i * 3
                              ? regForm.password.length >= 10
                                ? 'bg-green-500'
                                : regForm.password.length >= 7
                                ? 'bg-yellow-500'
                                : 'bg-red-400'
                              : 'bg-[#E7DCce]'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Xác nhận mật khẩu */}
                <div>
                  <label className="block text-xs font-semibold text-[#473E37] uppercase tracking-wide mb-1.5" htmlFor="reg-confirm">
                    Xác nhận mật khẩu *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#B5A090] absolute left-3 top-3" />
                    <input
                      id="reg-confirm"
                      type={showConfirm ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="Nhập lại mật khẩu"
                      value={regForm.confirm}
                      onChange={(e) => setRegForm({ ...regForm, confirm: e.target.value })}
                      className={`w-full pl-10 pr-10 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#654329]/30 bg-[#FAF8F5] placeholder:text-[#C5B8A8] transition-all ${
                        regForm.confirm && regForm.confirm !== regForm.password
                          ? 'border-red-400 focus:border-red-400'
                          : regForm.confirm && regForm.confirm === regForm.password
                          ? 'border-green-400 focus:border-green-400'
                          : 'border-[#D5C3AF] focus:border-[#654329]'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-2.5 text-[#B5A090] hover:text-[#654329]"
                      tabIndex={-1}
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="luxury-btn w-full bg-[#654329] hover:bg-[#533722] disabled:opacity-60 text-white font-semibold py-3 rounded-lg text-sm transition-all flex items-center justify-center gap-2 mt-2"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Đang tạo tài khoản...</>
                ) : (
                  'Tạo Tài Khoản'
                )}
              </button>

              <p className="text-center text-xs text-[#877B70]">
                Bằng cách đăng ký, bạn đồng ý với{' '}
                <span className="text-[#654329] cursor-pointer hover:underline">điều khoản sử dụng</span>{' '}
                của chúng tôi.
              </p>

              <p className="text-center text-sm text-[#877B70]">
                Đã có tài khoản?{' '}
                <button
                  type="button"
                  onClick={() => setTab('login')}
                  className="text-[#654329] font-semibold hover:underline"
                >
                  Đăng nhập
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

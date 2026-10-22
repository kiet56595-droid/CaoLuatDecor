import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { User, UserRole, UserStatus, RegisterPayload, AuthCredentials } from '../types';
import { supabase } from '../lib/supabase';

// ── Types ────────────────────────────────────────────────────
interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: AuthCredentials) => Promise<{ success: boolean; error?: string }>;
  register: (payload: RegisterPayload) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  hasRole: (...roles: UserRole[]) => boolean;
}

const STORAGE_KEY = 'cld_auth_user';

// Danh sách tài khoản thử nghiệm nhanh (Demo fallbacks)
const SEED_USERS: (User & { _password: string })[] = [
  {
    id: 'admin-001',
    name: 'Admin Hệ Thống',
    email: 'admin@caoluatdecor.vn',
    phone: '0901000001',
    role: 'ADMIN',
    status: 'ACTIVE',
    createdAt: '2024-01-01T00:00:00Z',
    _password: 'Admin@2024',
  },
  {
    id: 'shop-001',
    name: 'Nguyễn Văn Cao (Xưởng Mộc)',
    email: 'owner@caoluatdecor.vn',
    phone: '0901000002',
    role: 'SHOP_OWNER',
    status: 'ACTIVE',
    shopId: 'Xưởng Mộc Cao Luật',
    createdAt: '2024-01-01T00:00:00Z',
    _password: 'Owner@2024',
  },
  {
    id: 'cust-demo',
    name: 'Khách Hàng Mẫu',
    email: 'khachhang@demo.vn',
    phone: '0901000003',
    role: 'CUSTOMER',
    status: 'ACTIVE',
    address: '123 Đường Lê Lợi, P.1',
    city: 'TP. Hồ Chí Minh',
    createdAt: '2024-06-01T00:00:00Z',
    _password: '123456',
  },
];

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Tự động kiểm tra session Supabase hoặc localStorage khi tải trang
  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      try {
        // Kiểm tra session từ Supabase
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && isMounted) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            const mappedUser: User = {
              id: profile.id,
              name: profile.name || session.user.email?.split('@')[0] || 'User',
              email: profile.email || session.user.email || '',
              phone: profile.phone || '',
              role: (profile.role as UserRole) || 'CUSTOMER',
              status: (profile.status as UserStatus) || 'ACTIVE',
              avatar: profile.avatar || undefined,
              address: profile.address || undefined,
              city: profile.city || undefined,
              shopId: profile.shop_name || undefined,
              createdAt: profile.created_at,
            };
            setUser(mappedUser);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(mappedUser));
            setIsLoading(false);
            return;
          }
        }

        // Nếu không có session Supabase, kiểm tra cached user
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored && isMounted) {
          setUser(JSON.parse(stored));
        }
      } catch (err) {
        console.warn('Lỗi kiểm tra session:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    initAuth();

    // Lắng nghe thay đổi trạng thái đăng nhập từ Supabase
    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          const mappedUser: User = {
            id: profile.id,
            name: profile.name || session.user.email?.split('@')[0] || 'User',
            email: profile.email || session.user.email || '',
            phone: profile.phone || '',
            role: (profile.role as UserRole) || 'CUSTOMER',
            status: (profile.status as UserStatus) || 'ACTIVE',
            avatar: profile.avatar || undefined,
            address: profile.address || undefined,
            city: profile.city || undefined,
            shopId: profile.shop_name || undefined,
            createdAt: profile.created_at,
          };
          setUser(mappedUser);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(mappedUser));
        }
      }
    });

    return () => {
      isMounted = false;
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // 2. Đăng nhập (Thử Supabase trước, nếu thất bại thử Seed Demo Users)
  const login = useCallback(
    async (credentials: AuthCredentials): Promise<{ success: boolean; error?: string }> => {
      setIsLoading(true);
      try {
        // Thử đăng nhập qua Supabase Auth
        const { data: sbData, error: sbError } = await supabase.auth.signInWithPassword({
          email: credentials.email.trim(),
          password: credentials.password,
        });

        if (!sbError && sbData?.user) {
          // Lấy profile từ Supabase
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', sbData.user.id)
            .single();

          if (profile) {
            if (profile.status === 'BANNED') {
              await supabase.auth.signOut();
              setIsLoading(false);
              return { success: false, error: 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ Admin.' };
            }

            const mappedUser: User = {
              id: profile.id,
              name: profile.name || sbData.user.email?.split('@')[0] || 'User',
              email: profile.email || sbData.user.email || '',
              phone: profile.phone || '',
              role: (profile.role as UserRole) || 'CUSTOMER',
              status: (profile.status as UserStatus) || 'ACTIVE',
              avatar: profile.avatar || undefined,
              address: profile.address || undefined,
              city: profile.city || undefined,
              shopId: profile.shop_name || undefined,
              createdAt: profile.created_at,
            };

            setUser(mappedUser);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(mappedUser));
            setIsLoading(false);
            return { success: true };
          }
        }

        // Nếu Supabase không khớp, kiểm tra tài khoản Seed Demo
        const demoFound = SEED_USERS.find(
          (u) =>
            u.email.toLowerCase() === credentials.email.trim().toLowerCase() &&
            u._password === credentials.password
        );

        if (demoFound) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { _password, ...safeUser } = demoFound;
          setUser(safeUser);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(safeUser));
          setIsLoading(false);
          return { success: true };
        }

        setIsLoading(false);
        return {
          success: false,
          error: sbError?.message || 'Email hoặc mật khẩu không chính xác.',
        };
      } catch (err: any) {
        setIsLoading(false);
        return { success: false, error: err?.message || 'Lỗi kết nối khi đăng nhập' };
      }
    },
    []
  );

  // 3. Đăng ký tài khoản (Tạo trên Supabase Auth và lưu profiles)
  const register = useCallback(
    async (payload: RegisterPayload): Promise<{ success: boolean; error?: string }> => {
      setIsLoading(true);
      try {
        const { data: sbData, error: sbError } = await supabase.auth.signUp({
          email: payload.email.trim(),
          password: payload.password,
          options: {
            data: {
              name: payload.name.trim(),
              phone: payload.phone.trim(),
              role: 'CUSTOMER',
            },
          },
        });

        if (sbError) {
          setIsLoading(false);
          return { success: false, error: sbError.message };
        }

        if (sbData?.user) {
          // Lưu / Cập nhật hồ sơ vào bảng profiles
          await supabase.from('profiles').upsert({
            id: sbData.user.id,
            email: payload.email.trim(),
            name: payload.name.trim(),
            phone: payload.phone.trim(),
            address: payload.address?.trim() || null,
            role: 'CUSTOMER',
            status: 'ACTIVE',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

          const newUser: User = {
            id: sbData.user.id,
            name: payload.name.trim(),
            email: payload.email.trim(),
            phone: payload.phone.trim(),
            role: 'CUSTOMER',
            status: 'ACTIVE',
            address: payload.address?.trim() || undefined,
            createdAt: new Date().toISOString(),
          };

          setUser(newUser);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
          setIsLoading(false);
          return { success: true };
        }

        setIsLoading(false);
        return { success: false, error: 'Không thể tạo tài khoản, vui lòng thử lại.' };
      } catch (err: any) {
        setIsLoading(false);
        return { success: false, error: err?.message || 'Lỗi không xác định khi đăng ký' };
      }
    },
    []
  );

  // 4. Đăng xuất
  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch {}
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // 5. Cập nhật Profile (Lưu lên Supabase profiles và local state)
  const updateProfile = useCallback(
    async (data: Partial<User>) => {
      if (!user) return;
      try {
        await supabase
          .from('profiles')
          .update({
            name: data.name,
            phone: data.phone,
            address: data.address,
            city: data.city,
            shop_name: data.shopId,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);
      } catch (err) {
        console.warn('Không thể cập nhật profile lên Supabase:', err);
      }

      const updated = { ...user, ...data };
      setUser(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    },
    [user]
  );

  // 6. Kiểm tra quyền role
  const hasRole = useCallback(
    (...roles: UserRole[]): boolean => {
      if (!user) return roles.includes('GUEST');
      return roles.includes(user.role);
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth phải được dùng bên trong <AuthProvider>');
  return ctx;
}

export default AuthContext;

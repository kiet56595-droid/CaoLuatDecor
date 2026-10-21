import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { User, UserRole, RegisterPayload, AuthCredentials } from '../types';

// ── Types ────────────────────────────────────────────────────
interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: AuthCredentials) => Promise<{ success: boolean; error?: string }>;
  register: (payload: RegisterPayload) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  hasRole: (...roles: UserRole[]) => boolean;
}

// ── Mock Data (thay thế bằng API calls khi có backend) ───────
const STORAGE_KEY = 'cld_auth_user';
const MOCK_USERS_KEY = 'cld_mock_users';

const SEED_USERS: User[] = [
  {
    id: 'admin-001',
    name: 'Admin Hệ Thống',
    email: 'admin@caoluatdecor.vn',
    phone: '0901000001',
    role: 'ADMIN',
    status: 'ACTIVE',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'shop-001',
    name: 'Nguyễn Văn Cao',
    email: 'owner@caoluatdecor.vn',
    phone: '0901000002',
    role: 'SHOP_OWNER',
    status: 'ACTIVE',
    shopId: 'shop-main',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cust-demo',
    name: 'Khách Hàng Demo',
    email: 'khachhang@demo.vn',
    phone: '0901000003',
    role: 'CUSTOMER',
    status: 'ACTIVE',
    address: '123 Đường Lê Lợi, P.1',
    city: 'TP. Hồ Chí Minh',
    createdAt: '2024-06-01T00:00:00Z',
  },
];

function getMockUsers(): (User & { _password: string })[] {
  try {
    const raw = localStorage.getItem(MOCK_USERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  const initial = SEED_USERS.map((u) => ({
    ...u,
    _password:
      u.role === 'ADMIN' ? 'Admin@2024' : u.role === 'SHOP_OWNER' ? 'Owner@2024' : '123456',
  }));
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(initial));
  return initial;
}

function saveMockUsers(users: (User & { _password: string })[]) {
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
}

// ── Context ──────────────────────────────────────────────────
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setUser(JSON.parse(stored));
    } catch {}
    setIsLoading(false);
  }, []);

  const login = useCallback(
    async (credentials: AuthCredentials): Promise<{ success: boolean; error?: string }> => {
      setIsLoading(true);
      await new Promise((r) => setTimeout(r, 800));
      const users = getMockUsers();
      const found = users.find(
        (u) =>
          u.email.toLowerCase() === credentials.email.toLowerCase() &&
          u._password === credentials.password
      );
      if (!found) {
        setIsLoading(false);
        return { success: false, error: 'Email hoặc mật khẩu không đúng.' };
      }
      if (found.status === 'BANNED') {
        setIsLoading(false);
        return { success: false, error: 'Tài khoản đã bị khóa. Vui lòng liên hệ hỗ trợ.' };
      }
      if (found.status === 'PENDING_APPROVAL') {
        setIsLoading(false);
        return { success: false, error: 'Tài khoản đang chờ duyệt.' };
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _password, ...safeUser } = found;
      setUser(safeUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(safeUser));
      setIsLoading(false);
      return { success: true };
    },
    []
  );

  const register = useCallback(
    async (payload: RegisterPayload): Promise<{ success: boolean; error?: string }> => {
      setIsLoading(true);
      await new Promise((r) => setTimeout(r, 900));
      const users = getMockUsers();
      const exists = users.find((u) => u.email.toLowerCase() === payload.email.toLowerCase());
      if (exists) {
        setIsLoading(false);
        return { success: false, error: 'Email này đã được đăng ký. Vui lòng đăng nhập.' };
      }
      const newUser: User & { _password: string } = {
        id: `cust-${Date.now()}`,
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        role: 'CUSTOMER',
        status: 'ACTIVE',
        address: payload.address,
        createdAt: new Date().toISOString(),
        _password: payload.password,
      };
      saveMockUsers([...users, newUser]);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _password, ...safeUser } = newUser;
      setUser(safeUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(safeUser));
      setIsLoading(false);
      return { success: true };
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const updateProfile = useCallback(async (data: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...data };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      const users = getMockUsers();
      const idx = users.findIndex((u) => u.id === prev.id);
      if (idx !== -1) {
        users[idx] = { ...users[idx], ...data };
        saveMockUsers(users);
      }
      return updated;
    });
  }, []);

  const hasRole = useCallback(
    (...roles: UserRole[]): boolean => {
      if (!user) return roles.includes('GUEST');
      return roles.includes(user.role);
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, login, register, logout, updateProfile, hasRole }}
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

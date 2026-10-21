import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** Danh sách roles được phép truy cập. Nếu để trống, chỉ cần đăng nhập là đủ. */
  allowedRoles?: UserRole[];
  /** URL chuyển hướng khi không đủ quyền (mặc định: '/'). */
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = [],
  redirectTo = '/',
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  // Đang kiểm tra phiên đăng nhập
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#654329] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#877B70] text-sm">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  // Chưa đăng nhập → chuyển về redirectTo và lưu địa chỉ hiện tại để redirect lại sau khi login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Kiểm tra role nếu có yêu cầu
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    // Có tài khoản nhưng không đủ quyền
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">🔒</div>
          <h1 className="font-serif text-2xl text-[#29231F] mb-3">Không đủ quyền truy cập</h1>
          <p className="text-[#877B70] mb-6">
            Tài khoản của bạn không có quyền truy cập vào trang này.
          </p>
          <a
            href="/"
            className="inline-block bg-[#654329] text-white px-6 py-2.5 rounded-md text-sm font-medium hover:bg-[#533722] transition-colors"
          >
            Về trang chủ
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { TopBar } from './components/layout/TopBar';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { FloatingContact } from './components/layout/FloatingContact';
import { QuoteModal } from './components/products/QuoteModal';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AccountPage } from './pages/AccountPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { ShopDashboardPage } from './pages/ShopDashboardPage';

import { Product } from './types';

// Scroll to top automatically on route changes
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export const App: React.FC = () => {
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteProduct, setQuoteProduct] = useState<Product | null>(null);

  const handleOpenQuote = (product?: Product | null) => {
    setQuoteProduct(product || null);
    setQuoteModalOpen(true);
  };

  const handleCloseQuote = () => {
    setQuoteModalOpen(false);
    setQuoteProduct(null);
  };

  return (
    <AuthProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#29231F] selection:bg-[#654329] selection:text-white">
          {/* Top Info Bar */}
          <TopBar />

          {/* Sticky Header */}
          <Header onOpenQuoteModal={() => handleOpenQuote(null)} />

          {/* Main Routed Content */}
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage onOpenQuote={handleOpenQuote} />} />
              <Route
                path="/san-pham"
                element={<ProductsPage onOpenQuote={handleOpenQuote} />}
              />
              <Route path="/san-pham/:slug"
                element={<ProductDetailPage onOpenQuote={handleOpenQuote} />}
              />
              <Route path="/danh-muc" element={<CategoriesPage />} />
              <Route path="/du-an" element={<Navigate to="/san-pham" replace />} />
              <Route path="/gioi-thieu" element={<Navigate to="/san-pham" replace />} />
              <Route path="/lien-he" element={<Navigate to="/san-pham" replace />} />

              {/* ── Protected: Chỉ dành cho Khách hàng đã đăng nhập ── */}
              <Route
                path="/tai-khoan/*"
                element={
                  <ProtectedRoute allowedRoles={['CUSTOMER', 'SHOP_OWNER', 'ADMIN']} redirectTo="/">
                    <AccountPage />
                  </ProtectedRoute>
                }
              />

              {/* ── Protected: Dành cho Chủ Shop ── */}
              <Route
                path="/shop/*"
                element={
                  <ProtectedRoute allowedRoles={['SHOP_OWNER']} redirectTo="/">
                    <ShopDashboardPage />
                  </ProtectedRoute>
                }
              />

              {/* ── Protected: Dành cho Quản trị viên (Admin) ── */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']} redirectTo="/">
                    <AdminDashboardPage />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>

          {/* Footer */}
          <Footer />

          {/* Floating Contact Widget */}
          <FloatingContact onOpenQuoteModal={() => handleOpenQuote(null)} />

          {/* Global Quote Consultation Modal */}
          <QuoteModal
            isOpen={quoteModalOpen}
            onClose={handleCloseQuote}
            product={quoteProduct}
          />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;

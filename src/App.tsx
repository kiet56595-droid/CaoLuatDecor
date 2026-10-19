import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { TopBar } from './components/layout/TopBar';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { FloatingContact } from './components/layout/FloatingContact';
import { ConfigNoticeBanner } from './components/common/ConfigNoticeBanner';
import { QuoteModal } from './components/products/QuoteModal';

import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';

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
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#29231F] selection:bg-[#654329] selection:text-white">
        {/* Notice for Demo Placeholder Config */}
        <ConfigNoticeBanner />

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
            <Route
              path="/san-pham/:slug"
              element={<ProductDetailPage onOpenQuote={handleOpenQuote} />}
            />
            <Route path="/danh-muc" element={<CategoriesPage />} />
            <Route path="/du-an" element={<ProjectsPage />} />
            <Route path="/gioi-thieu" element={<AboutPage />} />
            <Route path="/lien-he" element={<ContactPage />} />
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
  );
};

export default App;

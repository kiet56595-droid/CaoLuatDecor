import React, { useState, useEffect } from 'react';
import { HeroBanner } from '../components/home/HeroBanner';
import { SubBanners } from '../components/home/SubBanners';
import { CategoryGrid } from '../components/home/CategoryGrid';
import { FeaturedSection } from '../components/home/FeaturedSection';
import { ProductTabsSection } from '../components/home/ProductTabsSection';
import { CtaBanner } from '../components/home/CtaBanner';
import { PRODUCTS } from '../data/products';
import { Product } from '../types';
import { fetchProductsFromDB } from '../lib/supabase';

interface HomePageProps {
  onOpenQuote: (product?: Product | null) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenQuote }) => {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);

  useEffect(() => {
    fetchProductsFromDB().then((data) => {
      if (data && data.length > 0) setProducts(data);
    });
  }, []);

  return (
    <div className="space-y-0">
      <HeroBanner />
      <SubBanners />
      <CategoryGrid />
      <FeaturedSection products={products} onOpenQuote={onOpenQuote} />
      <ProductTabsSection products={products} onOpenQuote={onOpenQuote} />
      <CtaBanner onOpenQuote={() => onOpenQuote(null)} />
    </div>
  );
};

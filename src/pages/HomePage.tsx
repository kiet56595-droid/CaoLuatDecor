import React from 'react';
import { HeroBanner } from '../components/home/HeroBanner';
import { SubBanners } from '../components/home/SubBanners';
import { CategoryGrid } from '../components/home/CategoryGrid';
import { FeaturedSection } from '../components/home/FeaturedSection';
import { ProductTabsSection } from '../components/home/ProductTabsSection';
import { BrandAdvantages } from '../components/home/BrandAdvantages';
import { TestimonialsSection } from '../components/home/TestimonialsSection';
import { CtaBanner } from '../components/home/CtaBanner';
import { PRODUCTS } from '../data/products';
import { Product } from '../types';

interface HomePageProps {
  onOpenQuote: (product?: Product | null) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenQuote }) => {
  return (
    <div className="space-y-0">
      <HeroBanner />
      <SubBanners />
      <CategoryGrid />
      <FeaturedSection products={PRODUCTS} onOpenQuote={onOpenQuote} />
      <ProductTabsSection products={PRODUCTS} onOpenQuote={onOpenQuote} />
      <BrandAdvantages />
      <TestimonialsSection />
      <CtaBanner onOpenQuote={() => onOpenQuote(null)} />
    </div>
  );
};

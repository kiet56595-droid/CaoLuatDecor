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
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const raw = localStorage.getItem('cld_custom_products');
      const delRaw = localStorage.getItem('cld_deleted_product_ids');
      const delSet = new Set(delRaw ? JSON.parse(delRaw) : []);
      if (raw) {
        const localList: Product[] = JSON.parse(raw);
        const localMap = new Map(localList.map((p) => [p.id, p]));
        let list = PRODUCTS.map((p) => localMap.get(p.id) || p);
        const existingIds = new Set(list.map((p) => p.id));
        for (const cp of localList) {
          if (!existingIds.has(cp.id)) list.unshift(cp);
        }
        if (delSet.size > 0) list = list.filter((p) => !delSet.has(p.id));
        return list;
      }
    } catch {}
    return PRODUCTS;
  });

  useEffect(() => {
    const loadHomeProducts = () => {
      fetchProductsFromDB().then((data) => {
        if (data && data.length > 0) setProducts(data);
      });
    };

    loadHomeProducts();

    window.addEventListener('cld_products_changed', loadHomeProducts);
    return () => window.removeEventListener('cld_products_changed', loadHomeProducts);
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

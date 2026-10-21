export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  itemCount: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  code: string;
  categoryId: string;
  categoryName: string;
  price: number | null; // null = Liên hệ báo giá
  displayPrice?: string; // Optional custom display (e.g., "Từ 15.000.000 đ")
  images: string[];
  shortDescription: string;
  description: string;
  material: string;
  dimensions: string;
  warranty: string;
  origin: string;
  isFeatured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  inStock?: boolean;
  features?: string[];
}

export type ProjectCategory = 
  | 'all'
  | 'can-ho'
  | 'nha-pho'
  | 'biet-thu'
  | 'phong-khach'
  | 'phong-ngu'
  | 'nha-bep';

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: ProjectCategory;
  categoryLabel: string;
  location: string;
  area: string;
  style: string;
  year: string;
  thumbnail: string;
  gallery: string[];
  description: string;
  scopeOfWork: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  projectType: string;
  comment: string;
  rating: number;
  avatar: string;
  isDemo: true;
}

// ── Auth & User ──────────────────────────────────────────────
export type UserRole = 'GUEST' | 'CUSTOMER' | 'SHOP_OWNER' | 'ADMIN';

export type UserStatus = 'ACTIVE' | 'BANNED' | 'PENDING_APPROVAL';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  address?: string;
  city?: string;
  shopId?: string; // Chỉ dành cho SHOP_OWNER
  createdAt: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  address?: string;
}

export interface QuoteRequestItem {
  id: string;
  userId: string;
  productId?: string;
  productName?: string;
  message: string;
  status: 'PENDING' | 'RESPONDED' | 'CLOSED';
  createdAt: string;
}

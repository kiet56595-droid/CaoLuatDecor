import { createClient } from '@supabase/supabase-js';
import { DBProfile, DBQuoteRequest, DBReview, Product, UserRole, UserStatus } from '../types';
import { PRODUCTS } from '../data/products';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://beogjxnmmglnlgurplfn.supabase.co';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_euIxZ_TIu5_XvDxeQeXP1A_DcWTnmXk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ========================================================
// 1. NGHIỆP VỤ BÁO GIÁ (QUOTE REQUESTS)
// Dành cho: GUEST, CUSTOMER (gửi) | SHOP_OWNER, ADMIN (xử lý)
// ========================================================

export interface QuoteRequestPayload {
  customer_name: string;
  phone: string;
  email?: string;
  product_id?: string;
  product_name?: string;
  product_code?: string;
  shop_id?: string;
  user_id?: string;
  note?: string;
}

/**
 * Gửi yêu cầu báo giá lưu trực tiếp vào bảng `quote_requests` trên Supabase
 */
export async function submitQuoteRequest(data: QuoteRequestPayload) {
  try {
    const { data: result, error } = await supabase
      .from('quote_requests')
      .insert([
        {
          customer_name: data.customer_name,
          phone: data.phone,
          email: data.email || null,
          product_id: data.product_id || null,
          product_name: data.product_name || 'Tư vấn tổng thể nội thất',
          product_code: data.product_code || null,
          shop_id: data.shop_id || null,
          user_id: data.user_id || null,
          note: data.note || null,
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.warn('Supabase insert warning:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true, data: result };
  } catch (err: any) {
    console.error('Lỗi kết nối Supabase:', err);
    return { success: false, error: err?.message || 'Lỗi không xác định' };
  }
}

/**
 * Lấy danh sách yêu cầu báo giá từ Supabase
 */
export async function fetchQuoteRequests(filterShopId?: string): Promise<DBQuoteRequest[]> {
  try {
    let query = supabase
      .from('quote_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (filterShopId) {
      query = query.or(`shop_id.eq.${filterShopId},shop_id.is.null`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data as DBQuoteRequest[]) || [];
  } catch (err) {
    console.warn('Không thể tải quote_requests từ Supabase:', err);
    return [];
  }
}

/**
 * Cập nhật trạng thái yêu cầu báo giá
 */
export async function updateQuoteRequestStatus(
  id: string,
  status: string,
  adminNote?: string
) {
  try {
    const updates: Record<string, any> = {
      status,
      updated_at: new Date().toISOString(),
    };
    if (adminNote !== undefined) updates.admin_note = adminNote;

    const { data, error } = await supabase
      .from('quote_requests')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (err: any) {
    console.error('Lỗi cập nhật báo giá:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Xóa yêu cầu báo giá
 */
export async function deleteQuoteRequest(id: string) {
  try {
    const { error } = await supabase.from('quote_requests').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ========================================================
// 2. NGHIỆP VỤ HỒ SƠ NGƯỜI DÙNG (PROFILES)
// Dành cho: ADMIN (quản trị, phân quyền), CUSTOMER (sửa profile)
// ========================================================

/**
 * Lấy toàn bộ danh sách profiles người dùng
 */
export async function fetchProfiles(): Promise<DBProfile[]> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data as DBProfile[]) || [];
  } catch (err) {
    console.warn('Lỗi tải profiles từ Supabase:', err);
    return [];
  }
}

/**
 * Cập nhật vai trò người dùng (ADMIN, SHOP_OWNER, CUSTOMER)
 */
export async function updateProfileRole(id: string, role: UserRole) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select();
    if (error) throw error;
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Cập nhật trạng thái người dùng (ACTIVE, BANNED, PENDING_APPROVAL)
 */
export async function updateProfileStatus(id: string, status: UserStatus) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select();
    if (error) throw error;
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Xóa profile người dùng
 */
export async function deleteProfile(id: string) {
  try {
    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ========================================================
// 3. NGHIỆP VỤ SẢN PHẨM (PRODUCTS)
// Dành cho: SHOP_OWNER (quản lý kho shop), ADMIN (toàn sàn), GUEST/CUSTOMER (xem)
// ========================================================

/**
 * Lấy sản phẩm từ database Supabase (nếu trống sẽ tự fallback static)
 */
export async function fetchProductsFromDB(shopId?: string): Promise<Product[]> {
  try {
    let query = supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (shopId) {
      query = query.eq('shop_id', shopId);
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      // Fallback về danh sách PRODUCTS mẫu nếu Supabase chưa có dòng nào
      return PRODUCTS;
    }

    // Map Supabase DB columns sang Product interface
    return data.map((item) => ({
      id: item.id,
      slug: item.slug,
      name: item.name,
      code: item.code || '',
      categoryId: item.category_id || '',
      categoryName: item.category_name || '',
      price: item.price !== null ? Number(item.price) : null,
      displayPrice: item.display_price || undefined,
      images: Array.isArray(item.images) ? item.images : [],
      shortDescription: item.short_description || '',
      description: item.description || '',
      material: item.material || '',
      dimensions: item.dimensions || '',
      warranty: item.warranty || '',
      origin: item.origin || '',
      inStock: item.in_stock ?? true,
      isFeatured: item.is_featured ?? false,
      isNew: item.is_new ?? false,
      isBestSeller: item.is_best_seller ?? false,
      features: Array.isArray(item.features) ? item.features : [],
    }));
  } catch (err) {
    console.warn('Lỗi lấy products từ Supabase, dùng static fallback:', err);
    return PRODUCTS;
  }
}

/**
 * Thêm sản phẩm mới vào Supabase
 */
export async function createProductInDB(product: Partial<Product> & { shopId?: string }) {
  try {
    const slug =
      product.slug ||
      (product.name || 'san-pham')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') + `-${Date.now().toString().slice(-4)}`;

    const row = {
      id: product.id || undefined,
      slug,
      name: product.name,
      code: product.code || '',
      category_id: product.categoryId || null,
      category_name: product.categoryName || '',
      shop_id: product.shopId || null,
      price: product.price ?? null,
      display_price: product.displayPrice || null,
      images: product.images || [],
      short_description: product.shortDescription || '',
      description: product.description || '',
      material: product.material || '',
      dimensions: product.dimensions || '',
      warranty: product.warranty || '',
      origin: product.origin || 'Xưởng Cao Luật Decor',
      in_stock: product.inStock ?? true,
      is_featured: product.isFeatured ?? false,
      is_new: product.isNew ?? true,
      is_best_seller: product.isBestSeller ?? false,
      features: product.features || [],
      status: 'published',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase.from('products').insert([row]).select();
    if (error) throw error;
    return { success: true, data: data?.[0] };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Cập nhật tình trạng tồn kho sản phẩm (In Stock / Out of Stock)
 */
export async function toggleProductStockInDB(id: string, currentInStock: boolean) {
  try {
    const { data, error } = await supabase
      .from('products')
      .update({ in_stock: !currentInStock, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select();
    if (error) throw error;
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Xóa sản phẩm khỏi database
 */
export async function deleteProductInDB(id: string) {
  try {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Đồng bộ toàn bộ sản phẩm mẫu có sẵn lên database Supabase (Seed Data)
 */
export async function seedProductsToSupabase(shopId?: string) {
  try {
    const rows = PRODUCTS.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      code: p.code,
      category_id: p.categoryId,
      category_name: p.categoryName,
      shop_id: shopId || null,
      price: p.price,
      display_price: p.displayPrice || null,
      images: p.images,
      short_description: p.shortDescription,
      description: p.description,
      material: p.material,
      dimensions: p.dimensions,
      warranty: p.warranty,
      origin: p.origin,
      in_stock: p.inStock ?? true,
      is_featured: p.isFeatured ?? false,
      is_new: p.isNew ?? false,
      is_best_seller: p.isBestSeller ?? false,
      features: p.features || [],
      status: 'published',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    const { data, error } = await supabase
      .from('products')
      .upsert(rows, { onConflict: 'id' })
      .select();

    if (error) throw error;
    return { success: true, count: data?.length || rows.length };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ========================================================
// 4. NGHIỆP VỤ ĐÁNH GIÁ (REVIEWS)
// ========================================================

/**
 * Lấy danh sách đánh giá từ Supabase
 */
export async function fetchReviewsFromDB(productId?: string): Promise<DBReview[]> {
  try {
    let query = supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (productId) {
      query = query.eq('product_id', productId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data as DBReview[]) || [];
  } catch (err) {
    console.warn('Lỗi lấy reviews:', err);
    return [];
  }
}

/**
 * Gửi đánh giá mới lên Supabase
 */
export async function submitReviewInDB(review: {
  client_name: string;
  rating: number;
  comment: string;
  product_id?: string;
  user_id?: string;
}) {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .insert([
        {
          ...review,
          is_approved: true,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

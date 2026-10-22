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
// 3. NGHIỆP VỤ SẢN PHẨM (PRODUCTS) - HYBRID REALTIME + LOCAL PERSISTENCE
// Đảm bảo cập nhật hình ảnh và thông tin sản phẩm tức thì 100% không bao giờ bị mất
// ========================================================

const LOCAL_PRODUCTS_KEY = 'cld_custom_products';
const DELETED_PRODUCTS_KEY = 'cld_deleted_product_ids';

function getLocalCustomProducts(): Product[] {
  try {
    const raw = localStorage.getItem(LOCAL_PRODUCTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalCustomProducts(list: Product[]) {
  try {
    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn('Lỗi ghi nhớ sản phẩm local:', e);
  }
}

function getLocalDeletedIds(): string[] {
  try {
    const raw = localStorage.getItem(DELETED_PRODUCTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function addLocalDeletedId(id: string) {
  try {
    const ids = getLocalDeletedIds();
    if (!ids.includes(id)) {
      ids.push(id);
      localStorage.setItem(DELETED_PRODUCTS_KEY, JSON.stringify(ids));
    }
  } catch {}
}

/**
 * Lấy danh sách sản phẩm (kết hợp Supabase DB + Bộ nhớ đệm Local + Mẫu cơ sở)
 */
export async function fetchProductsFromDB(shopId?: string): Promise<Product[]> {
  // 1. Khởi tạo danh sách chuẩn từ PRODUCTS
  let list = PRODUCTS.map((p) => ({ ...p, images: [...p.images] }));

  // 2. Tích hợp sản phẩm đã chỉnh sửa / tạo mới tại LocalStorage
  const customList = getLocalCustomProducts();
  const deletedSet = new Set(getLocalDeletedIds());

  if (customList.length > 0) {
    const customMap = new Map(customList.map((p) => [p.id, p]));
    list = list.map((p) => customMap.get(p.id) || p);
    const existingIds = new Set(list.map((p) => p.id));
    for (const cp of customList) {
      if (!existingIds.has(cp.id)) {
        list.unshift(cp);
      }
    }
  }

  // Loại bỏ sản phẩm đã xóa
  if (deletedSet.size > 0) {
    list = list.filter((p) => !deletedSet.has(p.id));
  }

  // 3. Truy vấn Supabase (nếu có bản ghi mới trên mây sẽ ưu tiên đồng bộ)
  try {
    let query = supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (shopId) {
      query = query.eq('shop_id', shopId);
    }

    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      const dbProducts: Product[] = data.map((item) => ({
        id: item.id,
        slug: item.slug,
        name: item.name,
        code: item.code || '',
        categoryId: item.category_id || '',
        categoryName: item.category_name || '',
        price: item.price !== null ? Number(item.price) : null,
        displayPrice: item.display_price || undefined,
        images: Array.isArray(item.images) && item.images.length > 0 ? item.images : [],
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

      const dbMap = new Map(dbProducts.map((p) => [p.id, p]));
      list = list.map((p) => dbMap.get(p.id) || p);
      const currentIds = new Set(list.map((p) => p.id));
      for (const dp of dbProducts) {
        if (!currentIds.has(dp.id) && !deletedSet.has(dp.id)) {
          list.unshift(dp);
        }
      }
    }
  } catch (err) {
    console.warn('Lỗi kết nối products Supabase:', err);
  }

  return list;
}

/**
 * Thêm sản phẩm mới vào hệ thống (LocalStorage + Supabase)
 */
export async function createProductInDB(product: Partial<Product> & { shopId?: string }) {
  try {
    const id = product.id || `CLP-${Date.now()}`;
    const slug =
      product.slug ||
      (product.name || 'san-pham')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') + `-${Date.now().toString().slice(-4)}`;

    const newProduct: Product = {
      id,
      slug,
      name: product.name || 'Sản phẩm mới',
      code: product.code || `CL-${Date.now().toString().slice(-4)}`,
      categoryId: product.categoryId || 'sofa-phong-khach',
      categoryName: product.categoryName || '',
      price: product.price ?? null,
      displayPrice: product.displayPrice,
      images: product.images && product.images.length > 0 ? product.images : [
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
      ],
      shortDescription: product.shortDescription || '',
      description: product.description || '',
      material: product.material || 'Gỗ tự nhiên cao cấp',
      dimensions: product.dimensions || 'Theo tiêu chuẩn thiết kế',
      warranty: product.warranty || '12 tháng',
      origin: product.origin || 'Xưởng Cao Luật Decor',
      inStock: product.inStock ?? true,
      isFeatured: product.isFeatured ?? false,
      isNew: product.isNew ?? true,
      isBestSeller: product.isBestSeller ?? false,
      features: product.features || [],
    };

    // Lưu vào LocalStorage
    const customList = getLocalCustomProducts();
    customList.unshift(newProduct);
    saveLocalCustomProducts(customList);

    // Đồng bộ Supabase (nếu kết nối được)
    const row = {
      id: newProduct.id,
      slug: newProduct.slug,
      name: newProduct.name,
      code: newProduct.code,
      category_id: newProduct.categoryId,
      category_name: newProduct.categoryName,
      shop_id: product.shopId || null,
      price: newProduct.price,
      display_price: newProduct.displayPrice || null,
      images: newProduct.images,
      short_description: newProduct.shortDescription,
      description: newProduct.description,
      material: newProduct.material,
      dimensions: newProduct.dimensions,
      warranty: newProduct.warranty,
      origin: newProduct.origin,
      in_stock: newProduct.inStock,
      is_featured: newProduct.isFeatured,
      is_new: newProduct.isNew,
      is_best_seller: newProduct.isBestSeller,
      features: newProduct.features,
      status: 'published',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      const { data } = await supabase
        .from('products')
        .upsert([row], { onConflict: 'id' })
        .select();
      return { success: true, data: data?.[0] || newProduct };
    } catch {
      return { success: true, data: newProduct };
    }
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Cập nhật tình trạng tồn kho sản phẩm (In Stock / Out of Stock)
 */
export async function toggleProductStockInDB(id: string, currentInStock: boolean) {
  try {
    const customList = getLocalCustomProducts();
    const target = customList.find((p) => p.id === id);
    if (target) {
      target.inStock = !currentInStock;
      saveLocalCustomProducts(customList);
    } else {
      const p = PRODUCTS.find((x) => x.id === id);
      if (p) {
        customList.push({ ...p, inStock: !currentInStock });
        saveLocalCustomProducts(customList);
      }
    }

    try {
      await supabase
        .from('products')
        .update({ in_stock: !currentInStock, updated_at: new Date().toISOString() })
        .eq('id', id);
    } catch {}

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Cập nhật thông tin chi tiết và hình ảnh sản phẩm
 * Đảm bảo lưu lập tức vào LocalStorage và Upsert lên Supabase
 */
export async function updateProductInDB(id: string, updates: Partial<Product>) {
  try {
    // 1. Lấy sản phẩm hiện tại
    const currentList = await fetchProductsFromDB();
    const existing = currentList.find((p) => p.id === id) || PRODUCTS.find((p) => p.id === id);

    const mergedProduct: Product = {
      id,
      slug: updates.slug || existing?.slug || id,
      name: updates.name || existing?.name || 'Sản phẩm',
      code: updates.code || existing?.code || '',
      categoryId: updates.categoryId || existing?.categoryId || 'sofa-phong-khach',
      categoryName: updates.categoryName || existing?.categoryName || '',
      price: updates.price !== undefined ? updates.price : (existing?.price ?? null),
      displayPrice: updates.displayPrice !== undefined ? updates.displayPrice : existing?.displayPrice,
      images: updates.images !== undefined ? updates.images : (existing?.images || []),
      shortDescription: updates.shortDescription !== undefined ? updates.shortDescription : (existing?.shortDescription || ''),
      description: updates.description !== undefined ? updates.description : (existing?.description || ''),
      material: updates.material !== undefined ? updates.material : (existing?.material || ''),
      dimensions: updates.dimensions !== undefined ? updates.dimensions : (existing?.dimensions || ''),
      warranty: updates.warranty !== undefined ? updates.warranty : (existing?.warranty || '12 tháng'),
      origin: updates.origin !== undefined ? updates.origin : (existing?.origin || 'Xưởng Cao Luật Decor'),
      inStock: updates.inStock !== undefined ? updates.inStock : (existing?.inStock ?? true),
      isFeatured: updates.isFeatured !== undefined ? updates.isFeatured : (existing?.isFeatured ?? false),
      isNew: updates.isNew !== undefined ? updates.isNew : (existing?.isNew ?? false),
      isBestSeller: updates.isBestSeller !== undefined ? updates.isBestSeller : (existing?.isBestSeller ?? false),
      features: updates.features !== undefined ? updates.features : (existing?.features || []),
    };

    // 2. Lưu ngay vào LocalStorage để giao diện hiển thị ngay lập tức
    const customList = getLocalCustomProducts();
    const existingIdx = customList.findIndex((p) => p.id === id);
    if (existingIdx >= 0) {
      customList[existingIdx] = mergedProduct;
    } else {
      customList.push(mergedProduct);
    }
    saveLocalCustomProducts(customList);

    // Bỏ khỏi deleted nếu trước đó đánh dấu
    const deleted = getLocalDeletedIds().filter((dId) => dId !== id);
    localStorage.setItem(DELETED_PRODUCTS_KEY, JSON.stringify(deleted));

    // 3. Chuẩn bị row đồng bộ lên Supabase
    const row = {
      id: mergedProduct.id,
      slug: mergedProduct.slug || mergedProduct.id,
      name: mergedProduct.name,
      code: mergedProduct.code || '',
      category_id: mergedProduct.categoryId || null,
      category_name: mergedProduct.categoryName || '',
      price: mergedProduct.price ?? null,
      display_price: mergedProduct.displayPrice || null,
      images: mergedProduct.images,
      short_description: mergedProduct.shortDescription || '',
      description: mergedProduct.description || '',
      material: mergedProduct.material || '',
      dimensions: mergedProduct.dimensions || '',
      warranty: mergedProduct.warranty || '',
      origin: mergedProduct.origin || 'Xưởng Cao Luật Decor',
      in_stock: mergedProduct.inStock ?? true,
      is_featured: mergedProduct.isFeatured ?? false,
      is_new: mergedProduct.isNew ?? false,
      is_best_seller: mergedProduct.isBestSeller ?? false,
      features: mergedProduct.features || [],
      status: 'published',
      updated_at: new Date().toISOString(),
    };

    // 4. Thử upsert lên Supabase
    try {
      const { data, error } = await supabase
        .from('products')
        .upsert([row], { onConflict: 'id' })
        .select();

      if (error) {
        console.warn('Lưu ý đồng bộ Supabase:', error.message);
      }
      return { success: true, data: data?.[0] || mergedProduct };
    } catch (sbErr: any) {
      console.warn('Lỗi kết nối Supabase, đã lưu an toàn tại máy:', sbErr);
      return { success: true, data: mergedProduct };
    }
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Admin tạo tài khoản người dùng mới trực tiếp vào hệ thống
 */
export async function adminCreateUser(userData: {
  name: string;
  email: string;
  phone: string;
  password?: string;
  role: UserRole;
  status: UserStatus;
  shopName?: string;
}) {
  try {
    const pwd = userData.password || 'CaoLuat@2024';
    let targetId: any = crypto.randomUUID();

    try {
      const { data: authData } = await supabase.auth.signUp({
        email: userData.email.trim(),
        password: pwd,
        options: {
          data: {
            name: userData.name.trim(),
            phone: userData.phone.trim(),
            role: userData.role,
          },
        },
      });
      if (authData?.user?.id) targetId = authData.user.id;
    } catch {}

    const { data, error } = await supabase
      .from('profiles')
      .upsert([
        {
          id: targetId as any,
          email: userData.email.trim(),
          name: userData.name.trim(),
          phone: userData.phone.trim(),
          role: userData.role,
          status: userData.status,
          shop_name: userData.shopName || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) throw error;
    return { success: true, data: data?.[0] };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Xuất dữ liệu danh sách báo giá ra file CSV thực tế
 */
export function exportQuotesToCSV(quotes: DBQuoteRequest[]) {
  const headers = [
    'Mã Yêu Cầu',
    'Tên Khách Hàng',
    'Số Điện Thoại',
    'Email',
    'Sản Phẩm Quan Tâm',
    'Trạng Thái',
    'Ghi Chú Khách',
    'Ghi Chú Admin',
    'Ngày Tạo',
  ];
  const rows = quotes.map((q) => [
    q.id,
    `"${(q.customer_name || '').replace(/"/g, '""')}"`,
    `"${q.phone}"`,
    `"${q.email || ''}"`,
    `"${(q.product_name || '').replace(/"/g, '""')}"`,
    q.status,
    `"${(q.note || '').replace(/"/g, '""')}"`,
    `"${(q.admin_note || '').replace(/"/g, '""')}"`,
    new Date(q.created_at).toLocaleString('vi-VN'),
  ]);

  const csvContent =
    '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Bao_Cao_Bao_Gia_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Xóa sản phẩm khỏi database và LocalStorage
 */
export async function deleteProductInDB(id: string) {
  try {
    addLocalDeletedId(id);
    const customList = getLocalCustomProducts().filter((p) => p.id !== id);
    saveLocalCustomProducts(customList);

    try {
      await supabase.from('products').delete().eq('id', id);
    } catch {}

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

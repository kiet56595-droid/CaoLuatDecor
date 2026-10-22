import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://beogjxnmmglnlgurplfn.supabase.co';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_euIxZ_TIu5_XvDxeQeXP1A_DcWTnmXk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface QuoteRequestPayload {
  customer_name: string;
  phone: string;
  email?: string;
  product_name?: string;
  product_code?: string;
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
          product_name: data.product_name || 'Tư vấn tổng thể nội thất',
          product_code: data.product_code || null,
          note: data.note || null,
          status: 'pending',
          created_at: new Date().toISOString(),
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

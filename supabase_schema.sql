-- ========================================================
-- CAO LUẬT DECOR - SUPABASE DATABASE SCHEMA
-- Hướng dẫn: Bấm vào mục "SQL Editor" trên thanh menu bên trái
-- của Supabase -> Dán toàn bộ mã này vào và bấm nút "Run"
-- ========================================================

-- 1. BẢNG TIẾP NHẬN YÊU CẦU BÁO GIÁ (QUOTE REQUESTS)
create table if not exists public.quote_requests (
  id uuid default gen_random_uuid() primary key,
  customer_name text not null,
  phone text not null,
  email text,
  product_name text default 'Tư vấn tổng thể nội thất',
  product_code text,
  note text,
  status text default 'pending', -- 'pending' (chờ gọi), 'contacted' (đã tư vấn), 'completed' (đã chốt)
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Bật Row Level Security (RLS) để kiểm soát quyền
alter table public.quote_requests enable row level security;

-- Chính sách: Khách truy cập web được phép gửi báo giá (Insert)
drop policy if exists "Khách gửi báo giá" on public.quote_requests;
create policy "Khách gửi báo giá"
  on public.quote_requests for insert
  to anon, authenticated
  with check (true);

-- Chính sách: Cho phép xem danh sách báo giá
drop policy if exists "Xem danh sách báo giá" on public.quote_requests;
create policy "Xem danh sách báo giá"
  on public.quote_requests for select
  to anon, authenticated
  using (true);

-- Chính sách: Cho phép cập nhật trạng thái báo giá
drop policy if exists "Cập nhật trạng thái báo giá" on public.quote_requests;
create policy "Cập nhật trạng thái báo giá"
  on public.quote_requests for update
  to anon, authenticated
  using (true);

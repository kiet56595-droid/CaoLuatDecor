-- ========================================================
-- CAO LUẬT DECOR - FULL DATABASE SCHEMA (TẤT CẢ CÁC ACTORS)
-- Hỗ trợ 4 Actors:
-- 1. GUEST (Khách vãng lai)
-- 2. CUSTOMER (Khách hàng thành viên)
-- 3. SHOP_OWNER (Chủ xưởng / Cửa hàng đối tác)
-- 4. ADMIN (Quản trị viên toàn hệ thống)
-- ========================================================

-- Kích hoạt extension hỗ trợ sinh UUID
create extension if not exists "uuid-ossp";

-- ========================================================
-- 1. BẢNG HỒ SƠ NGƯỜI DÙNG (PROFILES - Liên kết auth.users)
-- Actors: ADMIN, SHOP_OWNER, CUSTOMER
-- ========================================================
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  name text not null,
  phone text,
  role text not null default 'CUSTOMER' check (role in ('ADMIN', 'SHOP_OWNER', 'CUSTOMER')),
  status text not null default 'ACTIVE' check (status in ('ACTIVE', 'BANNED', 'PENDING_APPROVAL')),
  avatar text,
  address text,
  city text,
  shop_name text, -- Dành cho SHOP_OWNER
  shop_description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tự động đồng bộ khi có user đăng ký mới trong Supabase Auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, phone, role, status)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    coalesce(new.raw_user_meta_data->>'role', 'CUSTOMER'),
    case 
      when coalesce(new.raw_user_meta_data->>'role', 'CUSTOMER') = 'SHOP_OWNER' then 'PENDING_APPROVAL'
      else 'ACTIVE'
    end
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Đồng bộ tài khoản auth.users đã tồn tại vào profiles (nếu có)
insert into public.profiles (id, email, name, role, status)
select 
  id, 
  email, 
  coalesce(raw_user_meta_data->>'name', split_part(coalesce(email, 'user'), '@', 1)),
  coalesce(raw_user_meta_data->>'role', 'CUSTOMER'),
  'ACTIVE'
from auth.users
on conflict (id) do nothing;

-- ========================================================
-- 2. BẢNG DANH MỤC SẢN PHẨM (CATEGORIES)
-- Actors: ADMIN (quản trị), GUEST & CUSTOMER (xem)
-- ========================================================
create table if not exists public.categories (
  id text primary key,
  name text not null,
  slug text not null unique,
  description text,
  image text,
  sort_order int default 0,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ========================================================
-- 3. BẢNG SẢN PHẨM (PRODUCTS)
-- Actors: 
-- - SHOP_OWNER (tạo & quản lý sản phẩm xưởng mình)
-- - ADMIN (kiểm duyệt & quản lý tất cả sản phẩm)
-- - GUEST / CUSTOMER (tìm kiếm, xem sản phẩm)
-- ========================================================
create table if not exists public.products (
  id text primary key default gen_random_uuid()::text,
  slug text not null unique,
  name text not null,
  code text,
  category_id text references public.categories(id) on delete set null,
  category_name text,
  shop_id uuid references public.profiles(id) on delete set null,
  price numeric default null, -- null = Liên hệ báo giá
  display_price text,
  images jsonb default '[]'::jsonb,
  short_description text,
  description text,
  material text,
  dimensions text,
  warranty text,
  origin text,
  in_stock boolean default true,
  is_featured boolean default false,
  is_new boolean default false,
  is_best_seller boolean default false,
  features jsonb default '[]'::jsonb,
  status text default 'published' check (status in ('published', 'draft', 'pending_review', 'archived')),
  views_count int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ========================================================
-- 4. BẢNG CÔNG TRÌNH / DỰ ÁN THIẾT KẾ (PROJECTS)
-- Actors: ADMIN, SHOP_OWNER (đăng dự án đã thi công), GUEST (xem)
-- ========================================================
create table if not exists public.projects (
  id text primary key default gen_random_uuid()::text,
  slug text not null unique,
  title text not null,
  category text not null,
  category_label text,
  location text,
  area text,
  style text,
  year text,
  thumbnail text,
  gallery jsonb default '[]'::jsonb,
  description text,
  scope_of_work text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ========================================================
-- 5. BẢNG TIẾP NHẬN YÊU CẦU BÁO GIÁ (QUOTE_REQUESTS)
-- Actors:
-- - GUEST / CUSTOMER (gửi yêu cầu)
-- - SHOP_OWNER (nhận & phản hồi báo giá đơn hàng của shop)
-- - ADMIN (quản trị, phân bổ toàn bộ báo giá)
-- ========================================================
create table if not exists public.quote_requests (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete set null,
  customer_name text not null,
  phone text not null,
  email text,
  product_id text references public.products(id) on delete set null,
  product_name text default 'Tư vấn tổng thể nội thất',
  product_code text,
  shop_id uuid references public.profiles(id) on delete set null,
  note text,
  status text default 'pending',
  admin_note text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Đảm bảo bổ sung các cột nếu bảng quote_requests đã được tạo ở bước trước:
alter table public.quote_requests add column if not exists user_id uuid references public.profiles(id) on delete set null;
alter table public.quote_requests add column if not exists product_id text references public.products(id) on delete set null;
alter table public.quote_requests add column if not exists shop_id uuid references public.profiles(id) on delete set null;
alter table public.quote_requests add column if not exists admin_note text;
alter table public.quote_requests add column if not exists updated_at timestamp with time zone default timezone('utc'::text, now());

-- ========================================================
-- 6. BẢNG ĐÁNH GIÁ SẢN PHẨM (REVIEWS)
-- Actors:
-- - CUSTOMER (đăng đánh giá, xếp hạng sao)
-- - SHOP_OWNER (xem phản hồi sản phẩm xưởng mình)
-- - ADMIN (kiểm duyệt đánh giá)
-- - GUEST (xem đánh giá công khai)
-- ========================================================
create table if not exists public.reviews (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete set null,
  product_id text references public.products(id) on delete cascade,
  client_name text not null,
  rating int not null check (rating >= 1 and rating <= 5),
  comment text not null,
  avatar text,
  is_approved boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ========================================================
-- 7. THIẾT LẬP ROW LEVEL SECURITY (RLS) & PHÂN QUYỀN
-- ========================================================

-- Bật RLS cho tất cả các bảng
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.projects enable row level security;
alter table public.quote_requests enable row level security;
alter table public.reviews enable row level security;

-- Hàm kiểm tra xem user hiện tại có phải là Admin hay không
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'ADMIN' and status = 'ACTIVE'
  );
end;
$$ language plpgsql security definer;

-- Hàm kiểm tra xem user hiện tại có phải là Shop Owner hay không
create or replace function public.is_shop_owner()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'SHOP_OWNER' and status = 'ACTIVE'
  );
end;
$$ language plpgsql security definer;

-- ── Policies cho Bảng profiles ───────────────────────────
drop policy if exists "Mọi người xem profile công khai" on public.profiles;
create policy "Mọi người xem profile công khai" on public.profiles
  for select using (true);

drop policy if exists "User tự sửa profile cá nhân" on public.profiles;
create policy "User tự sửa profile cá nhân" on public.profiles
  for update using (auth.uid() = id);

drop policy if exists "Admin toàn quyền trên profiles" on public.profiles;
create policy "Admin toàn quyền trên profiles" on public.profiles
  for all using (public.is_admin());

-- ── Policies cho Bảng categories ─────────────────────────
drop policy if exists "Ai cũng được xem danh mục" on public.categories;
create policy "Ai cũng được xem danh mục" on public.categories
  for select using (is_active = true or public.is_admin());

drop policy if exists "Chỉ Admin được chỉnh sửa danh mục" on public.categories;
create policy "Chỉ Admin được chỉnh sửa danh mục" on public.categories
  for all using (public.is_admin());

-- ── Policies cho Bảng products ───────────────────────────
drop policy if exists "Ai cũng được xem sản phẩm công khai" on public.products;
drop policy if exists "Shop Owner quản lý sản phẩm của mình" on public.products;
drop policy if exists "Toàn quyền quản lý sản phẩm" on public.products;

create policy "Toàn quyền quản lý sản phẩm" on public.products
  for all using (true) with check (true);

-- ── Policies cho Bảng projects ───────────────────────────
drop policy if exists "Ai cũng được xem dự án" on public.projects;
create policy "Ai cũng được xem dự án" on public.projects
  for select using (true);

drop policy if exists "Admin và Shop tạo sửa dự án" on public.projects;
create policy "Admin và Shop tạo sửa dự án" on public.projects
  for all using (public.is_admin() or public.is_shop_owner());

-- ── Policies cho Bảng quote_requests ─────────────────────
drop policy if exists "Khách vãng lai và thành viên gửi báo giá" on public.quote_requests;
create policy "Khách vãng lai và thành viên gửi báo giá" on public.quote_requests
  for insert to anon, authenticated with check (true);

drop policy if exists "Customer xem báo giá của mình" on public.quote_requests;
create policy "Customer xem báo giá của mình" on public.quote_requests
  for select using (
    auth.uid() = user_id 
    or auth.uid() = shop_id 
    or public.is_admin() 
    or auth.role() = 'anon'
  );

drop policy if exists "Shop và Admin cập nhật trạng thái báo giá" on public.quote_requests;
create policy "Shop và Admin cập nhật trạng thái báo giá" on public.quote_requests
  for update using (
    auth.uid() = shop_id 
    or public.is_admin() 
    or auth.role() = 'anon'
  );

-- ── Policies cho Bảng reviews ────────────────────────────
drop policy if exists "Ai cũng được xem đánh giá đã duyệt" on public.reviews;
create policy "Ai cũng được xem đánh giá đã duyệt" on public.reviews
  for select using (is_approved = true or public.is_admin());

drop policy if exists "Khách đăng nhập được gửi đánh giá" on public.reviews;
create policy "Khách đăng nhập được gửi đánh giá" on public.reviews
  for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "Admin kiểm duyệt đánh giá" on public.reviews;
create policy "Admin kiểm duyệt đánh giá" on public.reviews
  for update using (public.is_admin());

-- ========================================================
-- 8. NẠP DỮ LIỆU DANH MỤC MẶC ĐỊNH (SEED CATEGORIES)
-- ========================================================
insert into public.categories (id, name, slug, description, image, sort_order)
values
  ('sofa-phong-khach', 'Sofa Phòng Khách', 'sofa-phong-khach', 'Sofa da cao cấp, sofa nỉ hiện đại, sofa góc chữ L mang lại sự êm ái và sang trọng cho phòng khách.', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80', 1),
  ('ban-tra', 'Bàn Trà', 'ban-tra', 'Bàn trà mặt đá ceramic, gỗ sồi tự nhiên, bàn trà đôi hiện đại tạo điểm nhấn tinh tế.', 'https://images.unsplash.com/photo-1533090161767-e6ffed986b88?auto=format&fit=crop&w=800&q=80', 2),
  ('ke-tivi', 'Kệ Tivi', 'ke-tivi', 'Kệ tivi treo tường, kệ tivi bệt phong cách Bắc Âu và hiện đại tối ưu không gian lưu trữ.', 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80', 3),
  ('ban-an-ghe-an', 'Bàn Ăn & Ghế Ăn', 'ban-an-ghe-an', 'Bộ bàn ăn 4 - 6 - 8 ghế gỗ sồi, mặt đá cẩm thạch mang đến không khí ấm cúng cho mỗi bữa cơm gia đình.', 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80', 4),
  ('giuong-ngu', 'Giường Ngủ', 'giuong-ngu', 'Giường ngủ bọc da, bọc nỉ, gỗ tự nhiên thiết kế công thái học nâng niu giấc ngủ trọn vẹn.', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80', 5),
  ('tu-quan-ao', 'Tủ Quần Áo', 'tu-quan-ao', 'Tủ quần áo cánh kính sang trọng, tủ lùa kịch trần phủ Melamine chống ẩm cao cấp.', 'https://images.unsplash.com/photo-1558997519-83ea9252def8?auto=format&fit=crop&w=800&q=80', 6),
  ('tu-bep', 'Tủ Bếp', 'tu-bep', 'Hệ tủ bếp Acrylic bóng gương, cốt gỗ MDF lõi xanh chống ẩm An Cường tích hợp phụ kiện thông minh.', 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80', 7),
  ('noi-that-van-phong', 'Nội Thất Văn Phòng', 'noi-that-van-phong', 'Bàn làm việc giám đốc, bàn trưởng phòng, kệ hồ sơ hiện đại nâng tầm không gian sáng tạo.', 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80', 8)
on conflict (id) do update set
  name = excluded.name,
  slug = excluded.slug,
  description = excluded.description,
  image = excluded.image,
  sort_order = excluded.sort_order;

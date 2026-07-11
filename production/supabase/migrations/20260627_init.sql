-- =======================================================================
-- REEFILM INDIA ENTERPRISE INITIALIZATION SQL MIGRATION
-- Target Database: PostgreSQL / Supabase
-- Features: Full Relational Schemas, Row-Level Security, pre-seeded data,
--           Optimized Indexes, and Admin Auth Policies.
-- =======================================================================

-- Enable UUID extension (kept for backward compatibility, but we prefer gen_random_uuid)
create extension if not exists "uuid-ossp";

-- ==========================================
-- 1. CATEGORIES TABLE
-- ==========================================
create table if not exists public.categories (
    id uuid default gen_random_uuid() primary key,
    name text not null unique,
    slug text not null unique,
    description text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==========================================
-- 2. PRODUCTS TABLE
-- ==========================================
create table if not exists public.products (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    slug text not null unique,
    category_id uuid references public.categories(id) on delete set null,
    tagline text,
    description text not null,
    features text[] not null default '{}',
    benefits text[] not null default '{}',
    specifications jsonb not null default '{}'::jsonb,
    installation_guide text,
    maintenance_guide text,
    image_url text,
    is_active boolean default true not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==========================================
-- 3. TESTIMONIALS TABLE
-- ==========================================
create table if not exists public.testimonials (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    designation text not null,
    company text not null,
    quote text not null,
    rating integer default 5 not null check (rating >= 1 and rating <= 5),
    is_featured boolean default true not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==========================================
-- 4. CONTACTS TABLE
-- ==========================================
create table if not exists public.contacts (
    id uuid default gen_random_uuid() primary key,
    full_name text not null,
    company text,
    phone text not null,
    whatsapp text not null,
    email text not null,
    city text not null,
    message text,
    status text default 'Pending' not null check (status in ('Pending', 'Contacted', 'Won', 'Lost')),
    notes text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==========================================
-- 5. QUOTE_REQUESTS TABLE
-- ==========================================
create table if not exists public.quote_requests (
    id uuid default gen_random_uuid() primary key,
    quote_id text unique not null,
    full_name text not null,
    company text,
    phone text not null,
    whatsapp text not null,
    email text not null,
    city text not null,
    state text not null,
    country text default 'India' not null,
    product_of_interest text not null,
    quantity integer default 1 not null,
    glass_size text not null,
    screen_size text,
    budget_range text not null,
    timeline text not null,
    special_requirements text,
    drawing_url text,
    image_url text,
    status text default 'Pending' not null check (status in ('Pending', 'Contacted', 'Won', 'Lost')),
    notes text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==========================================
-- 6. GALLERY & PROJECT_IMAGES TABLES
-- ==========================================
create table if not exists public.gallery (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    category text not null,
    image_url text not null,
    location text,
    client text,
    timeline text,
    description text,
    is_featured boolean default false not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.project_images (
    id uuid default gen_random_uuid() primary key,
    gallery_id uuid references public.gallery(id) on delete cascade,
    image_url text not null,
    caption text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==========================================
-- 7. BLOGS TABLE
-- ==========================================
create table if not exists public.blogs (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    slug text not null unique,
    excerpt text not null,
    content text not null,
    category text not null,
    tags text[] not null default '{}',
    published_at timestamp with time zone default timezone('utc'::text, now()) not null,
    read_time text default '5 Min Read' not null,
    author text default 'Raj Gupta' not null,
    image_url text not null,
    is_published boolean default true not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==========================================
-- 8. DOWNLOADS TABLE (Resources Catalog)
-- ==========================================
create table if not exists public.downloads (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    category text not null,
    file_size text not null,
    file_url text not null,
    download_count integer default 0 not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==========================================
-- 9. NEWSLETTER TABLE
-- ==========================================
create table if not exists public.newsletter (
    id uuid default gen_random_uuid() primary key,
    email text not null unique,
    is_active boolean default true not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==========================================
-- 10. ADMINS TABLE
-- ==========================================
create table if not exists public.admins (
    id uuid default gen_random_uuid() primary key,
    email text not null unique,
    password_hash text not null,
    role text default 'Editor' not null check (role in ('SuperAdmin', 'Editor', 'Viewer')),
    last_login timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==========================================
-- 11. SETTINGS TABLE
-- ==========================================
create table if not exists public.settings (
    id uuid default gen_random_uuid() primary key,
    key text not null unique,
    value jsonb not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==========================================
-- 12. ACTIVITY_LOGS TABLE
-- ==========================================
create table if not exists public.activity_logs (
    id uuid default gen_random_uuid() primary key,
    admin_id uuid references public.admins(id) on delete set null,
    action text not null,
    entity_type text not null,
    entity_id text,
    ip_address text,
    details text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =======================================================================
-- SYSTEM ADMINISTRATIVE TRIGGERS & FUNCTIONS
-- =======================================================================

-- Auto updated_at Trigger Function
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

-- Apply updated_at Triggers (Idempotent: Drop before Create)
drop trigger if exists set_categories_updated_at on public.categories;
create trigger set_categories_updated_at before update on public.categories for each row execute function public.handle_updated_at();

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at before update on public.products for each row execute function public.handle_updated_at();

drop trigger if exists set_testimonials_updated_at on public.testimonials;
create trigger set_testimonials_updated_at before update on public.testimonials for each row execute function public.handle_updated_at();

drop trigger if exists set_contacts_updated_at on public.contacts;
create trigger set_contacts_updated_at before update on public.contacts for each row execute function public.handle_updated_at();

drop trigger if exists set_quote_requests_updated_at on public.quote_requests;
create trigger set_quote_requests_updated_at before update on public.quote_requests for each row execute function public.handle_updated_at();

drop trigger if exists set_gallery_updated_at on public.gallery;
create trigger set_gallery_updated_at before update on public.gallery for each row execute function public.handle_updated_at();

drop trigger if exists set_blogs_updated_at on public.blogs;
create trigger set_blogs_updated_at before update on public.blogs for each row execute function public.handle_updated_at();

drop trigger if exists set_downloads_updated_at on public.downloads;
create trigger set_downloads_updated_at before update on public.downloads for each row execute function public.handle_updated_at();

drop trigger if exists set_newsletter_updated_at on public.newsletter;
create trigger set_newsletter_updated_at before update on public.newsletter for each row execute function public.handle_updated_at();

drop trigger if exists set_admins_updated_at on public.admins;
create trigger set_admins_updated_at before update on public.admins for each row execute function public.handle_updated_at();


-- =======================================================================
-- ENABLE ROW LEVEL SECURITY & DEFINE POLICIES (Idempotent: Drop before Create)
-- =======================================================================

alter table public.categories enable row level security;
drop policy if exists "Allow public read access to categories" on public.categories;
create policy "Allow public read access to categories" on public.categories for select using (true);
drop policy if exists "Admins full rights on categories" on public.categories;
create policy "Admins full rights on categories" on public.categories for all using (auth.uid() is not null);

alter table public.products enable row level security;
drop policy if exists "Allow public read access to active products" on public.products;
create policy "Allow public read access to active products" on public.products for select using (is_active = true);
drop policy if exists "Admins full rights on products" on public.products;
create policy "Admins full rights on products" on public.products for all using (auth.uid() is not null);

alter table public.testimonials enable row level security;
drop policy if exists "Allow public read access to testimonials" on public.testimonials;
create policy "Allow public read access to testimonials" on public.testimonials for select using (true);
drop policy if exists "Admins full rights on testimonials" on public.testimonials;
create policy "Admins full rights on testimonials" on public.testimonials for all using (auth.uid() is not null);

alter table public.contacts enable row level security;
drop policy if exists "Allow public insert to contacts" on public.contacts;
create policy "Allow public insert to contacts" on public.contacts for insert with check (true);
drop policy if exists "Admins full rights on contacts" on public.contacts;
create policy "Admins full rights on contacts" on public.contacts for all using (auth.uid() is not null);

alter table public.quote_requests enable row level security;
drop policy if exists "Allow public insert to quote_requests" on public.quote_requests;
create policy "Allow public insert to quote_requests" on public.quote_requests for insert with check (true);
drop policy if exists "Admins full rights on quote_requests" on public.quote_requests;
create policy "Admins full rights on quote_requests" on public.quote_requests for all using (auth.uid() is not null);

alter table public.gallery enable row level security;
drop policy if exists "Allow public read access to gallery" on public.gallery;
create policy "Allow public read access to gallery" on public.gallery for select using (true);
drop policy if exists "Admins full rights on gallery" on public.gallery;
create policy "Admins full rights on gallery" on public.gallery for all using (auth.uid() is not null);

alter table public.project_images enable row level security;
drop policy if exists "Allow public read access to project_images" on public.project_images;
create policy "Allow public read access to project_images" on public.project_images for select using (true);
drop policy if exists "Admins full rights on project_images" on public.project_images;
create policy "Admins full rights on project_images" on public.project_images for all using (auth.uid() is not null);

alter table public.blogs enable row level security;
drop policy if exists "Allow public read access to published blogs" on public.blogs;
create policy "Allow public read access to published blogs" on public.blogs for select using (is_published = true);
drop policy if exists "Admins full rights on blogs" on public.blogs;
create policy "Admins full rights on blogs" on public.blogs for all using (auth.uid() is not null);

alter table public.downloads enable row level security;
drop policy if exists "Allow public read access to downloads catalog" on public.downloads;
create policy "Allow public read access to downloads catalog" on public.downloads for select using (true);
drop policy if exists "Admins full rights on downloads" on public.downloads;
create policy "Admins full rights on downloads" on public.downloads for all using (auth.uid() is not null);

alter table public.newsletter enable row level security;
drop policy if exists "Allow public subscription" on public.newsletter;
create policy "Allow public subscription" on public.newsletter for insert with check (true);
drop policy if exists "Admins full rights on newsletter" on public.newsletter;
create policy "Admins full rights on newsletter" on public.newsletter for all using (auth.uid() is not null);

alter table public.admins enable row level security;
drop policy if exists "Admins are read protected" on public.admins;
create policy "Admins are read protected" on public.admins for select using (auth.uid() is not null);

alter table public.settings enable row level security;
drop policy if exists "Allow public read to site settings" on public.settings;
create policy "Allow public read to site settings" on public.settings for select using (true);
drop policy if exists "Admins full rights on settings" on public.settings;
create policy "Admins full rights on settings" on public.settings for all using (auth.uid() is not null);

alter table public.activity_logs enable row level security;
drop policy if exists "Admins full rights on activity_logs" on public.activity_logs;
create policy "Admins full rights on activity_logs" on public.activity_logs for all using (auth.uid() is not null);


-- =======================================================================
-- STORAGE POLICY DEFINITIONS (Safe dynamic EXECUTE inside PL/pgSQL)
-- =======================================================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE n.nspname = 'storage' AND c.relname = 'objects') THEN
    
    -- products policies
    EXECUTE $step$DROP POLICY IF EXISTS "products_select_policy" ON storage.objects$step$;
    EXECUTE $step$CREATE POLICY "products_select_policy" ON storage.objects FOR SELECT USING (bucket_id = 'products')$step$;
    EXECUTE $step$DROP POLICY IF EXISTS "products_insert_policy" ON storage.objects$step$;
    EXECUTE $step$CREATE POLICY "products_insert_policy" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'products')$step$;
    EXECUTE $step$DROP POLICY IF EXISTS "products_update_policy" ON storage.objects$step$;
    EXECUTE $step$CREATE POLICY "products_update_policy" ON storage.objects FOR UPDATE USING (bucket_id = 'products') WITH CHECK (bucket_id = 'products')$step$;
    EXECUTE $step$DROP POLICY IF EXISTS "products_delete_policy" ON storage.objects$step$;
    EXECUTE $step$CREATE POLICY "products_delete_policy" ON storage.objects FOR DELETE USING (bucket_id = 'products')$step$;

    -- gallery policies
    EXECUTE $step$DROP POLICY IF EXISTS "gallery_select_policy" ON storage.objects$step$;
    EXECUTE $step$CREATE POLICY "gallery_select_policy" ON storage.objects FOR SELECT USING (bucket_id = 'gallery')$step$;
    EXECUTE $step$DROP POLICY IF EXISTS "gallery_insert_policy" ON storage.objects$step$;
    EXECUTE $step$CREATE POLICY "gallery_insert_policy" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'gallery')$step$;
    EXECUTE $step$DROP POLICY IF EXISTS "gallery_update_policy" ON storage.objects$step$;
    EXECUTE $step$CREATE POLICY "gallery_update_policy" ON storage.objects FOR UPDATE USING (bucket_id = 'gallery') WITH CHECK (bucket_id = 'gallery')$step$;
    EXECUTE $step$DROP POLICY IF EXISTS "gallery_delete_policy" ON storage.objects$step$;
    EXECUTE $step$CREATE POLICY "gallery_delete_policy" ON storage.objects FOR DELETE USING (bucket_id = 'gallery')$step$;

    -- videos policies
    EXECUTE $step$DROP POLICY IF EXISTS "videos_select_policy" ON storage.objects$step$;
    EXECUTE $step$CREATE POLICY "videos_select_policy" ON storage.objects FOR SELECT USING (bucket_id = 'videos')$step$;
    EXECUTE $step$DROP POLICY IF EXISTS "videos_insert_policy" ON storage.objects$step$;
    EXECUTE $step$CREATE POLICY "videos_insert_policy" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'videos')$step$;
    EXECUTE $step$DROP POLICY IF EXISTS "videos_update_policy" ON storage.objects$step$;
    EXECUTE $step$CREATE POLICY "videos_update_policy" ON storage.objects FOR UPDATE USING (bucket_id = 'videos') WITH CHECK (bucket_id = 'videos')$step$;
    EXECUTE $step$DROP POLICY IF EXISTS "videos_delete_policy" ON storage.objects$step$;
    EXECUTE $step$CREATE POLICY "videos_delete_policy" ON storage.objects FOR DELETE USING (bucket_id = 'videos')$step$;

    -- documents policies
    EXECUTE $step$DROP POLICY IF EXISTS "documents_select_policy" ON storage.objects$step$;
    EXECUTE $step$CREATE POLICY "documents_select_policy" ON storage.objects FOR SELECT USING (bucket_id = 'documents')$step$;
    EXECUTE $step$DROP POLICY IF EXISTS "documents_insert_policy" ON storage.objects$step$;
    EXECUTE $step$CREATE POLICY "documents_insert_policy" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'documents')$step$;
    EXECUTE $step$DROP POLICY IF EXISTS "documents_update_policy" ON storage.objects$step$;
    EXECUTE $step$CREATE POLICY "documents_update_policy" ON storage.objects FOR UPDATE USING (bucket_id = 'documents') WITH CHECK (bucket_id = 'documents')$step$;
    EXECUTE $step$DROP POLICY IF EXISTS "documents_delete_policy" ON storage.objects$step$;
    EXECUTE $step$CREATE POLICY "documents_delete_policy" ON storage.objects FOR DELETE USING (bucket_id = 'documents')$step$;

    -- logos policies
    EXECUTE $step$DROP POLICY IF EXISTS "logos_select_policy" ON storage.objects$step$;
    EXECUTE $step$CREATE POLICY "logos_select_policy" ON storage.objects FOR SELECT USING (bucket_id = 'logos')$step$;
    EXECUTE $step$DROP POLICY IF EXISTS "logos_insert_policy" ON storage.objects$step$;
    EXECUTE $step$CREATE POLICY "logos_insert_policy" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'logos')$step$;
    EXECUTE $step$DROP POLICY IF EXISTS "logos_update_policy" ON storage.objects$step$;
    EXECUTE $step$CREATE POLICY "logos_update_policy" ON storage.objects FOR UPDATE USING (bucket_id = 'logos') WITH CHECK (bucket_id = 'logos')$step$;
    EXECUTE $step$DROP POLICY IF EXISTS "logos_delete_policy" ON storage.objects$step$;
    EXECUTE $step$CREATE POLICY "logos_delete_policy" ON storage.objects FOR DELETE USING (bucket_id = 'logos')$step$;

    -- media policies
    EXECUTE $step$DROP POLICY IF EXISTS "media_select_policy" ON storage.objects$step$;
    EXECUTE $step$CREATE POLICY "media_select_policy" ON storage.objects FOR SELECT USING (bucket_id = 'media')$step$;
    EXECUTE $step$DROP POLICY IF EXISTS "media_insert_policy" ON storage.objects$step$;
    EXECUTE $step$CREATE POLICY "media_insert_policy" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'media')$step$;
    EXECUTE $step$DROP POLICY IF EXISTS "media_update_policy" ON storage.objects$step$;
    EXECUTE $step$CREATE POLICY "media_update_policy" ON storage.objects FOR UPDATE USING (bucket_id = 'media') WITH CHECK (bucket_id = 'media')$step$;
    EXECUTE $step$DROP POLICY IF EXISTS "media_delete_policy" ON storage.objects$step$;
    EXECUTE $step$CREATE POLICY "media_delete_policy" ON storage.objects FOR DELETE USING (bucket_id = 'media')$step$;

  END IF;
END $$;


-- =======================================================================
-- SEED DATA
-- =======================================================================

-- 1. Categories
insert into public.categories (name, slug, description) values
('LED Film', 'led-film', 'Adhesive and flexible transparent LED films.'),
('Glass Display', 'glass-display', 'Double-glazed structural glass display panels.'),
('Window Display', 'window-display', 'Street-facing high-brightness retail window screens.'),
('Mesh Display', 'mesh-display', 'Lightweight outdoor curtain grids for building envelopes.')
on conflict (slug) do nothing;

-- 2. Products
insert into public.products (name, slug, category_id, tagline, description, features, benefits, specifications, installation_guide, maintenance_guide, image_url) values
(
    'Transparent LED Film (Adhesive)',
    'transparent-led-film',
    (select id from public.categories where slug = 'led-film' limit 1),
    'Ultra-Thin Adhesive Film that Turns Glass Into a Vibrant Display',
    'Reefilm India flag-ship product. A paper-thin, self-adhesive transparent LED film that laminates directly onto existing glass panels without altering structural integrity.',
    array['Ultra-lightweight: Only 2.4kg per square meter', 'Superior flexibility: Bendable up to 1100R', 'High Transparency: Up to 85% light transmission'],
    array['No structural modifications required to existing window frames', 'Maintains natural interior daylight', 'Saves significant operational power loads'],
    '{"pitch": "3.91mm / 6.25mm / 10.4mm", "brightness": "4500 - 5500 nits", "transparency": "75% - 85%", "weight": "2.4 kg/m²"}'::jsonb,
    'Clean the glass substrate, wet-apply film using lamination roller, connect side power busbars.',
    'Modular strip replacements are performed in-situ within minutes.',
    'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80'
)
on conflict (slug) do nothing;

-- 3. Settings
insert into public.settings (key, value) values
(
    'company_information',
    '{"name": "Reefilm India", "owner": "Raj Gupta", "whatsapp": "+918577917327", "email": "razzg946@gmail.com", "hours": "Mon-Sat 10:00AM - 7:00PM"}'::jsonb
)
on conflict (key) do nothing;

-- 4. Default Admin User (Password: reefilmAdmin2026!)
insert into public.admins (email, password_hash, role) values
(
    'razzg946@gmail.com',
    '$2a$12$RyeGby7LzBAnfGg79zJm9OzB.h1Eun1x18jZJp.p067F1zIu9m2jG', -- pre-hashed bcrypt hash
    'SuperAdmin'
)
on conflict (email) do nothing;

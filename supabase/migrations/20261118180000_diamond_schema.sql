-- Fatlum Diamonds catalog and inquiries.
-- Prefixed diamond_ so gold tables (products, order_requests, order_request_items) stay untouched.
-- Idempotent. RLS on. Anon may read active stones and insert inquiries only.
-- Do not grant anon select on inquiry tables.

create table if not exists public.diamond_stones (
  id uuid primary key default gen_random_uuid(),
  sku text not null unique,
  slug text not null unique,
  shape text not null check (shape in ('round', 'princess', 'cushion', 'oval', 'emerald', 'pear', 'marquise', 'radiant', 'asscher', 'heart')),
  carat numeric not null check (carat > 0 and carat < 20),
  color text not null check (color in ('D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M')),
  clarity text not null check (clarity in ('FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2', 'I1', 'I2', 'I3')),
  cut text check (cut is null or cut in ('Excellent', 'Very Good', 'Good', 'Fair')),
  polish text not null check (polish in ('Excellent', 'Very Good', 'Good', 'Fair')),
  symmetry text not null check (symmetry in ('Excellent', 'Very Good', 'Good', 'Fair')),
  fluorescence text not null check (fluorescence in ('None', 'Faint', 'Medium', 'Strong', 'Very Strong')),
  cert_lab text not null check (cert_lab in ('GIA', 'IGI', 'HRD')),
  cert_number text not null,
  origin text not null check (origin in ('natural', 'lab')),
  length_mm numeric not null check (length_mm > 0),
  width_mm numeric not null check (width_mm > 0),
  depth_mm numeric not null check (depth_mm > 0),
  table_pct numeric not null check (table_pct > 0 and table_pct < 100),
  depth_pct numeric not null check (depth_pct > 0 and depth_pct < 100),
  in_stock boolean not null default true,
  is_example boolean not null default true,
  is_active boolean not null default true,
  example_marker text not null default 'EXAMPLE',
  created_at timestamptz not null default now(),
  constraint diamond_stones_example_marked check (
    is_example = false
    or (example_marker = 'EXAMPLE' and cert_number like 'EXAMPLE-%' and sku like 'FD-EX-%')
  )
);

create index if not exists diamond_stones_shape_idx on public.diamond_stones (shape);
create index if not exists diamond_stones_carat_idx on public.diamond_stones (carat);
create index if not exists diamond_stones_active_idx on public.diamond_stones (is_active);

comment on table public.diamond_stones is 'Loose diamonds for fatlum.diamonds. Example rows are marked EXAMPLE and are not live stock. No price column.';

create table if not exists public.diamond_requests (
  id uuid primary key default gen_random_uuid(),
  locale text not null default 'de' check (locale in ('de', 'en')),
  kind text not null default 'list' check (kind in ('list', 'contact')),
  name text not null check (char_length(name) between 2 and 200),
  email text not null check (char_length(email) between 5 and 254),
  phone text check (phone is null or char_length(phone) <= 50),
  company text check (company is null or char_length(company) <= 200),
  message text check (message is null or char_length(message) <= 4000),
  consent boolean not null default false,
  consent_at timestamptz not null default now(),
  status text not null default 'new',
  created_at timestamptz not null default now(),
  constraint diamond_requests_consent_true check (consent = true)
);

create index if not exists diamond_requests_created_idx on public.diamond_requests (created_at desc);

comment on table public.diamond_requests is 'Diamond inquiry submissions. Anonymous insert only. No public read.';

create table if not exists public.diamond_request_items (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.diamond_requests (id) on delete cascade,
  stone_id uuid references public.diamond_stones (id) on delete set null,
  sku text not null,
  slug text not null,
  shape text not null,
  carat numeric not null check (carat > 0 and carat < 20),
  color text not null,
  clarity text not null,
  cut text,
  polish text,
  symmetry text,
  fluorescence text,
  cert_lab text,
  cert_number text,
  origin text not null,
  created_at timestamptz not null default now()
);

create index if not exists diamond_request_items_request_idx on public.diamond_request_items (request_id);

comment on table public.diamond_request_items is 'Lines on a diamond inquiry. Snapshot of specs, no price. Anonymous insert only.';

alter table public.diamond_stones enable row level security;
alter table public.diamond_requests enable row level security;
alter table public.diamond_request_items enable row level security;

drop policy if exists diamond_stones_public_read on public.diamond_stones;
create policy diamond_stones_public_read
  on public.diamond_stones
  for select
  to anon, authenticated
  using (is_active = true);

drop policy if exists diamond_requests_anon_insert on public.diamond_requests;
create policy diamond_requests_anon_insert
  on public.diamond_requests
  for insert
  to anon, authenticated
  with check (
    consent is true
    and char_length(name) between 2 and 200
    and char_length(email) between 5 and 254
    and locale in ('de', 'en')
    and kind in ('list', 'contact')
  );

drop policy if exists diamond_request_items_anon_insert on public.diamond_request_items;
create policy diamond_request_items_anon_insert
  on public.diamond_request_items
  for insert
  to anon, authenticated
  with check (
    char_length(sku) between 1 and 64
    and char_length(slug) between 1 and 180
    and carat > 0
    and carat < 20
  );

revoke all on table public.diamond_stones from public, anon, authenticated;
revoke all on table public.diamond_requests from public, anon, authenticated;
revoke all on table public.diamond_request_items from public, anon, authenticated;

grant select on table public.diamond_stones to anon, authenticated;
grant insert on table public.diamond_requests to anon, authenticated;
grant insert on table public.diamond_request_items to anon, authenticated;

grant select, insert, update, delete on table public.diamond_stones to service_role;
grant select, insert, update, delete on table public.diamond_requests to service_role;
grant select, insert, update, delete on table public.diamond_request_items to service_role;

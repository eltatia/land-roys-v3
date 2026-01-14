-- Migration to align admin-facing tables with repo schema

create table if not exists public.motos (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  titulo text not null,
  slug text unique,
  descripcion text,
  precio numeric,
  imagen text,
  hero_tagline text,
  hero_title text,
  hero_highlight text,
  hero_description text,
  price_soles text,
  price_usd text,
  power text,
  torque text,
  weight text,
  displacement text,
  engine_type text,
  suspension text,
  brakes text,
  consumption text,
  autonomia text,
  marketing_highlights jsonb default '[]'::jsonb,
  hero_image text,
  bike_image text,
  performance_image text,
  gallery_images jsonb default '[]'::jsonb,
  video_urls jsonb default '[]'::jsonb,
  active boolean default true
);

create table if not exists public.repuestos (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  slug text unique,
  description text,
  price numeric,
  image text,
  hero_tagline text,
  hero_title text,
  hero_highlight text,
  hero_description text,
  price_soles text,
  price_usd text,
  spec_primary text,
  spec_secondary text,
  spec_tertiary text,
  hero_image text,
  performance_image text,
  marketing_highlights jsonb default '[]'::jsonb,
  gallery_images jsonb default '[]'::jsonb,
  video_urls jsonb default '[]'::jsonb,
  active boolean default true
);

create table if not exists public.pedidos (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  cliente_nombre text,
  cliente_email text,
  estado text default 'pendiente',
  total numeric,
  notas text
);

create table if not exists public.settings (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  site_title text,
  contact_email text,
  contact_phone text,
  whatsapp text,
  address text,
  updated_at timestamp with time zone
);

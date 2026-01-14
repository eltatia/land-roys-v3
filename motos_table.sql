-- Crear la tabla 'motos'
create table public.motos (
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

-- Habilitar RLS (Row Level Security)
alter table public.motos enable row level security;

-- Política de lectura: Todo el mundo puede ver las motos (público)
create policy "Public motos are viewable by everyone"
  on public.motos for select
  using ( true );

-- Política de escritura: Solo admins pueden insertar
create policy "Admins can insert motos"
  on public.motos for insert
  with check (
    (select role from public.profiles where id = auth.uid()) = 'admin'
  );

-- Política de actualización: Solo admins pueden actualizar
create policy "Admins can update motos"
  on public.motos for update
  using (
    (select role from public.profiles where id = auth.uid()) = 'admin'
  );

-- Política de eliminación: Solo admins pueden eliminar
create policy "Admins can delete motos"
  on public.motos for delete
  using (
    (select role from public.profiles where id = auth.uid()) = 'admin'
  );

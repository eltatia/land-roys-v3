-- Crear la tabla 'repuestos'
create table public.repuestos (
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

-- Habilitar RLS
alter table public.repuestos enable row level security;

-- Política de lectura pública
create policy "Public repuestos are viewable by everyone"
  on public.repuestos for select
  using ( true );

-- Política de escritura: solo admins
create policy "Admins can insert repuestos"
  on public.repuestos for insert
  with check (
    (select role from public.profiles where id = auth.uid()) = 'admin'
  );

create policy "Admins can update repuestos"
  on public.repuestos for update
  using (
    (select role from public.profiles where id = auth.uid()) = 'admin'
  );

create policy "Admins can delete repuestos"
  on public.repuestos for delete
  using (
    (select role from public.profiles where id = auth.uid()) = 'admin'
  );

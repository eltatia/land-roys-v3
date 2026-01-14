-- Crear la tabla 'settings'
create table public.settings (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  site_title text,
  contact_email text,
  contact_phone text,
  whatsapp text,
  address text,
  updated_at timestamp with time zone
);

alter table public.settings enable row level security;

create policy "Admins can view settings"
  on public.settings for select
  using (
    (select role from public.profiles where id = auth.uid()) = 'admin'
  );

create policy "Admins can upsert settings"
  on public.settings for insert
  with check (
    (select role from public.profiles where id = auth.uid()) = 'admin'
  );

create policy "Admins can update settings"
  on public.settings for update
  using (
    (select role from public.profiles where id = auth.uid()) = 'admin'
  );

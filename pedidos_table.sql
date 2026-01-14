-- Crear la tabla 'pedidos'
create table public.pedidos (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  cliente_nombre text,
  cliente_email text,
  estado text default 'pendiente',
  total numeric,
  notas text
);

-- Habilitar RLS
alter table public.pedidos enable row level security;

-- Lectura solo admins
create policy "Admins can view pedidos"
  on public.pedidos for select
  using (
    (select role from public.profiles where id = auth.uid()) = 'admin'
  );

-- Escritura solo admins (pedidos creados desde backoffice)
create policy "Admins can insert pedidos"
  on public.pedidos for insert
  with check (
    (select role from public.profiles where id = auth.uid()) = 'admin'
  );

create policy "Admins can update pedidos"
  on public.pedidos for update
  using (
    (select role from public.profiles where id = auth.uid()) = 'admin'
  );

create policy "Admins can delete pedidos"
  on public.pedidos for delete
  using (
    (select role from public.profiles where id = auth.uid()) = 'admin'
  );

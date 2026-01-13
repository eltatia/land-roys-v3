-- Crear la tabla 'consultas'
create table public.consultas (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  nombre text not null,
  email text,
  telefono text,
  asunto text,
  mensaje text,
  estado text default 'Pendiente', -- Pendiente, Leído, Atendido
  modelo_interes text -- Opcional, si preguntan por una moto específica
);

-- Habilitar RLS
alter table public.consultas enable row level security;

-- Políticas de Seguridad

-- 1. Lectura: Solo admins pueden ver las consultas
create policy "Admins can view consultas"
  on public.consultas for select
  using (
    (select role from public.profiles where id = auth.uid()) = 'admin'
  );

-- 2. Escritura: Cualquiera (público) puede crear una consulta (desde el formulario de contacto)
create policy "Public can insert consultas"
  on public.consultas for insert
  with check ( true );

-- 3. Actualización: Solo admins pueden cambiar el estado
create policy "Admins can update consultas"
  on public.consultas for update
  using (
    (select role from public.profiles where id = auth.uid()) = 'admin'
  );

-- 4. Eliminación: Solo admins pueden borrar consultas
create policy "Admins can delete consultas"
  on public.consultas for delete
  using (
    (select role from public.profiles where id = auth.uid()) = 'admin'
  );

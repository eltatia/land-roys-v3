-- Permitir acceso al bucket 'motos' en storage.objects

-- 1. Política de INSERCIÓN (Subir imágenes) - Solo Admins
create policy "Admins can upload motos images"
on storage.objects for insert
with check (
  bucket_id = 'motos' AND
  (select role from public.profiles where id = auth.uid()) = 'admin'
);

-- 2. Política de ACTUALIZACIÓN (Reemplazar imágenes) - Solo Admins
create policy "Admins can update motos images"
on storage.objects for update
with check (
  bucket_id = 'motos' AND
  (select role from public.profiles where id = auth.uid()) = 'admin'
);

-- 3. Política de ELIMINACIÓN (Borrar imágenes) - Solo Admins
create policy "Admins can delete motos images"
on storage.objects for delete
using (
  bucket_id = 'motos' AND
  (select role from public.profiles where id = auth.uid()) = 'admin'
);

-- 4. Política de LECTURA (Ver imágenes) - Público
-- (Esto suele ser redundante si el bucket es "Public", pero asegura el acceso)
create policy "Public can view motos images"
on storage.objects for select
using (
  bucket_id = 'motos'
);

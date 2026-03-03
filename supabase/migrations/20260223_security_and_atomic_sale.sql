-- Atomic sale close + basic RLS hardening scaffold

-- 1) Atomic transactional function for sale close workflow
create or replace function public.registrar_venta_atomica(
  p_solicitud_id bigint,
  p_moto_id uuid,
  p_stock_actual integer,
  p_venta jsonb,
  p_solicitud_updates jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_stock integer;
  v_venta_id bigint;
begin
  select stock into v_stock
  from public.motos
  where id = p_moto_id
  for update;

  if v_stock is null then
    raise exception 'Moto no encontrada';
  end if;

  if v_stock <= 0 then
    raise exception 'Stock agotado';
  end if;

  if v_stock <> p_stock_actual then
    raise exception 'Stock desactualizado, vuelve a cargar';
  end if;

  insert into public.ventas (
    solicitud_id,
    cliente_nombre,
    cliente_email,
    producto,
    monto,
    metodo_pago,
    fecha_entrega,
    notas,
    estado
  )
  values (
    p_solicitud_id,
    p_venta->>'cliente_nombre',
    p_venta->>'cliente_email',
    p_venta->>'producto',
    nullif(p_venta->>'monto', '')::numeric,
    p_venta->>'metodo_pago',
    nullif(p_venta->>'fecha_entrega', '')::date,
    p_venta->>'notas',
    coalesce(p_venta->>'estado', 'completado')
  )
  returning id into v_venta_id;

  update public.motos
  set stock = stock - 1,
      actualizado_en = now()
  where id = p_moto_id;

  update public.solicitudes
  set estado = coalesce(p_solicitud_updates->>'estado', estado),
      notas_admin = coalesce(p_solicitud_updates->>'notas_admin', notas_admin)
  where id = p_solicitud_id;

  return jsonb_build_object('ok', true, 'venta_id', v_venta_id);
end;
$$;

revoke all on function public.registrar_venta_atomica(bigint, uuid, integer, jsonb, jsonb) from public;
grant execute on function public.registrar_venta_atomica(bigint, uuid, integer, jsonb, jsonb) to authenticated;

-- 2) Optional RLS baseline (adjust role mapping/policies to your environment)
alter table public.motos enable row level security;
alter table public.repuestos enable row level security;
alter table public.solicitudes enable row level security;
alter table public.ventas enable row level security;

-- Public read policies
create policy if not exists motos_public_read
on public.motos for select
using (true);

create policy if not exists repuestos_public_read
on public.repuestos for select
using (true);

-- Authenticated read for CRM/Sales (tighten to admin/asistente mapping if needed)
create policy if not exists solicitudes_auth_read
on public.solicitudes for select
to authenticated
using (true);

create policy if not exists ventas_auth_read
on public.ventas for select
to authenticated
using (true);

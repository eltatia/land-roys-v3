-- Compatibilidad para triggers genéricos que actualizan NEW.updated_at
-- Evita errores 42703: record "new" has no field "updated_at"

ALTER TABLE public.motos
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

ALTER TABLE public.repuestos
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

ALTER TABLE public.categorias_motos
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

ALTER TABLE public.categorias_repuestos
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

ALTER TABLE public.ofertas
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- Sincronización inicial opcional con columnas existentes de auditoría
UPDATE public.motos
SET updated_at = COALESCE(updated_at, actualizado_en::timestamptz, now());

UPDATE public.repuestos
SET updated_at = COALESCE(updated_at, actualizado_en::timestamptz, now());

UPDATE public.ofertas
SET updated_at = COALESCE(updated_at, actualizado_en::timestamptz, now());

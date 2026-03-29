ALTER TABLE public.repuestos
ADD COLUMN IF NOT EXISTS unidad_medida text,
ADD COLUMN IF NOT EXISTS modelo text,
ADD COLUMN IF NOT EXISTS cantidad_por_paquete integer,
ADD COLUMN IF NOT EXISTS marca_logo_url text,
ADD COLUMN IF NOT EXISTS galeria_imagenes jsonb DEFAULT '[]'::jsonb;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'repuestos_marca_logo_url_check'
  ) THEN
    ALTER TABLE public.repuestos
    ADD CONSTRAINT repuestos_marca_logo_url_check
    CHECK (
      marca_logo_url IS NULL
      OR marca_logo_url ~* '^https?://'
    );
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'repuestos_galeria_imagenes_check'
  ) THEN
    ALTER TABLE public.repuestos
    ADD CONSTRAINT repuestos_galeria_imagenes_check
    CHECK (
      galeria_imagenes IS NULL
      OR jsonb_typeof(galeria_imagenes) = 'array'
    );
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'repuestos_cantidad_por_paquete_check'
  ) THEN
    ALTER TABLE public.repuestos
    ADD CONSTRAINT repuestos_cantidad_por_paquete_check
    CHECK (cantidad_por_paquete IS NULL OR cantidad_por_paquete >= 1);
  END IF;
END
$$;

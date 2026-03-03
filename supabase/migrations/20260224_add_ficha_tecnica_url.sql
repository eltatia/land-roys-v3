-- Opción 1: almacenar ficha técnica por moto en la tabla motos
alter table public.motos
add column if not exists ficha_tecnica_url text;

-- Validación básica de URL http/https cuando el campo no es nulo
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'motos_ficha_tecnica_url_check'
  ) THEN
    ALTER TABLE public.motos
    ADD CONSTRAINT motos_ficha_tecnica_url_check
    CHECK (
      ficha_tecnica_url IS NULL
      OR ficha_tecnica_url ~* '^https?://'
    );
  END IF;
END
$$;

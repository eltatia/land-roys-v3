-- Mejora de la tabla motos para soportar catálogo/admin más completo
-- Ejecutar en Supabase SQL Editor

ALTER TABLE public.motos
  ADD COLUMN IF NOT EXISTS marca text,
  ADD COLUMN IF NOT EXISTS modelo_codigo text,
  ADD COLUMN IF NOT EXISTS anio integer,
  ADD COLUMN IF NOT EXISTS cilindrada_cc integer,
  ADD COLUMN IF NOT EXISTS estado text NOT NULL DEFAULT 'disponible',
  ADD COLUMN IF NOT EXISTS transmision text,
  ADD COLUMN IF NOT EXISTS color text,
  ADD COLUMN IF NOT EXISTS peso_kg numeric,
  ADD COLUMN IF NOT EXISTS tanque_litros numeric,
  ADD COLUMN IF NOT EXISTS destacado boolean NOT NULL DEFAULT false;

ALTER TABLE public.motos
  ADD CONSTRAINT motos_anio_check CHECK (anio IS NULL OR anio BETWEEN 1950 AND 2100),
  ADD CONSTRAINT motos_cc_check CHECK (cilindrada_cc IS NULL OR cilindrada_cc > 0),
  ADD CONSTRAINT motos_estado_check CHECK (estado IN ('disponible', 'agotado', 'preventa'));

CREATE INDEX IF NOT EXISTS idx_motos_categoria ON public.motos (categoria);
CREATE INDEX IF NOT EXISTS idx_motos_estado ON public.motos (estado);
CREATE INDEX IF NOT EXISTS idx_motos_anio ON public.motos (anio);

COMMENT ON COLUMN public.motos.modelo_codigo IS 'Código interno o SKU del modelo';
COMMENT ON COLUMN public.motos.cilindrada_cc IS 'Cilindrada en centímetros cúbicos';
COMMENT ON COLUMN public.motos.estado IS 'disponible|agotado|preventa';

-- Backfill mínimo recomendado
UPDATE public.motos
SET estado = 'disponible'
WHERE estado IS NULL;

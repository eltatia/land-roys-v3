-- Tabla de especificaciones técnicas para motos
-- Ejecutar en Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.motos_specs (
  id uuid NOT NULL,
  anio integer,
  capacidad_tanque_l numeric,
  cilindrada_cc integer,
  maxima_velocidad_kmh integer,
  velocidades integer,
  motor_especificacion text,
  torque_max_nm numeric,
  torque_max_rpm integer,
  potencia_max_hp numeric,
  potencia_max_rpm integer,
  use_diferencial boolean DEFAULT false,
  diferencial_titulo text,
  diferencial_subtitulo text,
  diferencial_texto text,
  creado_en timestamp without time zone DEFAULT now(),
  actualizado_en timestamp without time zone DEFAULT now(),
  CONSTRAINT motos_specs_pkey PRIMARY KEY (id),
  CONSTRAINT motos_specs_moto_id_fkey FOREIGN KEY (id) REFERENCES public.motos(id) ON DELETE CASCADE
);

ALTER TABLE public.motos_specs
  ADD CONSTRAINT motos_specs_anio_check CHECK (anio IS NULL OR anio BETWEEN 1950 AND 2100),
  ADD CONSTRAINT motos_specs_cc_check CHECK (cilindrada_cc IS NULL OR cilindrada_cc > 0),
  ADD CONSTRAINT motos_specs_vel_check CHECK (velocidades IS NULL OR velocidades > 0);

CREATE INDEX IF NOT EXISTS idx_motos_specs_anio ON public.motos_specs (anio);
CREATE INDEX IF NOT EXISTS idx_motos_specs_cc ON public.motos_specs (cilindrada_cc);

# Análisis completo del proyecto (Frontend + Backend + compatibilidad con Supabase)

## 1) Resumen ejecutivo

El proyecto está construido con **React + Vite** y usa Supabase como backend (Auth, Postgres y Storage). La integración general es funcional y cubre:

- Catálogo de motos y repuestos.
- Gestión de ofertas y slider home.
- Formulario de solicitudes de clientes y módulo de ventas/reportes.
- Autenticación y control básico de acceso para administración.

A nivel de compatibilidad con tu esquema SQL, el estado general es **bueno**, con varios puntos de mejora importantes:

1. **Inconsistencia de fechas** entre tablas (`created_at` vs `creado_en`) en reportes y filtros.
2. **Doble modelado de categorías** en motos/repuestos (campo texto + FK) que puede desalinear datos.
3. **Control de rol incompleto**: rutas protegidas sólo para `admin`, aunque parte del código menciona `asistente`.
4. **Dependencia implícita de RLS/políticas** no visible en repo (riesgo si no está configurado en Supabase).
5. **Algunas consultas asumen singularidad** (`.single()`) en roles, pudiendo fallar si un usuario tiene varios roles.

---

## 2) Stack y arquitectura detectada

## Frontend

- React 19 + Vite.
- Navegación con `react-router-dom`.
- UI basada en componentes por dominios (`client`, `admin`, `common`).
- Estado local con hooks y context (`AuthContext`).

## Capa de acceso a datos ("backend" desde el frontend)

- Cliente Supabase centralizado en `src/api/Supabase.provider.js`.
- Servicios por dominio en `src/services/*` (motos, repuestos, ofertas, slider, ventas, solicitudes, reportes, etc.).
- Hooks de consumo para páginas/componentes (`useMotos`, `useOfertas`, `useRankingHome`).

## Backend real

- Supabase Postgres como BD principal.
- Supabase Auth para login admin.
- Supabase Storage para imágenes/video (`motos`, `repuestos`, `Slides_home_img`, `ranking_3`).

---

## 3) Mapeo: tablas de tu esquema vs uso en código

## Tablas usadas correctamente y de forma explícita

- `motos` + `motos_specs`: CRUD completo, incluyendo carga de imágenes/video y specs por tabla hija.
- `repuestos` + `categorias_repuestos`: CRUD y lectura con relación.
- `categorias_motos`: CRUD y uso jerárquico con `parent_id`.
- `ofertas`: lectura pública + CRUD admin.
- `slider_home`: CRUD, orden y almacenamiento de imágenes.
- `ranking_home`: lectura pública y guardado con `upsert`.
- `solicitudes`: creación cliente y gestión admin.
- `ventas`: listado, creación, métricas y reportes.
- `usuario`, `usuario_rol`, `rol`: carga de roles para auth/autorización.

## Tablas del esquema **sin uso detectado** en frontend actual

- No se ve uso directo de migraciones ni scripts SQL en repo.
- `usuario`/`usuario_rol`/`rol` sí se usan para roles, pero no hay panel de gestión de usuarios/roles.

---

## 4) Compatibilidad detallada con tu esquema SQL

## 4.1 Motos y especificaciones

Compatibilidad positiva:

- `estado` validado con valores esperados (`disponible`, `agotado`, `preventa`).
- `stock` y precios tratados como numéricos.
- `galeria_destacada` se maneja como array JSON (alineado con check `jsonb_typeof(...) = 'array'`).
- `motos_specs` se guarda por `id` = `motos.id` (1:1 correcto).

Riesgos/mejoras:

- El código mantiene `categoria` como texto en `motos`; no hay FK a `categorias_motos`, así que puede haber nombres inconsistentes.
- En `updateMoto`, si no envías specs, no se limpian campos previos (persisten valores antiguos), lo cual puede ser deseado o no.

## 4.2 Repuestos y categorías

Compatibilidad positiva:

- Existe `categoria_id` con FK a `categorias_repuestos(id)` y también se muestra `categoria_nombre` en UI.
- Validaciones de `estado`, `stock`, `precio` alineadas con el esquema.

Riesgos/mejoras:

- También se guarda `categoria` (texto) además de `categoria_id` (FK). Tener ambos puede desincronizar etiqueta vs referencia real.
- Recomendación: priorizar `categoria_id` como fuente de verdad y generar nombre por join.

## 4.3 Ofertas

Compatibilidad positiva:

- Campos principales del esquema (`titulo`, `descuento`, `descripcion`, `imagen_url`, `expiracion`, `precio_original`, `precio_especial`) se usan.

Riesgos/mejoras:

- El esquema tiene `moto_id` (FK) y `moto_seleccionada` (texto). El código usa sobre todo el texto; conviene consolidar en `moto_id` para integridad referencial fuerte.

## 4.4 Slider home

Compatibilidad positiva:

- Tabla `slider_home` usada con orden (`orden`) y estado.
- Se guarda `url_image` como path de Storage y se transforma a URL pública en frontend.

Riesgos/mejoras:

- Hay dos estilos de retorno de URL en servicio; conviene estandarizar un solo contrato de datos (siempre path o siempre public URL).

## 4.5 Solicitudes, ventas y reportes

Compatibilidad positiva:

- Inserción de solicitudes desde cliente.
- Ventas y métricas básicas disponibles.

Riesgos/mejoras importantes:

- Reportes usan `created_at` para `solicitudes` y `fecha_venta` para `ventas`; esto está bien para esas tablas, pero otros módulos usan `creado_en`. Conviene unificar convención en todo el sistema para reducir errores.
- Distribución de leads mapea `cerrado` a “Perdidos”; validar que los estados reales en BD coincidan con esa taxonomía.

## 4.6 Auth, usuario y roles

Compatibilidad positiva:

- Login/logout/session con Supabase Auth.
- Resolución de rol desde `usuario_rol -> rol`.

Riesgos/mejoras:

- `AuthContext` usa `.single()` al consultar `usuario_rol`; si un usuario tiene múltiples roles (tu modelo lo permite), esto puede fallar o devolver sólo uno.
- `ProtectedRoute` limita admin a `requiredRole="admin"` y no contempla permisos compuestos.
- `saveRankingHome` permite `admin/asistente`, pero las rutas principales están cerradas solo a `admin`.

---

## 5) Evaluación frontend/backend por módulos

## Módulo cliente

- Home: consume slider, ranking/ofertas y secciones estáticas.
- Modelos y detalle: consumen motos + specs.
- Repuestos: catálogo robusto con filtros, carrito local y salida a WhatsApp.
- Consulta: crea solicitudes (lead capture).

Fortalezas:

- Buena separación por páginas/componentes.
- Uso consistente de servicios.

Debilidades:

- Manejo de errores centrado en `console.error` + alertas; falta estrategia global (reintentos, toasts uniformes, boundary).

## Módulo admin

- Inventario: CRUD completo motos/repuestos/categorías.
- Ventas/Clientes/Reportes: panel operativo funcional.
- Home secciones: gestión de slider, ofertas, ranking.

Fortalezas:

- Cobertura funcional amplia con Supabase directo.
- Uso de Storage integrado en flujo de negocio.

Debilidades:

- Falta capa de validación central de payloads antes de insert/update.
- Falta tipado estricto (TS o schemas runtime tipo Zod).

---

## 6) Seguridad y gobernanza de datos (Supabase)

Puntos críticos a validar en Supabase (fuera del repo):

1. **RLS activo** en todas las tablas sensibles.
2. Políticas por rol para:
   - Lectura pública (sólo donde aplica: catálogo, ofertas activas, slider activo).
   - Escritura admin/asistente sólo en módulos permitidos.
3. Políticas de Storage por bucket (lectura pública controlada y escritura restringida).
4. Verificar que `VITE_SUPABASE_ANON_KEY` no tenga políticas demasiado permisivas.

---

## 7) Lista de incompatibilidades/riesgos concretos encontrados

1. Convención de fechas y columnas no totalmente uniforme entre módulos.
2. Doble fuente de verdad de categorías (`categoria` texto + `categoria_id` FK).
3. Modelo de roles N:M en BD, pero consumo tipo 1:1 en algunas consultas.
4. Autorización de rutas y permisos de acciones no totalmente alineados (`asistente` vs `admin`).
5. Integridad referencial parcialmente opcional en ofertas (`moto_seleccionada` texto vs `moto_id` FK).

---

## 8) Plan de mejora recomendado (priorizado)

## Prioridad alta

1. Unificar estrategia de roles:
   - Permisos por capacidad (ej. `canManageRanking`, `canManageInventory`) en lugar de role string directo.
2. Definir y aplicar RLS + políticas Storage explícitas.
3. Elegir una sola fuente de verdad para categorías y para oferta->moto (usar FK).

## Prioridad media

4. Estandarizar campos de auditoría temporal (`created_at`, `updated_at`) para todas las tablas nuevas.
5. Incorporar validación runtime de payloads (Zod/Yup) antes de persistir.
6. Añadir capa de manejo de errores reusable (normalización de errores Supabase).

## Prioridad baja

7. Migrar progresivamente a TypeScript para reducir bugs de shape de datos.
8. Crear tests de integración de servicios críticos (motos, repuestos, ofertas, solicitudes).

---

## 9) Conclusión

Tu base actual **sí es compatible** con el frontend/backend implementado en términos funcionales y de estructura principal. No hay bloqueos estructurales graves para operar. Sin embargo, para escalar de forma segura y mantenible, deberías corregir cuanto antes la alineación de roles/permisos, la consistencia de relaciones (FK vs texto) y la estandarización de convenciones de datos (fechas y validación).

En resumen:

- **Estado actual:** funcional y operable.
- **Riesgo principal:** seguridad/autorización y consistencia de datos a mediano plazo.
- **Siguiente paso recomendado:** hardening de RLS + normalización de modelo relacional.

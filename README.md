# Página campaña Plancha 02 · Consejo Académico UManizales

Sitio web estático con dos vistas:

- `index.html`: página pública de campaña.
- `admin.html`: panel administrativo para editar contenido sin tocar código (usa `localStorage`).

## Despliegue rápido

Puedes subir estos archivos a Netlify, Vercel, GitHub Pages, Cloudflare Pages o cualquier hosting estático.

## Edición de contenido

1. Abre `admin.html` en el navegador.
2. Cambia textos, logo, candidatos y propuestas.
3. Guarda.
4. Revisa `index.html`.

> Nota: los cambios se guardan en el navegador/dispositivo donde se edita. Si quieres un panel multiusuario en línea con base de datos, se puede conectar después con Supabase/Firebase/Strapi.

## Imágenes locales (nueva configuración)

- Las rutas de logo y fotos apuntan a la carpeta `media/uploads/` del proyecto.
- En `admin.html` ahora puedes usar **Seleccionar archivo** para autocompletar el nombre (tipo menú de carga).
- Después de seleccionar, coloca/copía físicamente esa imagen dentro de `media/uploads/` para que se vea en `index.html`.
- El proyecto incluye placeholders iniciales en `media/uploads/`.

# Página campaña Plancha 02 · Consejo Académico UManizales

Sitio web estático listo para publicar en GitHub + Netlify.

## Archivos clave que debes editar en código

- `data/content.json` → aquí va **todo el texto oficial** de la campaña (nombre, slogan, candidatos, propuestas y plan de gobierno).
- `media/uploads/` → aquí van **todas las fotos** y el logo.

## Ruta y nombres recomendados para fotos

Este repositorio no incluye fotos finales; debes subirlas tú en esta carpeta:

- `media/uploads/logo-plancha-02.jpg`
- `media/uploads/candidato-1.jpg`
- `media/uploads/candidato-2.jpg`
- `media/uploads/candidato-3.jpg`
- `media/uploads/candidato-4.jpg`

> Si cambias nombre o extensión, actualiza también la ruta en `data/content.json`.
> Si no subes esas imágenes, la página mostrará rutas sin archivo en producción.

## Dónde pegar el texto para publicar en Netlify

Pega el contenido final de campaña en:

- **`data/content.json`**

Este archivo es el que usa el sitio público en producción estática.

## Flujo exacto (local → GitHub → Netlify)

1. Edita `data/content.json` con el texto final de la campaña.
2. Copia las fotos/logo a `media/uploads/` con los nombres indicados.
3. Abre `index.html` local para validar visualmente.
4. Haz `git add .`, `git commit` y `git push` al repositorio.
5. Netlify detecta el push y despliega automáticamente.

## Nota sobre admin.html

`admin.html` sirve para editar y previsualizar localmente, pero en hosting estático no escribe archivos del repo.
Para que cambios se publiquen siempre debes dejar la versión final en `data/content.json` y en `media/uploads/`.

## Acceso administrador

- Usuario por defecto: `administrador`
- Clave por defecto: `campañaAcademico2026`

## Si index.html no se actualiza

- `index.html` en producción ahora lee **solo** `data/content.json`.
- Si editaste `script.js` o `data/content.json`, asegúrate de hacer commit/push y esperar redeploy de Netlify.
- `localStorage` del admin ya no pisa el contenido público en `index.html`; solo se usa para previsualización en `admin.html`.
- Verifica que las rutas de imágenes del JSON existan realmente en `media/uploads/`.


## Problema común: no cargan las fotos

Si en `index.html` no aparecen las fotos, revisa:

1. Que los archivos existan físicamente en `media/uploads/`.
2. Que los nombres coincidan exactamente con `data/content.json` (mayúsculas/minúsculas importan en Netlify).
3. Que las rutas del JSON sean relativas, por ejemplo `media/uploads/candidato-1.jpg`.
4. Que no uses `.svg` si tus archivos reales son `.jpg` o `.png`.
5. Después de subir fotos al repo, haz `git add`, `git commit`, `git push` y espera redeploy de Netlify.

Rutas configuradas actualmente:
- `media/uploads/logo-plancha-02.jpg`
- `media/uploads/candidato-1.jpg`
- `media/uploads/candidato-2.jpg`
- `media/uploads/candidato-3.jpg`
- `media/uploads/candidato-4.jpg`

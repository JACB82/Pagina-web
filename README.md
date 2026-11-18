# Portafolio — Jose Armando Cuesta Buitrago

Portafolio personal de una sola página, construido con **HTML semántico, CSS moderno y JavaScript vanilla**. Sin frameworks, sin dependencias de build y listo para desplegar gratis en GitHub Pages.

## Vista previa

```bash
# Desde esta carpeta
python3 -m http.server 8000
# Abre http://localhost:8000
```

También puedes abrir `index.html` directamente en el navegador.

## Estructura

| Archivo | Contenido |
| --- | --- |
| `index.html` | Estructura semántica, contenido y SVG inline (iconos y favicon). |
| `styles.css` | Sistema de diseño: tokens, layout responsive, animaciones y estados. |
| `script.js` | Menú móvil, scroll reveal, enlace activo, typing, copiar correo y formulario → `mailto:`. |
| `Fondo.jpg` / `workinprogress.jpg` | Recursos visuales originales (se usan con baja opacidad como textura). |

## Personalizar antes de compartir

1. **Proyectos:** los enlaces “Ver código” apuntan a `https://github.com/JACB82`. Reemplázalos por la URL de cada repositorio en `index.html` (busca `Ver código`).
2. **Niveles del stack:** están en `styles.css` dentro de `--level` en cada `.skill-fill`. Ajusta los porcentajes a tu experiencia real.
3. **Redes:** GitHub y WhatsApp ya funcionan con tus datos reales. Si añades LinkedIn, agrega el enlace en la sección `.hero-social` y en `.contact-list`.
4. **CV:** si tienes un PDF, sube `cv.pdf` y cambia el botón “Contactarme” por un enlace de descarga con `download`.
5. **Correo y teléfono:** aparecen en `index.html` y en `script.js` (para copiar y para el formulario). Actualiza ambos si cambian.

## Desplegar en GitHub Pages

1. Sube los cambios a la rama principal del repositorio.
2. En GitHub: **Settings → Pages → Build and deployment**.
3. **Source:** *Deploy from a branch* → rama `main` → carpeta `/ (root)` → **Save**.
4. Tu sitio quedará en `https://jacb82.github.io/Pagina-web/`.

El archivo `.nojekyll` evita que GitHub procese el sitio con Jekyll, para que los archivos estáticos se sirvan tal cual.

## Decisiones de diseño

- **Dark cinematográfico:** fondo near-black, gradientes cian/violeta, rejillas sutiles, grano y halo que sigue el cursor.
- **Jerarquía clara:** hero con terminal, sobre mí, stack, proyectos, proceso y contacto con CTA.
- **Accesibilidad:** navegación por teclado, `skip-link`, `aria-*` en controles, foco visible y soporte para `prefers-reduced-motion`.
- **Rendimiento:** SVG inline, fuentes cargadas desde Google Fonts con `preconnect`, animaciones CSS y un único archivo JS pequeño.
- **Responsive:** breakpoints a 1024, 860 y 620 px.

¿Ideas o una oportunidad? Escríbeme a **josecuesta8234@gmail.com**.

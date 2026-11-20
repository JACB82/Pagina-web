# Guía: cómo se construyó la experiencia móvil

Esta guía explica las decisiones que hacen que el portafolio se sienta como una app en el celular y no como una página web encogida. La idea es que puedas **repetir estos patrones en cualquier proyecto**.

---

## 1. La idea central: móvil no es “escritorio pequeño”

En escritorio tienes mouse, hover y mucho espacio. En móvil tienes:

- Un dedo que cubre ~40 px de pantalla.
- La zona cómoda del pulgar: **tercio inferior** de la pantalla.
- Gestos naturales: deslizar, tocar, mantener.
- Menos ancho, pero más altura y más intimidad.

Por eso el rediseño móvil no fue “achicar todo”, sino **cambiar la forma de navegar y de presentar el contenido**.

| Escritorio | Móvil |
| --- | --- |
| Menú arriba | Dock abajo, cerca del pulgar |
| Tarjetas en grilla | Carrusel con `scroll-snap` |
| Hover para descubrir | Estados `:active` y contenido siempre visible |
| Mucho texto lateral | Jerarquía vertical y respiración |

---

## 2. El dock inferior (navegación tipo app)

**Archivo:** `index.html` (al final) y `styles.css` (`.dock`).

```html
<nav class="dock" aria-label="Navegación rápida">
  <a href="#inicio" class="active" aria-label="Inicio">
    <svg viewBox="0 0 24 24" aria-hidden="true">...</svg>
    <span>Inicio</span>
  </a>
  <!-- ... -->
</nav>
```

### Por qué funciona

- Está en la **zona del pulgar**.
- Es fijo (`position: fixed`) y usa `backdrop-filter` para sentirse parte del sistema.
- Tiene iconos + etiquetas: el icono da rapidez, la etiqueta elimina ambigüedad.
- El estado activo se sincroniza con el scroll mediante `IntersectionObserver` en `script.js`.

### Detalles importantes

```css
.dock {
  position: fixed;
  bottom: calc(12px + env(safe-area-inset-bottom, 0px));
  z-index: 110;
}
```

- `env(safe-area-inset-bottom)` evita que el dock quede debajo del gesto/notch del iPhone.
- `body { padding-bottom: calc(88px + env(...)); }` evita que el dock tape el final del contenido.
- `meta viewport` incluye `viewport-fit=cover` para que el navegador permita usar toda la pantalla.

### Aprendizaje

Un dock no es solo estética: **reduce la distancia entre el pulgar y la acción**. Si lo usas, recuerda:

1. Máximo 5 destinos.
2. Iconos claros + texto corto.
3. Nunca tapar contenido: compensa con `padding-bottom`.
4. Marca siempre la sección activa.

---

## 3. Hero con identidad: sello holográfico + aurora

**Archivos:** `index.html` (`.holo-badge`, `.aurora`) y `styles.css`.

En móvil el terminal solo no daba “esencia”. Se añadieron dos capas:

### a) Sello JACB

```html
<div class="holo-badge" aria-hidden="true">
  <span class="holo-ring"></span>
  <span class="holo-core">JACB</span>
  <span class="holo-caption">// OPEN TO WORK</span>
</div>
```

- Es un círculo con un anillo cónico girando (`conic-gradient` + `animation: spin`).
- El texto usa `background-clip: text` para heredar el degradado.
- Solo se muestra en móvil (`display: none` → `display: grid` en el breakpoint).

### b) Manchas de luz (aurora)

```css
.aurora {
  position: absolute;
  border-radius: 50%;
  filter: blur(70px);
  opacity: .3;
  animation: drift 16s ease-in-out infinite alternate;
}
```

Dos manchas (cian y violeta) se mueven lentamente. El truco es **opacidad baja + blur alto**: dan profundidad sin competir con el texto.

### c) Scanlines en el terminal

```css
.terminal::after {
  background: repeating-linear-gradient(
    0deg,
    rgba(255,255,255,.03) 0 1px,
    transparent 1px 4px
  );
}
```

Es una textura sutil que evoca una pantalla CRT. Si exageras, se ve sucio; al 3–5 % de opacidad, se ve premium.

---

## 4. Carrusel táctil de proyectos con `scroll-snap`

**Archivo:** `styles.css`, dentro de `@media (max-width: 620px)`.

```css
.projects-grid {
  grid-template-columns: none;
  grid-auto-flow: column;
  grid-auto-columns: 86%;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-padding-inline: 16px;
  scrollbar-width: none;
}
.project-card { scroll-snap-align: center; }
```

### Qué hace cada línea

- `grid-auto-flow: column`: convierte la grilla en una fila.
- `grid-auto-columns: 86%`: cada tarjeta ocupa casi todo el ancho, dejando ver la siguiente.
- `overflow-x: auto`: permite deslizar.
- `scroll-snap-type: x mandatory`: al soltar, la tarjeta se “imanta” al centro.
- `scrollbar-width: none`: oculta la barra fea en Firefox; `::-webkit-scrollbar` hace lo mismo en Chrome/Safari.
- `margin-inline: -16px` + `padding-inline: 16px`: hace que el carrusel llegue a los bordes de la pantalla sin cortar el contenido.

### Aprendizaje

`scroll-snap` es la forma más ligera de hacer un carrusel: **no necesita JavaScript**. Si añades navegación con flechas o puntos, ahí sí necesitas JS, pero el gesto básico ya funciona.

---

## 5. Tipografía que respira: `clamp()`

```css
.hero-title {
  font-size: clamp(2.35rem, 11vw, 3.25rem);
}
```

`clamp(min, ideal, max)` significa:

- Nunca menos de `2.35rem`.
- Si cabe, escala con el ancho (`11vw`).
- Nunca más de `3.25rem`.

Esto evita dos extremos: texto diminuto en tablets y texto gigante que se sale en celulares.

### Regla práctica

- Títulos: `clamp(2rem, 9–11vw, 3.5rem)`.
- Texto: `clamp(.95rem, 2.5vw, 1.05rem)`.
- Espaciados: `clamp(2rem, 8vw, 5rem)`.

---

## 6. Jerarquía móvil: secciones más claras

En móvil, el `section-head` pasa de fila a columna:

```css
.section-head {
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
}
.section-line { display: none; }
```

Así el índice (`01 /`) queda arriba, el título grande debajo y desaparece la línea decorativa que robaba ancho. **Menos elementos compitiendo = más claridad.**

---

## 7. Toque, no hover

En móvil no existe el hover real. Por eso:

```css
@media (hover: none) {
  .btn:active { transform: scale(.985); }
  .project-card:active { transform: scale(.99); }
  .dock a:active { transform: scale(.94); }
}
```

Además:

- Botones con altura mínima de ~50 px.
- Enlaces del dock con padding generoso.
- Nada importante depende de pasar el mouse.

### Aprendizaje

Diseña primero el estado **reposo** y el estado **tocado**. El hover es un extra para escritorio, no la base.

---

## 8. Movimiento con intención (y respeto)

Se usa movimiento para:

- Guiar la lectura (reveal al hacer scroll).
- Dar vida (aurora, sello, marquee).
- Confirmar acciones (toast al copiar el correo).

Pero siempre con salida de emergencia:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important;
    transition-duration: .01ms !important;
  }
}
```

Si el usuario configuró “reducir movimiento” en su sistema, la página debe seguir siendo usable y casi estática. Eso también es **saber hacer las cosas**.

---

## 9. Cómo probarlo como un profesional

### En Chrome / Edge

1. Abre `index.html` con un servidor local:
   ```bash
   python3 -m http.server 8000
   ```
2. `F12` → icono de dispositivo (Ctrl + Shift + M).
3. Prueba al menos: **390×844** (iPhone), **360×800** (Android), **768×1024** (tablet).
4. Activa “Throttling: Slow 4G” para ver si las animaciones molestan.
5. Usa **Lighthouse** en modo móvil: rendimiento, accesibilidad, buenas prácticas y SEO.

### En tu celular real

1. Conéctate a la misma red Wi-Fi que el computador.
2. Averigua tu IP local (`ip a` en Linux).
3. Abre `http://TU_IP:8000` en el celular.

### Qué mirar

- ¿Hay scroll horizontal? (no debe haber).
- ¿El dock tapa el último contenido?
- ¿Los botones se sienten cómodos con el pulgar?
- ¿El texto se lee sin hacer zoom?
- ¿El carrusel se siente fluido?

---

## 10. Ejercicios para aprender de verdad

1. **Cambia el dock:** agrega “CV” como sexto destino y observa por qué seis ya es demasiado. Prueba a quitar uno.
2. **Haz otro carrusel:** aplica `scroll-snap` a la tira `.now-strip`.
3. **Ajusta la aurora:** cambia colores, `blur`, `opacity` y duración. Anota qué combinación se siente elegante y cuál exagerada.
4. **Crea un modo claro:** duplica las variables en `:root` y cámbialas con `[data-theme="light"]`. Aprenderás tokens de diseño.
5. **Añade un cuarto proyecto:** copia una tarjeta, cambia el código del visual y observa cómo el carrusel sigue funcionando.
6. **Mide el contraste:** usa las DevTools para comprobar que el texto muted sigue siendo legible (WCAG AA).

---

## 11. Checklist antes de publicar

- [ ] Probado a 360, 390, 768 y 1440 px.
- [ ] Sin scroll horizontal.
- [ ] Dock con `safe-area-inset-bottom`.
- [ ] Contenido final visible (no tapado por el dock).
- [ ] Botones de al menos 44–48 px de alto.
- [ ] `prefers-reduced-motion` respetado.
- [ ] Enlaces reales (GitHub, correo, WhatsApp).
- [ ] Proyectos con URL propia, no solo el perfil.
- [ ] Lighthouse móvil > 90 en accesibilidad.
- [ ] Probado en un celular real.

---

## 12. Recursos para seguir

- **MDN:** `scroll-snap`, `clamp()`, `env()`, `IntersectionObserver`.
- **web.dev:** “Mobile-first design”, “Core Web Vitals”, “prefers-reduced-motion”.
- **Every Layout** (Heydon Pickering y Andy Bell): patrones de layout.
- **Refactoring UI**: jerarquía, espaciado y color.
- **Laws of UX**: por qué el pulgar y la proximidad importan.

> La diferencia entre “se ve bonito” y “se siente bien” está en estos detalles: zonas de toque, jerarquía, movimiento con propósito y respeto por el contexto del usuario. Eso es lo que un reclutador percibe aunque no sepa nombrarlo.

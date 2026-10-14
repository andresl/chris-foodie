# CookFoodie San Francisco (demo)

Sitio en vivo: https://chris-foodie.netlify.app
Repositorio: https://github.com/andresl/chris-foodie

## Qué es

Londo trató de replicar [cookfoodie.com](https://www.cookfoodie.com), el sitio de reseñas de Christian Van Der Henst (Cvander), pero solo con San Francisco y con otra visión. La meta era que funcionaran tres cosas que el sitio original no tiene:

1. **Ubicación.** Que el navegador sepa dónde estás y te diga qué recomendación de Chris queda cerca y a cuántos minutos a pie.
2. **Filtros.** Elegir por cocina, momento del día, precio o "con reseña de Chris", sin perder el orden por cercanía.
3. **Un juego.** Cinco preguntas de un clic, con la personalidad de Cvander, que terminan en un plan concreto: lugar, plato y dos alternativas. Ejemplo: "Cena coreana: barbacoa al carbón, para la chamusca, con chela" en San Ho Won.

Todo el contenido (notas, reseñas, fotos y reels) es de Christian y sale de cookfoodie.com. El sitio está en inglés y español con un botón; las reseñas siguen en inglés, como él las escribió.

> **Para tener claridad:** es una demo de producto y de diseño, no un sitio listo para posicionar. **Aún queda mucho por hacer en SEO técnico** (ver la sección [Pendientes](#pendientes)).

## Cómo correrlo

```bash
npm install
npm run dev      # servidor local
npm run build    # genera dist/ (lo que publica Netlify)
npm run datos    # vuelve a armar src/data/lugares.json desde scrap/
```

Stack: [Astro 5](https://astro.build) estático, sin framework de interfaz. JavaScript propio y liviano en el navegador, [Leaflet](https://leafletjs.com) solo para el mapa (se carga al abrirlo), tipografía Geist e íconos de Phosphor. Publica Netlify: cada push a `main` despliega el sitio.

## Mapa del proyecto

```
src/
  pages/
    index.astro          Portada + la guía (lista, filtros, ubicación, mapa)
    juego.astro          "Arma tu plan", el juego de Cvander
    places/[slug].astro  Ficha de cada lugar (53 páginas generadas)
  layouts/Base.astro     Cabecera, pie, idioma y metadatos comunes
  components/
    Parada.astro         Tarjeta de un lugar en la guía
    T.astro              Texto bilingüe
    Icono.astro          Íconos de Phosphor usados en el sitio
  lib/
    datos.ts             Acceso a los datos y textos compartidos
    preguntas.ts         Banco de preguntas del juego
  scripts/               Código que corre en el navegador
    ruta.ts              La guía: orden, filtros, ubicación, "Ver más", mapa
    juego.ts             El juego: partida, puntaje y plan
    mosaico.ts           Fotos que rotan en la portada
    comun.ts             Distancias, idioma activo y ubicación guardada
  styles/global.css      Paleta, tipografía y piezas comunes
  data/                  Datos ya armados (los genera scrap/2_armar_datos.mjs)
  assets/                Logo y las 63 fotos de las reseñas
public/                  Reels en video, íconos y _redirects
scrap/                   Fuentes y scripts que arman los datos
```

## Páginas

### `/` Portada y guía

- **Portada.** Título "Where Chris eats in San Francisco", dos botones ("Cerca de mí" y "Arma tu plan") y un mosaico con fotos de Chris que rota una casilla a la vez. Cada foto lleva a su lugar. Debajo hay una línea que, con ubicación, nombra el lugar más cercano.
- **La guía.** Los 53 lugares. Así se comporta:
  - **Orden sin ubicación:** al azar en cada visita, pero siempre primero los que tienen fotos de Chris (son 15).
  - **Orden con ubicación** (botón "Cerca de mí" o selector "o estoy en", con 15 barrios): por zonas (a pie hasta unos 15 minutos, cerca hasta 2 millas, lejos). Dentro de cada zona van primero los que tienen fotos. Cada tarjeta muestra la distancia, y la lista se reordena con una animación.
  - **Fuera de San Francisco:** si la persona está a más de 40 millas, el sitio se lo dice y le pide elegir un barrio para simular.
  - **Filtros:** cocina (9 regiones), cuándo (desayuno, brunch, almuerzo, cena, tarde en la noche, café, postre), precio y "con reseña de Chris".
  - **Carga:** muestra 12 tarjetas y un botón "Ver 12 más".
  - **Mapa:** mapa oscuro con los lugares filtrados, numerados si hay ubicación. Leaflet solo se descarga cuando alguien abre el mapa.
- **Invitación al juego** al final, con el logo del chef.

### `/juego` Arma tu plan

- El anfitrión es **Cvander**: habla en primera persona, con el logo de CookFoodie y sin fotos de Christian.
- **Cada partida tiene 5 preguntas** y cambia cada vez. Siempre hay una de hora y una de cocina, más 3 temas al azar de otros 8, y cada tema tiene varias versiones (10 temas y 21 preguntas en total; más de 2.600 combinaciones).
- Los temas salen de lo que Christian publica en X y en sus reseñas: el Mundial y la MLS, chela o mezcal, ramen compartido, layovers, agentes de IA que reservan o piden por la mesa, keynotes de Steve Jobs, presupuesto de inversionista ("invita el fondo", "etapa semilla"), Waymo y Guatemala.
- Cada respuesta tiene un comentario corto de Cvander. Una línea muestra el plan mientras se arma ("Tu plan hasta ahora: Cena, para la chamusca, con chela").
- **Resultado:** título del plan (comida más cocina), plato y compañía, lugar, distancia, nota de Chris, razones ("Un viaje a Corea sin salir de SF", "Chris le dio 5/5") y dos alternativas.
- **Compartir:** el link guarda las respuestas (`?a=hora:dinner.cocina:korea...`), así que quien lo abre ve el mismo plan.

### `/places/<slug>` Ficha de cada lugar

Se genera una página por lugar (53). Incluye:

- Cocina, barrio y distancia (si hay ubicación), precio, los momentos del día en que sirve, avisos ("Hay fila", "Reserva", "Solo efectivo") y botones para cómo llegar, Instagram y sitio web.
- La nota de Chris y, si hay reseña, sus estrellas, "Lo que pide Chris", el reel en video, sus fotos, el texto de la reseña, el consejo para reservar, la opinión de algún amigo y las preguntas frecuentes.
- Publicaciones de @cookfoodie que mencionan el lugar. El embed oficial de Instagram solo carga si la persona lo pide.
- Si no hay reseña, lo dice; no se inventan fotos ni calificaciones.
- Tres lugares cercanos.

Las URL viejas de cookfoodie.com para San Francisco (`/reviews/<slug>`) redirigen a `/places/<slug>` (`public/_redirects`).

## Módulos

| Archivo | Qué hace |
|---|---|
| `layouts/Base.astro` | Esqueleto de todas las páginas. Antes de pintar, un script elige el idioma (el guardado, si no el del navegador), así que no hay parpadeo. Tiene la cabecera, el pie y el selector EN/ES, que avisa con el evento `cf:lang` para que los scripts actualicen sus textos. |
| `components/T.astro` | Escribe las dos versiones de un texto (`.i-en` y `.i-es`) y el CSS oculta la que no toca. |
| `components/Parada.astro` | Tarjeta de la guía. Si hay reseña, muestra la primera foto de Chris (optimizada por Astro); si no, su nota es la protagonista. |
| `lib/datos.ts` | Carga `lugares.json` y `regiones.json`. Tiene los nombres de comidas, avisos y barrios para "estoy en", y la función que corta la primera frase de una nota. |
| `lib/preguntas.ts` | Banco del juego: temas, versiones, opciones, comentarios de Cvander y frases del plan. `elegirTanda()` arma cada partida. |
| `scripts/ruta.ts` | Toda la lógica de la guía: filtros, orden aleatorio con fotos primero, zonas por distancia, paginación de 12, ubicación (con aviso si estás lejos), animación al reordenar y mapa. |
| `scripts/juego.ts` | Avance de la partida, puntaje de cada lugar según las respuestas, título del plan (en español ajusta el género: "Cena coreana", "Desayuno chapín"), razones, alternativas y link para compartir. |
| `scripts/comun.ts` | Distancia en línea recta, formato "12 min a pie" o "2,4 mi", y la ubicación guardada en la sesión, que comparten la guía, el juego y las fichas. |
| `scripts/mosaico.ts` | Rota las fotos de la portada, solo cuando se ven y nunca si la persona pidió menos movimiento. |
| `styles/global.css` | Paleta Noche (fondo oscuro, bloques carbón y un acento chile), botones, filtros y pines del mapa. |

## De dónde salen los datos

`npm run datos` corre `scrap/2_armar_datos.mjs`, que une estas fuentes y escribe `src/data/lugares.json`:

| Fuente | Archivo | Qué aporta |
|---|---|---|
| Lista de SF de cookfoodie.com (`/wishlist/san-francisco`) | `scrap/fuente/wishlist-sf.next.json` | Los 52 lugares, la nota de Chris, la dirección, el Instagram y la prioridad. |
| Reseñas de cookfoodie.com | El mismo archivo, más `balompie.next.json` | 15 reseñas publicadas y la de Balompié Café, que está en curso: platos, fotos, preguntas, reserva y reels. The Morris tiene reseña pero no estaba en la lista; se agregó (53 en total). |
| OpenStreetMap (Nominatim) | `scrap/1_geocodificar.mjs` → `scrap/geo.json` | Coordenadas de cada dirección. Marufuku y The Morris se ubicaron a mano. |
| Instagram @cookfoodie | `scrap/instagram.json` | De 79 publicaciones, 3 corresponden a lugares de la lista (Burma Love, Mosto y Kingdom of Dumplings). Las demás son viajes de 2012 a 2014. |
| Etiquetas | `scrap/etiquetas.mjs` | Escritas a mano a partir de las notas: región, horario, precio, con quién ir, bebida, fila o reserva, picante y el plato que nombra el plan. |
| Voz de Cvander | `scrap/christian/voz.md` | Notas sobre el tono y los temas de Christian en X, usadas para escribir el juego. |

**Ojo:** los precios de los lugares sin reseña son estimados (`priceEst: true` en los datos) y conviene que Christian los confirme. Las etiquetas también son una lectura de sus notas, no datos del restaurante.

## Diseño

- **La comida primero:** las fotos reales de Chris mandan; no hay imágenes generadas ni retocadas.
- **Paleta Noche:** fondo casi negro, bloques carbón en cabecera, portada, plan y fichas, texto claro y un solo acento chile. Se eligió entre tres opciones (tomate, mostaza y noche) para que no se pareciera a MiDon.
- **Tipografía y marca:** una sola familia (Geist), con jerarquía por peso. El nombre CookFoodie y el logo del chef son los del sitio original.
- **Animación:** el movimiento acompaña cambios reales (la lista se reordena, las fotos rotan, el plan aparece) y respeta "reducir movimiento".
- **Descartado:** un primer concepto temático (una camioneta guatemalteca con muchos colores y la foto de Christian) fue descartado por no tener que ver con comida.

## Pendientes

**SEO técnico (lo más importante):**

- No hay `sitemap.xml` ni `robots.txt`.
- No hay datos estructurados (JSON-LD de `Restaurant`, `Review` o `ItemList`).
- Las páginas no tienen imagen para compartir (`og:image`) ni `twitter:card`.
- El bilingüe está en la misma URL: los dos idiomas viven en el HTML y el CSS oculta uno. No hay URL por idioma ni `hreflang`, y el `<html lang>` arranca en inglés. Para SEO hay que separar `/en/` y `/es/`.
- Títulos y descripciones solo en inglés.
- El canónico apunta a `chris-foodie.netlify.app`; habría que definir el dominio final y su relación con cookfoodie.com para no duplicar contenido.
- No hay página 404 propia.
- Las 37 fichas sin reseña tienen poco contenido propio (solo la nota de Chris).
- El orden aleatorio y el filtrado ocurren en el navegador. Los buscadores ven el orden del servidor y no hay URL por filtro, como "comida coreana en San Francisco" o "cerca de Mission".
- Falta medir Core Web Vitals con Lighthouse, sobre todo en celular. `dist/_astro` pesa unos 14 MB entre todas las versiones de las fotos.

**Producto y contenido:**

- Confirmar con Christian los precios estimados y las etiquetas.
- Faltan horarios de atención (hoy se dice "revisa horarios antes de ir").
- Hay más lugares de SF en Instagram que no están en su lista: Parachute Bakery y Moku Yakitori-Ya.
- Falta revisión final de accesibilidad y del diseño, y escribir el `DESIGN.md`.
- No hay analítica.

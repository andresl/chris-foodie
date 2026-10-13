# CookFoodie San Francisco (demo)

Demo de una nueva versión de cookfoodie.com solo para San Francisco: los 53 lugares de Christian Van Der Henst con filtros, distancia desde donde estás, mapa y "Arma tu plan" (10 preguntas con la voz de Cvander). Bilingüe EN/ES.

- Astro estático en Netlify (`npm run build`, publica `dist`).
- Datos: `npm run datos` arma `src/data/lugares.json` desde `scrap/` (wishlist y reseñas de cookfoodie.com, coordenadas de OpenStreetMap, cruce con Instagram y etiquetas en `scrap/etiquetas.mjs`).
- Precios marcados `priceEst` son estimados, no vienen de una reseña.

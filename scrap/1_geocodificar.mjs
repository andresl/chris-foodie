// Geocodifica las direcciones del wishlist de San Francisco con Nominatim (OSM), 1 consulta por segundo.
import fs from 'node:fs';
const src = JSON.parse(fs.readFileSync('scrap/fuente/wishlist-sf.next.json', 'utf8'));
const lista = src.props.pageProps.data.wishlist;
const salida = 'scrap/geo.json';
const geo = fs.existsSync(salida) ? JSON.parse(fs.readFileSync(salida, 'utf8')) : {};
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
async function buscar(q) {
  const url = 'https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=us&q=' + encodeURIComponent(q);
  const r = await fetch(url, { headers: { 'User-Agent': 'chris-foodie-demo/0.1 (andres)' } });
  if (!r.ok) throw new Error('HTTP ' + r.status);
  const j = await r.json();
  return j[0] ? { lat: +j[0].lat, lng: +j[0].lon, fuente: q, tipo: j[0].type } : null;
}
for (const p of lista) {
  if (geo[p.name]?.lat) continue;
  // Quitar "Suite", "#235" y similares, Nominatim falla con eso
  const limpia = p.address.replace(/,?\s*(Suite|Ste\.?|#)\s*[\w-]+/gi, '').replace(/\(.*?\)/g, '');
  let hit = null;
  for (const q of [limpia, `${p.name}, ${limpia}`, limpia.replace(/,\s*CA.*$/, ', San Francisco, CA')]) {
    try { hit = await buscar(q); } catch (e) { console.log('error', p.name, e.message); }
    await espera(1100);
    if (hit) break;
  }
  geo[p.name] = hit || { lat: null, lng: null, fuente: limpia };
  console.log(hit ? 'ok ' : 'NO ', p.name, hit ? `${hit.lat},${hit.lng}` : '');
  fs.writeFileSync(salida, JSON.stringify(geo, null, 1));
}
console.log('listo', Object.values(geo).filter((g) => g.lat).length, 'de', lista.length);

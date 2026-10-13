// Une el wishlist de SF, las reseñas, las coordenadas, Instagram y las etiquetas en src/data/lugares.json.
// Baja las fotos de las reseñas a src/assets/reviews/ y los reels a public/video/ (solo si faltan).
import fs from 'node:fs';
import path from 'node:path';
import { etiquetas, regiones } from './etiquetas.mjs';

const fuente = JSON.parse(fs.readFileSync('scrap/fuente/wishlist-sf.next.json', 'utf8')).props.pageProps;
const balompie = JSON.parse(fs.readFileSync('scrap/fuente/balompie.next.json', 'utf8')).props.pageProps.review;
const geo = JSON.parse(fs.readFileSync('scrap/geo.json', 'utf8'));
const ig = JSON.parse(fs.readFileSync('scrap/instagram.json', 'utf8')).posts;

// Coordenadas puestas a mano: Nominatim no encontró Marufuku y The Morris no está en el wishlist.
geo['Marufuku Ramen'] = { lat: 37.78527, lng: -122.43193, fuente: 'manual (Japan Center West)' };
geo['The Morris'] = { lat: 37.76325, lng: -122.41079, fuente: 'manual (Mariposa y Florida)' };

const resenas = Object.fromEntries(
  [...fuente.reviewsData.reviews.filter((r) => r.city === 'San Francisco'), balompie].map((r) => [r.slug, r]),
);
const lista = [...fuente.data.wishlist];
const morris = resenas['the-morris'];
lista.push({
  name: 'The Morris', review_slug: 'the-morris', location: morris.location, cuisine: morris.cuisine,
  notes: morris.seo_description, priority: 4, address: morris.address, maps_url: morris.maps_url, instagram: morris.instagram,
});

const slugify = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  .replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const descargar = async (url, destino) => {
  if (fs.existsSync(destino)) return true;
  const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!r.ok) { console.log('  falla', r.status, url); return false; }
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  fs.writeFileSync(destino, Buffer.from(await r.arrayBuffer()));
  return true;
};

const lugares = [];
for (const w of lista) {
  const e = etiquetas[w.name];
  if (!e) throw new Error('Sin etiquetas: ' + w.name);
  const g = geo[w.name];
  if (!g?.lat) throw new Error('Sin coordenadas: ' + w.name);
  // Burma Super Star apunta a la reseña de Burma Love (son restaurantes hermanos), pero es otro lugar.
  const propia = w.review_slug && w.name !== 'Burma Super Star' ? w.review_slug : null;
  const nombreResena = w.name === 'Balompie Cafe' ? 'balompie-cafe' : propia;
  const r = nombreResena ? resenas[nombreResena] : null;
  const slug = nombreResena || slugify(w.name);

  let review = null;
  if (r) {
    const fotos = [];
    for (const [i, src] of (r.images || []).entries()) {
      const archivo = path.basename(src);
      if (await descargar('https://www.cookfoodie.com' + src, 'src/assets/reviews/' + archivo)) {
        fotos.push({ file: archivo, caption: r.image_captions?.[i] || '' });
      }
    }
    review = {
      status: r.status || 'published',
      date: r.review_date || null,
      rating: r.rating || null,
      shareTitle: r.share_title || null,
      bestDish: r.best_dish || null,
      personal: (r.personal_recommendation || '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean),
      dishes: (r.dishes_recommended || []).map((d) => ({ name: d.name, description: d.description })),
      faqs: r.faqs || [],
      reservationTip: r.reservation_tip || null,
      idealFor: r.ideal_for || null,
      pullQuote: r.pull_quote || null,
      guest: r.guest_review || null,
      images: fotos,
      url: 'https://www.cookfoodie.com/reviews/' + r.slug,
    };
  }

  let reel = null;
  if (r?.reel_video) {
    const v = path.basename(r.reel_video);
    const p = path.basename(r.reel_poster);
    await descargar('https://www.cookfoodie.com' + r.reel_video, 'public/video/' + v);
    await descargar('https://www.cookfoodie.com' + r.reel_poster, 'public/video/' + p);
    reel = { video: '/video/' + v, poster: '/video/' + p, url: r.instagram_reel };
  }

  const nombreIg = w.name === 'Balompie Cafe' ? 'Balompié Café' : w.name;
  const igPosts = ig.filter((p) => p.restaurante === nombreIg && p.tipo !== 'reel')
    .map((p) => ({ url: p.url, text: p.texto, date: p.fecha }));

  lugares.push({
    slug,
    name: w.name === 'Balompie Cafe' ? 'Balompié Café' : w.name === 'Mr Jiu\'s' ? 'Mister Jiu\'s' : w.name === "Tony's Pizza" ? "Tony's Pizza Napoletana" : w.name,
    hood: r?.location || w.location,
    cuisine: r?.cuisine || w.cuisine,
    region: e.region,
    adj: e.adj,
    meals: r?.meal_type?.length ? [...new Set([...r.meal_type, ...e.meals])] : e.meals,
    price: r?.price_range || e.price,
    priceEst: !r?.price_range && !!e.priceEst,
    tags: e.tags,
    plato: e.plato,
    note: w.notes,
    priority: w.priority || 2,
    address: r?.address || w.address,
    lat: g.lat,
    lng: g.lng,
    maps: r?.maps_url || w.maps_url,
    website: r?.website || w.website || null,
    instagram: (r?.instagram || w.instagram || '').replace(/^http:/, 'https:') || null,
    telephone: r?.telephone || null,
    review,
    reviewLink: w.name === 'Burma Super Star' ? 'burma-love' : null,
    reel,
    igPosts,
  });
}

// Tres paradas más cercanas a cada lugar, para "Cerca de esta parada".
const rad = (x) => (x * Math.PI) / 180;
const millas = (a, b) => {
  const d = Math.sin(rad(b.lat - a.lat) / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(rad(b.lng - a.lng) / 2) ** 2;
  return 3958.8 * 2 * Math.asin(Math.sqrt(d));
};
for (const l of lugares) {
  l.nearby = lugares.filter((o) => o !== l)
    .map((o) => ({ slug: o.slug, mi: +millas(l, o).toFixed(2) }))
    .sort((a, b) => a.mi - b.mi).slice(0, 3);
}

lugares.sort((a, b) => b.priority - a.priority || a.name.localeCompare(b.name));
fs.mkdirSync('src/data', { recursive: true });
fs.writeFileSync('src/data/lugares.json', JSON.stringify(lugares, null, 1));
fs.writeFileSync('src/data/regiones.json', JSON.stringify(regiones, null, 1));
console.log('lugares', lugares.length, '| con reseña', lugares.filter((l) => l.review).length,
  '| fotos', lugares.reduce((n, l) => n + (l.review?.images.length || 0), 0),
  '| reels', lugares.filter((l) => l.reel).length, '| posts IG', lugares.reduce((n, l) => n + l.igPosts.length, 0));

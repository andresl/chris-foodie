// La guía: ubicación, filtros, orden por distancia y mapa (Leaflet solo si se abre).
import { millas, formatoDistancia, leerPosicion, guardarPosicion, centroSF, idioma, type Pos } from './comun';

type Dato = { s: string; n: string; lat: number; lng: number; r: string; m: string[]; p: string; rv: boolean; h: string };
type Barrio = { id: string; name: string; lat: number; lng: number };

const textos = {
  favoritas: { en: (n: number) => `${n} places, Chris's favorites first.`, es: (n: number) => `${n} lugares, primero las favoritas de Chris.` },
  cerca: { en: (n: number, d: string) => `${n} places, closest first from ${d}.`, es: (n: number, d: string) => `${n} lugares, del más cerca al más lejos desde ${d}.` },
  tuUbicacion: { en: 'where you are', es: 'donde estás' },
  buscando: { en: 'Looking for you…', es: 'Buscándote…' },
  lejos: {
    en: (mi: string) => `You're ${mi} from San Francisco. Pick a neighborhood to see it as if you were there.`,
    es: (mi: string) => `Estás a ${mi} de San Francisco. Elige un barrio para verlo como si estuvieras allá.`,
  },
  sinPermiso: {
    en: "I couldn't get your location. Pick a neighborhood and I'll sort from there.",
    es: 'No pude ver tu ubicación. Elige un barrio y ordeno desde ahí.',
  },
  masCerca: {
    en: (n: string, d: string) => `Closest to you: ${n}, ${d}.`,
    es: (n: string, d: string) => `Lo más cerca: ${n}, ${d}.`,
  },
};

export function iniciarRuta() {
  const fuente = document.getElementById('datos-ruta');
  if (!fuente) return;
  const { lugares, barrios } = JSON.parse(fuente.textContent || '{}') as { lugares: Dato[]; barrios: Barrio[] };
  const ordenOriginal = lugares.map((l) => l.s);
  const lista = document.querySelector<HTMLOListElement>('[data-lugares]')!;
  const tarjetas = new Map<string, HTMLLIElement>();
  lista.querySelectorAll<HTMLLIElement>('.lugar').forEach((li) => tarjetas.set(li.dataset.slug!, li));

  const filtros = { r: new Set<string>(), m: new Set<string>(), p: new Set<string>(), rv: new Set<string>() };
  let pos: Pos | null = leerPosicion();
  let vista: 'lista' | 'mapa' = 'lista';
  let mapa: Awaited<ReturnType<typeof crearMapa>> | null = null;
  let primeraVez = true;
  const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const estado = document.querySelector<HTMLElement>('[data-estado]')!;
  const aviso = document.querySelector<HTMLElement>('[data-aviso]')!;
  const dato = document.querySelector<HTMLElement>('[data-globo]');
  const selector = document.querySelector<HTMLSelectElement>('[data-barrio]')!;
  const vacio = document.querySelector<HTMLElement>('[data-vacio]')!;
  const botonesCerca = document.querySelectorAll<HTMLButtonElement>('[data-cerca]');
  const limpiar = document.querySelectorAll<HTMLButtonElement>('[data-limpiar]');

  if (pos?.barrio) selector.value = pos.barrio;

  const pasa = (l: Dato) =>
    (!filtros.r.size || filtros.r.has(l.r)) &&
    (!filtros.m.size || l.m.some((m) => filtros.m.has(m))) &&
    (!filtros.p.size || filtros.p.has(l.p)) &&
    (!filtros.rv.size || l.rv);

  const ordenados = () => {
    const visibles = lugares.filter(pasa);
    if (pos) return visibles.map((l) => ({ l, d: millas(pos!, l) as number | null })).sort((a, b) => a.d! - b.d!);
    return visibles.sort((a, b) => ordenOriginal.indexOf(a.s) - ordenOriginal.indexOf(b.s)).map((l) => ({ l, d: null as number | null }));
  };

  const pintar = () => {
    const lang = idioma();
    const orden = ordenados();
    const visibles = new Set(orden.map((o) => o.l.s));
    const mover = () => {
      orden.forEach((o, i) => {
        const li = tarjetas.get(o.l.s)!;
        li.hidden = false;
        li.querySelector<HTMLElement>('[data-numero]')!.textContent = pos ? String(i + 1) : '';
        const d = li.querySelector<HTMLElement>('[data-distancia]')!;
        if (o.d !== null) { d.hidden = false; d.textContent = formatoDistancia(o.d, lang); } else d.hidden = true;
        lista.appendChild(li);
      });
      tarjetas.forEach((li, s) => { if (!visibles.has(s)) li.hidden = true; });
      vacio.hidden = orden.length > 0;
    };
    const doc = document as Document & { startViewTransition?: (f: () => void) => unknown };
    if (doc.startViewTransition && !reducido && vista === 'lista' && !primeraVez) doc.startViewTransition(mover);
    else mover();
    primeraVez = false;

    if (pos) {
      const donde = pos.barrio ? barrios.find((b) => b.id === pos!.barrio)?.name ?? '' : textos.tuUbicacion[lang];
      estado.textContent = textos.cerca[lang](orden.length, donde);
      const primero = orden[0];
      if (dato && primero) dato.textContent = textos.masCerca[lang](primero.l.n, formatoDistancia(primero.d!, lang, true));
    } else {
      estado.textContent = textos.favoritas[lang](orden.length);
    }
    const hayFiltros = Object.values(filtros).some((f) => f.size);
    limpiar.forEach((b) => { if (b.closest('.controles')) b.hidden = !hayFiltros; });
    mapa?.actualizar(orden.map((o) => o.l), pos);
  };

  document.querySelectorAll<HTMLButtonElement>('[data-filtro]').forEach((b) => {
    b.addEventListener('click', () => {
      const grupo = filtros[b.dataset.filtro as keyof typeof filtros];
      const v = b.dataset.valor!;
      const activo = !grupo.has(v);
      activo ? grupo.add(v) : grupo.delete(v);
      b.setAttribute('aria-pressed', String(activo));
      pintar();
    });
  });
  limpiar.forEach((b) => b.addEventListener('click', () => {
    Object.values(filtros).forEach((f) => f.clear());
    document.querySelectorAll('[data-filtro]').forEach((x) => x.setAttribute('aria-pressed', 'false'));
    pintar();
  }));

  const usarPos = (p: Pos | null) => { pos = p; guardarPosicion(p); pintar(); };
  const mostrarAviso = (t: string | null) => { aviso.hidden = !t; aviso.textContent = t ?? ''; };
  const pedirUbicacion = () => {
    if (!('geolocation' in navigator)) { mostrarAviso(textos.sinPermiso[idioma()]); selector.focus(); return; }
    botonesCerca.forEach((b) => b.setAttribute('aria-busy', 'true'));
    mostrarAviso(textos.buscando[idioma()]);
    navigator.geolocation.getCurrentPosition(
      (g) => {
        botonesCerca.forEach((b) => b.removeAttribute('aria-busy'));
        const aqui = { lat: g.coords.latitude, lng: g.coords.longitude };
        const lejos = millas(aqui, centroSF);
        if (lejos > 40) {
          mostrarAviso(textos.lejos[idioma()](formatoDistancia(lejos, idioma(), false, true)));
          selector.focus();
          return;
        }
        mostrarAviso(null);
        selector.value = '';
        usarPos(aqui);
      },
      () => {
        botonesCerca.forEach((b) => b.removeAttribute('aria-busy'));
        mostrarAviso(textos.sinPermiso[idioma()]);
        selector.focus();
      },
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 300000 },
    );
  };
  botonesCerca.forEach((b) => b.addEventListener('click', () => {
    if (b.closest('.portada')) document.getElementById('guia')?.scrollIntoView({ behavior: reducido ? 'auto' : 'smooth' });
    pedirUbicacion();
  }));
  selector.addEventListener('change', () => {
    const b = barrios.find((x) => x.id === selector.value);
    mostrarAviso(null);
    usarPos(b ? { lat: b.lat, lng: b.lng, barrio: b.id } : null);
  });

  document.querySelectorAll<HTMLButtonElement>('[data-vista]').forEach((b) => {
    b.addEventListener('click', async () => {
      vista = b.dataset.vista as 'lista' | 'mapa';
      document.querySelectorAll('[data-vista]').forEach((x) => x.setAttribute('aria-selected', String(x === b)));
      document.querySelectorAll<HTMLElement>('[data-panel]').forEach((p) => (p.hidden = p.dataset.panel !== vista));
      if (vista === 'mapa' && !mapa) mapa = await crearMapa(document.querySelector<HTMLElement>('[data-mapa]')!);
      pintar();
      mapa?.refrescar();
    });
  });

  document.addEventListener('cf:lang', () => pintar());
  pintar();
}

async function crearMapa(el: HTMLElement) {
  const L = (await import('leaflet')).default;
  await import('leaflet/dist/leaflet.css');
  const m = L.map(el, { scrollWheelZoom: false }).setView([centroSF.lat, centroSF.lng], 13);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    maxZoom: 19, subdomains: 'abcd',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  }).addTo(m);
  const capa = L.layerGroup().addTo(m);
  let yo: L.Marker | null = null;
  return {
    refrescar: () => setTimeout(() => m.invalidateSize(), 50),
    actualizar(visibles: Dato[], pos: Pos | null) {
      capa.clearLayers();
      const puntos: [number, number][] = [];
      visibles.forEach((l, i) => {
        const icono = L.divIcon({ className: `pin-lugar ${pos && i === 0 ? 'uno' : ''}`, html: `<span>${pos ? i + 1 : ''}</span>`, iconSize: [28, 28], iconAnchor: [14, 14] });
        L.marker([l.lat, l.lng], { icon: icono, title: l.n, alt: l.n })
          .bindPopup(`<a class="pin-enlace" href="/places/${l.s}"><strong>${l.n}</strong><br>${l.h}</a>`)
          .addTo(capa);
        puntos.push([l.lat, l.lng]);
      });
      if (yo) { yo.remove(); yo = null; }
      if (pos) {
        yo = L.marker([pos.lat, pos.lng], { icon: L.divIcon({ className: 'pin-yo', html: '<span></span>', iconSize: [18, 18], iconAnchor: [9, 9] }), zIndexOffset: 1000 }).addTo(m);
        puntos.push([pos.lat, pos.lng]);
      }
      if (puntos.length) m.fitBounds(L.latLngBounds(puntos).pad(0.08), { maxZoom: 15 });
    },
  };
}

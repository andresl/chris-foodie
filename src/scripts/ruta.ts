// La guía: ubicación, filtros, orden por distancia y mapa (Leaflet solo si se abre).
import { millas, formatoDistancia, leerPosicion, guardarPosicion, centroSF, idioma, type Pos } from './comun';

type Dato = { s: string; n: string; lat: number; lng: number; r: string; m: string[]; p: string; rv: boolean; h: string; f: boolean };
const POR_PAGINA = 12;
type Barrio = { id: string; name: string; lat: number; lng: number };

const textos = {
  favoritas: { en: (n: number) => `${n} places, the ones with Chris's photos first.`, es: (n: number) => `${n} lugares, primero los que tienen fotos de Chris.` },
  mas: {
    en: (n: number) => (n > POR_PAGINA ? `Show ${POR_PAGINA} more (${n} left)` : `Show the last ${n}`),
    es: (n: number) => (n > POR_PAGINA ? `Ver ${POR_PAGINA} más (quedan ${n})` : `Ver los últimos ${n}`),
  },
  cerca: { en: (n: number, d: string) => `${n} places by distance from ${d}, photographed ones first in each zone.`, es: (n: number, d: string) => `${n} lugares por cercanía desde ${d}, con fotos primero en cada zona.` },
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
  // Orden al azar en cada visita, pero siempre primero los que tienen fotos de Chris.
  const barajar = <T,>(a: T[]) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const ordenOriginal = [...barajar(lugares.filter((l) => l.f)), ...barajar(lugares.filter((l) => !l.f))].map((l) => l.s);
  const lista = document.querySelector<HTMLOListElement>('[data-lugares]')!;
  const tarjetas = new Map<string, HTMLLIElement>();
  lista.querySelectorAll<HTMLLIElement>('.lugar').forEach((li) => tarjetas.set(li.dataset.slug!, li));

  const filtros = { r: new Set<string>(), m: new Set<string>(), p: new Set<string>(), rv: new Set<string>() };
  let pos: Pos | null = leerPosicion();
  let vista: 'lista' | 'mapa' = 'lista';
  let mapa: Awaited<ReturnType<typeof crearMapa>> | null = null;
  let primeraVez = true;
  let limite = POR_PAGINA;
  const cajaMas = document.querySelector<HTMLElement>('[data-mas-caja]')!;
  const botonMas = document.querySelector<HTMLButtonElement>('[data-mas]')!;
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
    // Con ubicación: por zonas (a pie, cerca, lejos) y dentro de cada zona primero los que tienen fotos.
    const zona = (d: number) => (d <= 0.75 ? 0 : d <= 2 ? 1 : 2);
    if (pos) return visibles.map((l) => ({ l, d: millas(pos!, l) as number | null }))
      .sort((a, b) => zona(a.d!) - zona(b.d!) || Number(b.l.f) - Number(a.l.f) || a.d! - b.d!);
    return visibles.sort((a, b) => ordenOriginal.indexOf(a.s) - ordenOriginal.indexOf(b.s)).map((l) => ({ l, d: null as number | null }));
  };

  // Animación FLIP: la lista cambia al instante y cada tarjeta se desliza desde donde estaba.
  const deslizar = (cambio: () => void) => {
    const antes = new Map<string, DOMRect>();
    tarjetas.forEach((li, s) => { if (!li.hidden) antes.set(s, li.getBoundingClientRect()); });
    cambio();
    const alto = innerHeight;
    tarjetas.forEach((li, s) => {
      if (li.hidden) return;
      const d = li.getBoundingClientRect();
      if (d.bottom < -200 || d.top > alto + 200) return;
      const a = antes.get(s);
      const curva = 'cubic-bezier(0.16, 1, 0.3, 1)';
      if (a) {
        const dx = a.left - d.left, dy = a.top - d.top;
        if (dx || dy) li.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], { duration: 460, easing: curva });
      } else li.animate([{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], { duration: 380, easing: curva });
    });
  };

  const pintar = () => {
    const lang = idioma();
    const orden = ordenados();
    const visibles = new Set(orden.map((o) => o.l.s));
    const mover = () => {
      orden.forEach((o, i) => {
        const li = tarjetas.get(o.l.s)!;
        li.hidden = i >= limite;
        li.querySelector<HTMLElement>('[data-numero]')!.textContent = pos ? String(i + 1) : '';
        const d = li.querySelector<HTMLElement>('[data-distancia]')!;
        if (o.d !== null) { d.hidden = false; d.textContent = formatoDistancia(o.d, lang); } else d.hidden = true;
        lista.appendChild(li);
      });
      tarjetas.forEach((li, s) => { if (!visibles.has(s)) li.hidden = true; });
      vacio.hidden = orden.length > 0;
      const quedan = orden.length - limite;
      cajaMas.hidden = quedan <= 0;
      if (quedan > 0) botonMas.textContent = textos.mas[lang](quedan);
      lista.classList.add('listo');
    };
    if (reducido || primeraVez || vista !== 'lista') mover(); else deslizar(mover);
    primeraVez = false;

    if (pos) {
      const donde = pos.barrio ? barrios.find((b) => b.id === pos!.barrio)?.name ?? '' : textos.tuUbicacion[lang];
      estado.textContent = textos.cerca[lang](orden.length, donde);
      // El dato de la portada nombra el más cercano de verdad, aunque la lista ponga primero los que tienen fotos.
      const primero = orden.reduce<(typeof orden)[number] | null>((m, o) => (!m || o.d! < m.d! ? o : m), null);
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
      limite = POR_PAGINA;
      pintar();
    });
  });
  limpiar.forEach((b) => b.addEventListener('click', () => {
    Object.values(filtros).forEach((f) => f.clear());
    document.querySelectorAll('[data-filtro]').forEach((x) => x.setAttribute('aria-pressed', 'false'));
    limite = POR_PAGINA;
    pintar();
  }));

  const usarPos = (p: Pos | null) => { pos = p; limite = POR_PAGINA; guardarPosicion(p); pintar(); };
  botonMas.addEventListener('click', () => {
    const primeraNueva = limite;
    limite += POR_PAGINA;
    pintar();
    // El foco pasa a la primera tarjeta nueva para que el teclado siga donde iba.
    lista.querySelectorAll<HTMLElement>('.lugar:not([hidden]) a')[primeraNueva]?.focus({ preventScroll: true });
  });
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
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
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

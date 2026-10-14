// El juego de Cvander: 5 preguntas de un clic sacadas de un banco (distintas en cada partida),
// puntaje por lugar y un plan con dos alternativas.
import { intro, elegirTanda, opcionDe, temas, POR_PARTIDA, type Bi, type Tema, type Version } from '../lib/preguntas';
import { idioma, millas, formatoDistancia, leerPosicion, guardarPosicion, centroSF, type Lang, type Pos } from './comun';

type L = {
  s: string; n: string; h: string; r: string; adj: Bi; m: string[]; p: string; t: string[]; plato: Bi; nota: string;
  pr: number; lat: number; lng: number; maps: string; rv: number | null; img: string | null;
};

const comidas: Record<string, { en: string; es: string; m: boolean; razon: Bi }> = {
  breakfast: { en: 'breakfast', es: 'Desayuno', m: true, razon: { en: 'Breakfast spot', es: 'Para desayunar' } },
  brunch: { en: 'brunch', es: 'Brunch', m: true, razon: { en: 'Brunch spot', es: 'Para el brunch' } },
  lunch: { en: 'lunch', es: 'Almuerzo', m: true, razon: { en: 'Good for lunch', es: 'Para almorzar' } },
  dinner: { en: 'dinner', es: 'Cena', m: false, razon: { en: 'Good for dinner', es: 'Para cenar' } },
  'late-night': { en: 'late-night bite', es: 'Antojo nocturno', m: true, razon: { en: 'Open late', es: 'Abre tarde' } },
  coffee: { en: 'coffee', es: 'Café', m: true, razon: { en: 'Good coffee', es: 'Buen café' } },
  dessert: { en: 'dessert', es: 'Postre', m: true, razon: { en: 'For the sweet tooth', es: 'Para el antojo dulce' } },
};
const compania: Record<string, Bi> = {
  group: { en: 'Room for the crew', es: 'Cabe la chamusca' }, date: { en: 'Good for a date', es: 'Para una cita' },
  solo: { en: 'Easy to go solo', es: 'Bueno para ir solo' }, family: { en: 'Kid friendly', es: 'Va bien con niños' },
  meeting: { en: 'Works for a meeting', es: 'Sirve para una reunión' },
};
const bebidas: Record<string, Bi> = {
  beer: { en: 'Beer on hand', es: 'Hay chela' }, mezcal: { en: 'Mezcal list', es: 'Hay mezcal' }, sake: { en: 'Sake list', es: 'Hay sake' },
  wine: { en: 'Good wine', es: 'Buen vino' }, cocktails: { en: 'Cocktails', es: 'Hay tragos' }, coffee: { en: 'Good coffee', es: 'Buen café' },
};
// Respuesta de "cocina" -> región de la guía y nombre del viaje para las razones.
const viajes: Record<string, { region: string; destino: Bi; extra?: string[] }> = {
  japan: { region: 'japan', destino: { en: 'Japan', es: 'Japón' } },
  korea: { region: 'korea', destino: { en: 'Korea', es: 'Corea' } },
  china: { region: 'china', destino: { en: 'Taiwan and China', es: 'Taiwán y China' } },
  mexico: { region: 'latam', destino: { en: 'Mexico', es: 'México' }, extra: ['Mexican'] },
  guate: { region: 'latam', destino: { en: 'Central America', es: 'Centroamérica' }, extra: ['Guatemalan', 'Salvadoran'] },
  europe: { region: 'europe', destino: { en: 'Europe', es: 'Europa' } },
  seasia: { region: 'seasia', destino: { en: 'Burma', es: 'Birmania' } },
  mideast: { region: 'mideast', destino: { en: 'the Middle East', es: 'Medio Oriente' } },
  usa: { region: 'usa', destino: { en: 'California', es: 'California' } },
};
const textos = {
  cierre: { en: "Done. Here's where I'd go:", es: 'Listo. Yo iría aquí:' },
  etiqueta: { en: "Cvander's plan", es: 'El plan de Cvander' },
  hastaAhora: { en: 'Your plan so far:', es: 'Tu plan hasta ahora:' },
  comoLlegar: { en: 'Directions', es: 'Cómo llegar' },
  verLugar: { en: 'See the place', es: 'Ver el lugar' },
  paso: { en: (i: number) => `${i} of ${POR_PARTIDA}`, es: (i: number) => `${i} de ${POR_PARTIDA}` },
  lejos: { en: "You're far from SF, so I measured from the Mission.", es: 'Estás lejos de SF, así que medí desde la Mission.' },
  sinUbicacion: { en: 'No location, so I picked by taste, not distance.', es: 'Sin ubicación, elegí por gusto y no por distancia.' },
  nota: { en: 'Chris gave it', es: 'Chris le dio' },
  compartir: { en: 'My CookFoodie plan in San Francisco', es: 'Mi plan CookFoodie en San Francisco' },
};

const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);
// "coreana" -> "coreano", "japonesa" -> "japonés", "chapina" -> "chapín"; "de mariscos" queda igual.
const masculino = (adj: string) => adj.startsWith('de ') || adj.startsWith('del ') || adj.startsWith('estilo') ? adj : adj.split(' ').map((w) => {
  if (w === 'chapina') return 'chapín';
  if (w.endsWith('esa')) return w.slice(0, -3) + 'és';
  if (w.endsWith('ola')) return w.slice(0, -1);
  if (w.includes('-')) return w.split('-').map((x) => (x.endsWith('a') ? x.slice(0, -1) + 'o' : x)).join('-');
  if (w.endsWith('a') && !['y', 'omakase'].includes(w)) return w.slice(0, -1) + 'o';
  return w;
}).join(' ');

function puntuar(l: L, a: Record<string, string>, pos: Pos | null) {
  let s = l.pr * 0.4 + (l.rv ? 0.6 : 0);
  const tiene = (t: string) => l.t.includes(t);
  if (a.hora) s += l.m.includes(a.hora) ? 4 : (a.hora === 'late-night' && l.m.includes('dinner') && tiene('lively') ? 1.5 : -5);
  if (a.con) s += tiene(a.con) ? 2.2 : 0;
  if (a.energia) s += tiene(a.energia) ? 1.4 : 0;
  if (a.bebida && a.bebida !== 'none') s += tiene(a.bebida) ? (a.bebida === 'coffee' ? 3 : 2.2) : 0;
  if (a.cocina && a.cocina !== 'any') {
    const v = viajes[a.cocina];
    if (v?.region === l.r) s += 4 + (v.extra?.some((x) => l.adj.en.includes(x)) ? 2 : 0);
  }
  if (a.cocina === 'any') s += Math.random() * 1.8;
  if (a.compartir) s += tiene(a.compartir) ? 1.4 : 0;
  if (a.fila === 'line') s += tiene('line') ? 1.6 : 0;
  if (a.fila === 'reserve') s += tiene('reserve') ? 1.4 : tiene('line') ? -1 : 0;
  if (a.fila === 'noline') s += tiene('line') ? -2.5 : 0;
  const caro = l.p.length >= 3;
  if (a.estilo === 'fine') s += (tiene('fine') ? 2.2 : 0) + (caro ? 1 : 0);
  if (a.estilo === 'casual') s += (tiene('casual') ? 1.6 : 0) + (caro ? -1.2 : 0.6) + (tiene('fine') ? -1.5 : 0);
  if (a.estilo === 'mid') s += l.p === '$$' || l.p === '$$$' ? 1 : 0;
  if (a.picante === 'hot') s += tiene('spicy') ? 2 : 0;
  if (a.picante === 'mild') s += tiene('spicy') ? -1.2 : 0;
  // Sin la pregunta de distancia, si ya hay ubicación la cercanía pesa de forma moderada.
  if (pos && a.distancia !== 'far') {
    const d = millas(pos, l);
    s -= a.distancia === 'near' ? d * 3 + (d > 1.5 ? 4 : 0) : d * 0.7;
  }
  return s;
}

export function iniciarJuego() {
  const datos = JSON.parse(document.getElementById('datos-juego')!.textContent || '[]') as L[];
  const $ = <T extends HTMLElement>(s: string) => document.querySelector<T>(s)!;
  const elPregunta = $('[data-pregunta]');
  const elOpciones = $('[data-opciones]');
  const elDice = $('[data-dice]');
  const elParcial = $('[data-parcial]');
  const elAtras = $<HTMLButtonElement>('[data-atras]');
  const elResultado = $('[data-resultado]');
  const elPrincipal = $('[data-principal]');
  const elAlternas = $('[data-alternas]');
  const elCopiado = $('[data-copiado]');
  const elNum = $('[data-avance-num]');
  const pasos = [...document.querySelectorAll<HTMLElement>('.avance-paso')];
  const logo = document.querySelector<HTMLElement>('.anfitrion-logo');
  const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let tanda: { tema: Tema; version: Version }[] = elegirTanda();
  let i = -1;
  let respuestas: Record<string, string> = {};
  let pos: Pos | null = leerPosicion();
  let notaPos: 'lejos' | 'sinUbicacion' | null = null;
  let ocupado = false;
  const fin = () => i >= POR_PARTIDA;

  const animar = (el: HTMLElement, clase: string) => { el.classList.remove(clase); void el.offsetWidth; el.classList.add(clase); };
  const decir = (t: string) => { elDice.textContent = t; animar(elDice, 'nuevo'); if (logo) { logo.classList.add('habla'); setTimeout(() => logo.classList.remove('habla'), 500); } };
  const marcarAvance = () => {
    pasos.forEach((p, k) => { p.classList.toggle('hecho', fin() || k < Math.max(i, 0)); p.classList.toggle('actual', k === i); });
    elNum.textContent = i >= 0 && !fin() ? textos.paso[idioma()](i + 1) : '';
  };
  const planDe = (temaId: string) => {
    const id = respuestas[temaId];
    return id ? temas.find((t) => t.id === temaId)?.plan?.[id] : undefined;
  };

  const pintarParcial = () => {
    const lang = idioma();
    const partes: string[] = [];
    const h = respuestas.hora && opcionDe('hora', respuestas.hora); if (h) partes.push(h.t[lang]);
    const c = planDe('con'); if (c) partes.push(c[lang]);
    const b = planDe('bebida'); if (b) partes.push(b[lang]);
    const k = respuestas.cocina && respuestas.cocina !== 'any' && opcionDe('cocina', respuestas.cocina); if (k) partes.push(k.t[lang]);
    elParcial.hidden = partes.length === 0 || fin();
    elParcial.innerHTML = `${textos.hastaAhora[lang]} ${partes.map((p) => `<b>${p}</b>`).join(', ')}`;
  };

  const mostrarPregunta = () => {
    const lang = idioma();
    const { tema, version } = tanda[i];
    elResultado.hidden = true;
    elPregunta.textContent = version.q[lang];
    animar(elPregunta, 'nuevo');
    elOpciones.style.setProperty('--cols', String(version.columnas ?? 2));
    elOpciones.innerHTML = '';
    version.opciones.forEach((op, k) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'opcion' + (respuestas[tema.id] === op.id ? ' elegida' : '');
      b.style.setProperty('--i', String(k));
      b.textContent = op.t[lang];
      b.addEventListener('click', () => elegir(op.id, b));
      elOpciones.appendChild(b);
    });
    animar(elOpciones, 'entra');
    elOpciones.hidden = false;
    elAtras.hidden = i === 0;
    marcarAvance();
    pintarParcial();
    elPregunta.focus({ preventScroll: true });
  };

  const elegir = async (id: string, boton: HTMLButtonElement) => {
    if (ocupado) return;
    ocupado = true;
    const { tema, version } = tanda[i];
    respuestas[tema.id] = id;
    elOpciones.querySelectorAll('.opcion').forEach((x) => x.classList.toggle('elegida', x === boton));
    decir(version.opciones.find((op) => op.id === id)!.dice[idioma()]);
    pintarParcial();
    if (tema.id === 'distancia' && id !== 'far') await asegurarPosicion();
    setTimeout(() => {
      ocupado = false;
      i++;
      if (fin()) mostrarResultado(); else mostrarPregunta();
    }, reducido ? 150 : 750);
  };

  const asegurarPosicion = () => new Promise<void>((listo) => {
    if (pos) return listo();
    if (!('geolocation' in navigator)) { notaPos = 'sinUbicacion'; return listo(); }
    navigator.geolocation.getCurrentPosition(
      (g) => {
        const aqui = { lat: g.coords.latitude, lng: g.coords.longitude };
        if (millas(aqui, centroSF) > 40) { pos = { lat: 37.7615, lng: -122.4216, barrio: 'mission' }; notaPos = 'lejos'; }
        else { pos = aqui; guardarPosicion(aqui); }
        listo();
      },
      () => { notaPos = 'sinUbicacion'; listo(); },
      { timeout: 10000, maximumAge: 300000 },
    );
  });

  const razones = (l: L, lang: Lang, d: number | null) => {
    const r: string[] = [];
    if (d !== null) r.push(formatoDistancia(d, lang));
    if (l.rv) r.push(`${textos.nota[lang]} ${l.rv}/5`);
    const v = respuestas.cocina ? viajes[respuestas.cocina] : undefined;
    if (v && v.region === l.r && respuestas.cocina !== 'usa') {
      r.push(lang === 'es' ? `Un viaje a ${v.destino.es} sin salir de SF` : `A trip to ${v.destino.en} without leaving SF`);
    }
    if (respuestas.con && l.t.includes(respuestas.con)) r.push(compania[respuestas.con][lang]);
    if (respuestas.bebida && l.t.includes(respuestas.bebida) && bebidas[respuestas.bebida]) r.push(bebidas[respuestas.bebida][lang]);
    if (respuestas.hora && l.m.includes(respuestas.hora)) r.push(comidas[respuestas.hora].razon[lang]);
    if (respuestas.fila === 'line' && l.t.includes('line')) r.push(lang === 'es' ? 'La fila vale la pena' : 'Worth the line');
    if (respuestas.fila === 'reserve' && l.t.includes('reserve')) r.push(lang === 'es' ? 'Se reserva' : 'Takes reservations');
    if (respuestas.picante === 'hot' && l.t.includes('spicy')) r.push(lang === 'es' ? 'Pica de verdad' : 'Brings the heat');
    return r.slice(0, 5);
  };

  const titulo = (l: L, lang: Lang) => {
    const comida = l.m.includes(respuestas.hora) ? respuestas.hora : l.m[0];
    const c = comidas[comida] ?? comidas.dinner;
    if (comida === 'coffee') return lang === 'es' ? `Un café en ${l.h}` : `Coffee in ${l.h}`;
    if (comida === 'dessert') return lang === 'es' ? `Algo dulce en ${l.h}` : `Something sweet in ${l.h}`;
    if (lang === 'es') return `${c.es} ${c.m ? masculino(l.adj.es) : l.adj.es}`;
    return `${cap(l.adj.en)} ${c.en}`;
  };

  const subtitulo = (l: L, lang: Lang) => {
    const extras = [planDe('con')?.[lang], planDe('bebida')?.[lang]].filter(Boolean);
    return cap([l.plato[lang], ...extras].join(', ')) + '.';
  };

  const escapar = (t: string) => t.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

  const mostrarResultado = () => {
    const lang = idioma();
    i = POR_PARTIDA;
    marcarAvance();
    elOpciones.hidden = true;
    elParcial.hidden = true;
    elAtras.hidden = false;
    elPregunta.textContent = textos.cierre[lang];
    animar(elPregunta, 'nuevo');
    decir(notaPos ? textos[notaPos][lang] : (lang === 'es' ? 'Confía en mí.' : 'Trust me.'));

    const ranking = datos.map((l) => ({ l, s: puntuar(l, respuestas, pos) })).sort((a, b) => b.s - a.s);
    const [uno, ...resto] = ranking.map((x) => x.l);
    // Dos alternativas: la mejor de otra cocina y la siguiente mejor, sea cual sea.
    const otra = resto.find((l) => l.r !== uno.r);
    const alternas = [otra, ...resto.filter((l) => l !== otra)].filter(Boolean).slice(0, 2) as L[];
    const dist = (l: L) => (pos ? millas(pos, l) : null);

    const d1 = dist(uno);
    elPrincipal.innerHTML = `
      <article class="plan-tarjeta">
        <div class="plan-cara ${uno.img ? '' : 'sin-foto'}">
          ${uno.img ? `<img src="${uno.img}" alt="${escapar(uno.n)}" />` : `<p lang="en">“${escapar(uno.nota)}”</p>`}
        </div>
        <div class="plan-info">
          <p class="plan-etiqueta">${textos.etiqueta[lang]}</p>
          <h2 class="plan-titulo">${escapar(titulo(uno, lang))}</h2>
          <p class="plan-plato">${escapar(subtitulo(uno, lang))}</p>
          <div class="plan-lugar"><strong>${escapar(uno.n)}</strong><span>${escapar(uno.h)}${d1 !== null ? `, ${formatoDistancia(d1, lang, true)}` : ''}</span></div>
          ${uno.img ? `<p class="plan-nota" lang="en">“${escapar(uno.nota)}”</p>` : ''}
          <ul class="plan-razones">${razones(uno, lang, d1).map((r) => `<li>${escapar(r)}</li>`).join('')}</ul>
          <div class="plan-botones">
            <a class="boton" href="${uno.maps}" rel="noopener">${textos.comoLlegar[lang]}</a>
            <a class="boton borde" href="/places/${uno.s}">${textos.verLugar[lang]}</a>
          </div>
        </div>
      </article>`;
    elAlternas.innerHTML = alternas.map((l) => {
      const d = dist(l);
      return `<li><a href="/places/${l.s}"><strong>${escapar(l.n)}</strong><span>${escapar(titulo(l, lang))}, ${escapar(l.h)}${d !== null ? `, ${formatoDistancia(d, lang, true)}` : ''}</span><span lang="en">“${escapar(l.nota)}”</span></a></li>`;
    }).join('');
    elResultado.hidden = false;
    elCopiado.hidden = true;
    // El link compartible guarda las respuestas por tema: ?a=hora:dinner.cocina:korea...
    const codigo = Object.entries(respuestas).map(([t, v]) => `${t}:${v}`).join('.');
    history.replaceState(null, '', `?a=${codigo}`);
    if (!reducido) elResultado.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const empezar = () => {
    tanda = elegirTanda();
    i = 0; respuestas = {}; notaPos = null;
    decir(idioma() === 'es' ? 'Vamos.' : "Let's go.");
    mostrarPregunta();
  };
  $('[data-empezar]').addEventListener('click', empezar);
  elAtras.addEventListener('click', () => {
    if (i <= 0) return;
    i = Math.min(i, POR_PARTIDA) - 1;
    history.replaceState(null, '', location.pathname);
    mostrarPregunta();
  });
  $('[data-otra]').addEventListener('click', () => { history.replaceState(null, '', location.pathname); empezar(); window.scrollTo({ top: 0, behavior: reducido ? 'auto' : 'smooth' }); });
  $('[data-compartir]').addEventListener('click', async () => {
    const url = location.href;
    const nav = navigator as Navigator & { share?: (d: ShareData) => Promise<void> };
    if (nav.share) { try { await nav.share({ title: textos.compartir[idioma()], url }); return; } catch { /* cancelado */ } }
    try { await navigator.clipboard.writeText(url); elCopiado.hidden = false; } catch { prompt('', url); }
  });

  // Un plan compartido llega como ?a=hora:dinner.cocina:korea... y se muestra directo.
  const a = new URLSearchParams(location.search).get('a');
  if (a) {
    a.split('.').forEach((par) => { const [t, v] = par.split(':'); if (t && v && opcionDe(t, v)) respuestas[t] = v; });
    if (Object.keys(respuestas).length >= 2) mostrarResultado();
  }

  document.addEventListener('cf:lang', () => {
    if (i >= 0 && !fin()) mostrarPregunta();
    else if (fin()) mostrarResultado();
    else elPregunta.textContent = intro[idioma()];
  });
  marcarAvance();
}

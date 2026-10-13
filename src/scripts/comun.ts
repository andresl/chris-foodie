// Utilidades compartidas: idioma activo, distancia y la posición guardada en la sesión.
export type Lang = 'en' | 'es';
export type Pos = { lat: number; lng: number; barrio?: string };

export const centroSF = { lat: 37.7749, lng: -122.4194 };
export const idioma = (): Lang => (document.documentElement.dataset.lang === 'es' ? 'es' : 'en');

const rad = (x: number) => (x * Math.PI) / 180;
export const millas = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) => {
  const d = Math.sin(rad(b.lat - a.lat) / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(rad(b.lng - a.lng) / 2) ** 2;
  return 3958.8 * 2 * Math.asin(Math.sqrt(d));
};

// A pie a 3 mph (20 min por milla). Hasta milla y media se dice en minutos; después, en millas.
export const formatoDistancia = (mi: number, lang: Lang, frase = false, soloMillas = false) => {
  const num = new Intl.NumberFormat(lang === 'es' ? 'es' : 'en-US', { maximumFractionDigits: mi < 10 ? 1 : 0 });
  const millasTxt = `${num.format(mi)} mi`;
  if (soloMillas || mi > 1.5) return frase && lang === 'es' ? `a ${millasTxt}` : millasTxt;
  const min = Math.max(1, Math.round(mi * 20));
  if (lang === 'es') return frase ? `a ${min} min a pie` : `${min} min a pie`;
  return frase ? `a ${min}-min walk` : `${min} min walk`;
};

export const leerPosicion = (): Pos | null => {
  try { const t = sessionStorage.getItem('cf-pos'); return t ? (JSON.parse(t) as Pos) : null; } catch { return null; }
};
export const guardarPosicion = (p: Pos | null) => {
  try { p ? sessionStorage.setItem('cf-pos', JSON.stringify(p)) : sessionStorage.removeItem('cf-pos'); } catch {}
};

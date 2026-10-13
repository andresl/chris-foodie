import lugaresJson from '../data/lugares.json';
import regionesJson from '../data/regiones.json';

export type Bi = { en: string; es: string };
export type Lugar = (typeof lugaresJson)[number];
export const lugares = lugaresJson as Lugar[];
export const regiones = regionesJson as Record<string, Bi & { color: string }>;

export const comidas: Record<string, Bi> = {
  breakfast: { en: 'Breakfast', es: 'Desayuno' },
  brunch: { en: 'Brunch', es: 'Brunch' },
  lunch: { en: 'Lunch', es: 'Almuerzo' },
  dinner: { en: 'Dinner', es: 'Cena' },
  'late-night': { en: 'Late night', es: 'Tarde en la noche' },
  coffee: { en: 'Coffee', es: 'Café' },
  dessert: { en: 'Dessert', es: 'Postre' },
};

// Etiquetas que se ven en la tarjeta (las demás solo sirven al juego).
export const insignias: Record<string, Bi & { icono: string }> = {
  line: { en: 'Expect a line', es: 'Hay fila', icono: 'fila' },
  reserve: { en: 'Book ahead', es: 'Reserva', icono: 'calendario' },
  cash: { en: 'Cash only', es: 'Solo efectivo', icono: 'efectivo' },
};

// Puntos para "estoy en..." cuando no hay ubicación o la persona está lejos de SF.
export const barrios: { id: string; name: string; lat: number; lng: number }[] = [
  { id: 'mission', name: 'Mission', lat: 37.7615, lng: -122.4216 },
  { id: 'noe', name: 'Noe Valley', lat: 37.7515, lng: -122.4339 },
  { id: 'chinatown', name: 'Chinatown', lat: 37.7941, lng: -122.4078 },
  { id: 'northbeach', name: 'North Beach', lat: 37.8003, lng: -122.41 },
  { id: 'union', name: 'Union Square', lat: 37.788, lng: -122.4075 },
  { id: 'ferry', name: 'Ferry Building', lat: 37.7955, lng: -122.3937 },
  { id: 'soma', name: 'SoMa', lat: 37.7785, lng: -122.4056 },
  { id: 'hayes', name: 'Hayes Valley', lat: 37.7765, lng: -122.4243 },
  { id: 'japantown', name: 'Japantown', lat: 37.7852, lng: -122.43 },
  { id: 'nopa', name: 'NoPa', lat: 37.776, lng: -122.438 },
  { id: 'castro', name: 'Castro', lat: 37.7609, lng: -122.435 },
  { id: 'potrero', name: 'Potrero Hill', lat: 37.7616, lng: -122.4004 },
  { id: 'dogpatch', name: 'Dogpatch', lat: 37.758, lng: -122.388 },
  { id: 'richmond', name: 'Inner Richmond', lat: 37.783, lng: -122.4645 },
  { id: 'sunset', name: 'Inner Sunset', lat: 37.764, lng: -122.466 },
];

// Primera oración de la nota de Christian, para la tarjeta.
export const primeraFrase = (t: string, max = 150) => {
  const limpio = t.replace(/\s+/g, ' ').trim();
  const m = limpio.match(/^(.{20,}?[.!?])(\s|$)/);
  const f = m ? m[1] : limpio;
  return f.length > max ? f.slice(0, max).replace(/\s+\S*$/, '') + '…' : f;
};

export const vecinos = (l: Lugar) => l.nearby.map((n) => ({ ...n, lugar: lugares.find((o) => o.slug === n.slug)! }));

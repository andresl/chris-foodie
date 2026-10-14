// Banco de preguntas de Cvander (Christian) para "Arma tu plan". Cada partida usa 5:
// siempre una de "hora" y una de "cocina", más 3 temas al azar; cada tema tiene varias versiones.
// Los temas salen de lo que Christian publica en X y en sus reseñas: fútbol, chelas y mezcal, ramen
// compartido, layovers, agentes de IA, keynotes, inversión, Waymo, Guatemala.
export type Bi = { en: string; es: string };
export type Opcion = { id: string; t: Bi; dice: Bi };
export type Version = { q: Bi; opciones: Opcion[]; columnas?: 1 | 2 };
export type Tema = { id: string; fijo?: boolean; versiones: Version[]; plan?: Record<string, Bi> };

export const POR_PARTIDA = 5;

export const intro: Bi = {
  en: "Cvander here. Five questions, just taps, a different set every time. I'll tell you where I'd eat in San Francisco and what I'd order.",
  es: 'Soy Cvander. Cinco preguntas, puro clic, y cada vez te toca una tanda distinta. Te digo dónde comería yo en San Francisco y qué pediría.',
};

const o = (id: string, en: string, es: string, dEn: string, dEs: string): Opcion => ({ id, t: { en, es }, dice: { en: dEn, es: dEs } });

export const temas: Tema[] = [
  {
    id: 'hora',
    fijo: true,
    versiones: [
      {
        q: { en: 'First things first: what time is it in your stomach?', es: 'Primero lo primero: ¿qué hora es en tu estómago?' },
        opciones: [
          o('breakfast', 'Breakfast', 'Desayuno', 'Good call. Coffee first, decisions later.', 'Buena. Primero café, después decisiones.'),
          o('brunch', 'Weekend brunch', 'Brunch de fin de semana', 'Heads up: brunch in SF comes with a line.', 'Ojo: en SF el brunch viene con fila.'),
          o('lunch', 'Lunch', 'Almuerzo', 'A real lunch. No sad desk salad.', 'Almuerzo de verdad. Nada de ensaladita triste.'),
          o('dinner', 'Dinner', 'Cena', 'The night is young.', 'La noche es joven.'),
          o('late-night', "It's late and I'm starving", 'Ya es tarde y me muero de hambre', 'Got it. Trompo mode.', 'Entendido. Modo trompo.'),
          o('coffee', 'Just coffee', 'Solo un café', 'Coffee and a laptop. Peak SF.', 'Café y laptop. Muy de SF.'),
        ],
      },
      {
        q: { en: 'When does the craving hit?', es: '¿A qué hora te agarra el antojo?' },
        opciones: [
          o('breakfast', 'Before the first meeting', 'Antes de la primera reunión', 'Breakfast it is.', 'Desayuno, entonces.'),
          o('brunch', 'Saturday, no alarm', 'Sábado, sin alarma', 'Brunch. Bring patience.', 'Brunch. Trae paciencia.'),
          o('lunch', 'Between two calls', 'Entre dos llamadas', 'Fast and good. Doable.', 'Rápido y rico. Se puede.'),
          o('dinner', 'When the laptop closes', 'Cuando se cierra la laptop', 'Dinner. You earned it.', 'Cena. Te la ganaste.'),
          o('late-night', 'After midnight', 'Después de medianoche', 'Pastor time.', 'Hora del pastor.'),
          o('dessert', 'Right after dinner', 'Justo después de cenar', 'Dessert has its own stomach.', 'El postre tiene su propio estómago.'),
        ],
      },
    ],
  },
  {
    id: 'cocina',
    fijo: true,
    versiones: [
      {
        q: { en: 'Six-hour layover. Where do you get off to eat?', es: 'Layover de seis horas. ¿Dónde te bajas a comer?' },
        opciones: [
          o('japan', 'Tokyo', 'Tokio', 'Izakaya or ramen. We will see.', 'Izakaya o ramen. Ya veremos.'),
          o('korea', 'Seoul', 'Seúl', 'Charcoal and banchan.', 'Carbón y banchan.'),
          o('china', 'Taipei', 'Taipéi', 'Dumplings incoming.', 'Vienen dumplings.'),
          o('mexico', 'Mexico City', 'Ciudad de México', 'Trompo or nothing.', 'Trompo o nada.'),
          o('guate', 'Guatemala City', 'Ciudad de Guatemala', 'Now we are talking. Something from home.', '¡Qué chilero! Algo de la casa.'),
          o('europe', 'Madrid', 'Madrid', 'Tortilla, jamón and vermut.', 'Tortilla, jamón y vermut.'),
          o('seasia', 'Yangon', 'Rangún', 'Fermented tea leaves. Trust me.', 'Hoja de té fermentada. Trust me.'),
          o('any', 'Surprise me', 'Sorpréndeme', 'I like that attitude.', 'Me gusta esa actitud.'),
        ],
      },
      {
        q: { en: 'Your agent can book a table in any city tonight. Which one?', es: 'Tu agente puede reservarte mesa en cualquier ciudad esta noche. ¿Cuál?' },
        opciones: [
          o('japan', 'Tokyo', 'Tokio', 'Good prompt.', 'Buen prompt.'),
          o('korea', 'Seoul', 'Seúl', 'Booked. Bring friends.', 'Reservado. Lleva amigos.'),
          o('china', 'Taipei', 'Taipéi', 'Xiaolongbao confirmed.', 'Xiaolongbao confirmado.'),
          o('mexico', 'Mexico City', 'Ciudad de México', 'Mezcal included in the prompt.', 'Mezcal incluido en el prompt.'),
          o('europe', 'Paris', 'París', 'Bread, wine, bistro. Done.', 'Pan, vino y bistró. Listo.'),
          o('mideast', 'Istanbul', 'Estambul', 'Meze for the table.', 'Meze para la mesa.'),
          o('usa', 'San Francisco, obviously', 'San Francisco, obvio', 'Local loyalty. Respect.', 'Lealtad local. Respeto.'),
          o('any', 'Let the agent decide', 'Que decida el agente', 'Full autonomy. Brave.', 'Autonomía total. Valiente.'),
        ],
      },
      {
        q: { en: 'World Cup. Who are you rooting for?', es: 'Mundial. ¿A qué selección le vas?' },
        opciones: [
          o('mexico', 'Mexico', 'México', 'Tacos for the halftime show.', 'Tacos para el medio tiempo.'),
          o('japan', 'Japan', 'Japón', 'Clean game, clean broth.', 'Juego limpio, caldo limpio.'),
          o('korea', 'South Korea', 'Corea del Sur', 'BBQ to celebrate.', 'Carne asada para celebrar.'),
          o('europe', 'Spain', 'España', 'Tapas between goals.', 'Tapas entre goles.'),
          o('guate', 'Guatemala, someday', 'Guate, algún día', 'Someday. Pupusas meanwhile.', 'Algún día. Mientras, pupusas.'),
          o('mideast', 'Türkiye', 'Turquía', 'Kebabs on the couch.', 'Kebab en el sillón.'),
          o('usa', 'USA, I live here', 'Estados Unidos, vivo aquí', 'Burger and a game. Classic.', 'Hamburguesa y partido. Clásico.'),
          o('any', 'I came for the beer', 'Vine por las chelas', 'Honest answer.', 'Respuesta honesta.'),
        ],
      },
    ],
  },
  {
    id: 'con',
    plan: {
      group: { en: 'for the crew', es: 'para la chamusca' }, date: { en: 'for two', es: 'para dos' },
      solo: { en: 'solo', es: 'en solitario' }, family: { en: 'with the family', es: 'en familia' },
      meeting: { en: 'with a deck in your bag', es: 'con el pitch en la mochila' },
    },
    versiones: [
      {
        q: { en: "Who's coming?", es: '¿Con quién vas?' },
        opciones: [
          o('group', 'The whole crew', 'La chamusca completa', 'Big table, everything to share.', 'Mesa grande y todo al centro.'),
          o('date', 'A date', 'Una cita', "Relax, I'll find something nice.", 'Tranqui, te consigo algo bonito.'),
          o('solo', 'Just me', 'Solo yo', 'Best company there is.', 'La mejor compañía.'),
          o('family', 'Family and kids', 'Familia y niños', 'No three-hour tasting menus.', 'Nada de menús de tres horas.'),
          o('meeting', 'Meeting an investor', 'Reunión con un inversionista', 'I know a café full of VCs.', 'Conozco un café lleno de VCs.'),
        ],
      },
      {
        q: { en: 'How many at the table?', es: '¿Cuántos van a la mesa?' },
        opciones: [
          o('solo', 'One. Counter seat', 'Uno. Silla en la barra', 'Counter seats are underrated.', 'La barra está subestimada.'),
          o('date', 'Two', 'Dos', 'Candles optional.', 'Velas opcionales.'),
          o('group', 'Five or more', 'Cinco o más', 'Round table, please.', 'Mesa redonda, por favor.'),
          o('family', 'Two adults and kids', 'Dos adultos y niños', 'Kid friendly, noted.', 'Apto para niños, anotado.'),
          o('meeting', 'Me and a founder', 'Yo y un founder', 'Pitch over coffee. Classic.', 'Pitch con café. Clásico.'),
        ],
      },
    ],
  },
  {
    id: 'energia',
    versiones: [
      {
        q: { en: "What's the energy today?", es: '¿Qué energía traes hoy?' },
        opciones: [
          o('lively', 'World Cup final', 'Final del Mundial', 'Goal! Noise, toasts, people.', '¡Gol! Ruido, brindis y gente.'),
          o('calm', 'MLS game on a Tuesday', 'Partido de MLS un martes', 'Chill. You can hear each other.', 'Tranqui. Se oye la conversación.'),
        ],
      },
      {
        q: { en: 'Pick the playlist.', es: 'Elige la playlist.' },
        opciones: [
          o('lively', 'Bad Bunny, full volume', 'Bad Bunny a todo volumen', 'Loud place, loud food.', 'Lugar ruidoso, comida con ganas.'),
          o('calm', 'Lo-fi for coding', 'Lo-fi para programar', 'Quiet corner it is.', 'Un rincón tranquilo, entonces.'),
        ],
      },
    ],
  },
  {
    id: 'bebida',
    plan: {
      beer: { en: 'with a beer', es: 'con chela' }, mezcal: { en: 'with mezcal', es: 'con mezcal' }, sake: { en: 'with sake', es: 'con sake' },
      wine: { en: 'with natural wine', es: 'con vino natural' }, cocktails: { en: 'with cocktails', es: 'con tragos' }, coffee: { en: 'with coffee', es: 'con café' },
    },
    versiones: [
      {
        q: { en: 'What are we drinking?', es: '¿Con qué brindamos?' },
        opciones: [
          o('beer', 'A beer', 'Una chela', 'A beer. No peer pressure.', 'Una chela, sin presión social.'),
          o('mezcal', 'Mezcal', 'Mezcal', 'Smoky, with orange. I like you.', 'Ahumado y con naranja. Me caes bien.'),
          o('sake', 'Sake', 'Sake', 'Kanpai.', 'Kanpai.'),
          o('wine', 'Natural wine', 'Vino natural', 'Order a chato and trust the list.', 'Pide un chato y confía.'),
          o('coffee', 'Coffee, I have work', 'Café, hay que trabajar', 'Let an LLM write the code. You drink the coffee.', 'Que el código lo escriba un LLM. Tú tómate el café.'),
          o('none', "Water's fine", 'Agua, gracias', 'Respect.', 'Respeto.'),
        ],
      },
      {
        q: { en: 'Friday, 6 pm in SF. What are you ordering?', es: 'Viernes, 6 pm en SF. ¿Qué pides?' },
        opciones: [
          o('beer', 'A cold one', 'Una bien fría', 'Cheers.', 'Salud.'),
          o('cocktails', 'Something with nice ice', 'Algo con hielo bonito', 'Cocktail bar energy.', 'Energía de bar de cocteles.'),
          o('mezcal', 'Mezcal with orange', 'Mezcal con naranja', 'Smoky Friday.', 'Viernes ahumado.'),
          o('wine', 'A glass of natural wine', 'Una copa de vino natural', 'Ask what is open today.', 'Pregunta qué abrieron hoy.'),
          o('sake', 'Cold sake', 'Sake frío', 'Izakaya hours.', 'Hora de izakaya.'),
          o('none', 'Sparkling water, early flight', 'Agua con gas, vuelo temprano', 'Responsible. Noted.', 'Responsable. Anotado.'),
        ],
      },
    ],
  },
  {
    id: 'compartir',
    versiones: [
      {
        q: { en: 'Shared ramen or a burrito all to yourself?', es: '¿Ramen compartido o burrito para ti solo?' },
        columnas: 1,
        opciones: [
          o('share', 'Everything in the middle', 'Todo al centro', "That's how you eat with friends.", 'Así se come con amigos.'),
          o('personal', 'Mine is mine', 'Lo mío es mío', 'Burrito supreme, no sharing.', 'Burrito supreme, sin compartir.'),
        ],
      },
      {
        q: { en: 'Do you let your agent order for the whole table?', es: '¿Dejas que tu agente pida para toda la mesa?' },
        columnas: 1,
        opciones: [
          o('share', 'Yes, a bit of everything', 'Sí, que pida de todo', 'Agentic dining. I love it.', 'Comida agéntica. Me encanta.'),
          o('personal', 'No, I order my own', 'No, yo pido lo mío', 'Human in the loop.', 'Humano en el loop.'),
        ],
      },
    ],
  },
  {
    id: 'fila',
    versiones: [
      {
        q: { en: "Would you wait an hour in line for SF's best?", es: '¿Harías una hora de fila por lo mejor de SF?' },
        columnas: 1,
        opciones: [
          o('line', "Yes. Trust me, it's worth it", 'Sí. Trust me, vale la pena', 'A person of culture.', 'Una persona de cultura.'),
          o('reserve', 'Only if I can book', 'Solo si puedo reservar', 'Open Resy right now.', 'Abre Resy desde ya.'),
          o('noline', 'No way, I want in now', 'Ni loco, quiero entrar ya', 'Zero line. Noted.', 'Cero fila. Anotado.'),
        ],
      },
      {
        q: { en: 'The app says a 45-minute wait. What do you do?', es: 'La app dice 45 minutos de espera. ¿Qué haces?' },
        columnas: 1,
        opciones: [
          o('line', 'I wait. Good things take time', 'Me formo. Lo bueno tarda', 'Patience pays here.', 'Aquí la paciencia paga.'),
          o('reserve', 'I book for another day', 'Reservo para otro día', 'Planner. I respect it.', 'Planificador. Lo respeto.'),
          o('noline', 'I go somewhere else', 'Me voy a otro lado', 'Plan B, no line.', 'Plan B, sin fila.'),
        ],
      },
    ],
  },
  {
    id: 'estilo',
    versiones: [
      {
        q: { en: 'Steve Jobs keynote or a garage in a hoodie?', es: '¿Keynote de Steve Jobs o garaje con hoodie?' },
        columnas: 1,
        opciones: [
          o('fine', 'Keynote: tablecloth and a show', 'Keynote: mantel y show', 'One more thing: book ahead.', 'One more thing: reservá con tiempo.'),
          o('mid', 'Somewhere in between', 'Algo en medio', 'No tablecloth, no plastic. Perfect.', 'Ni mantel ni plástico. Perfecto.'),
          o('casual', 'Garage: plastic table, big flavor', 'Garaje: mesa de plástico y sabor', "Some of SF's best comes with paper napkins.", 'Lo mejor de SF a veces trae servilleta de papel.'),
        ],
      },
      {
        q: { en: 'Whose budget is this dinner on?', es: '¿Con qué presupuesto va esta comida?' },
        columnas: 1,
        opciones: [
          o('fine', 'The fund is paying', 'Invita el fondo', 'Tasting menu unlocked.', 'Menú de degustación desbloqueado.'),
          o('mid', 'Series A, behave', 'Serie A, con juicio', 'Good, not crazy.', 'Bueno, sin locuras.'),
          o('casual', 'Seed stage, whatever fits', 'Etapa semilla, lo que alcance', 'Cheap and legit. My favorite kind.', 'Barato y legit. Mi tipo favorito.'),
        ],
      },
    ],
  },
  {
    id: 'picante',
    versiones: [
      {
        q: { en: 'How much heat can you take?', es: '¿Cuánto picante aguantas?' },
        columnas: 1,
        opciones: [
          o('hot', 'Make me cry', 'Que me haga llorar', 'Sichuan level unlocked.', 'Nivel Sichuan desbloqueado.'),
          o('some', 'A little, on the side', 'Un poquito, aparte', 'As it should be.', 'Como debe ser.'),
          o('mild', 'None, thanks', 'Nada, gracias', 'No scares tonight.', 'Nada de sustos.'),
        ],
      },
      {
        q: { en: 'Red salsa or green salsa?', es: '¿Salsa roja o salsa verde?' },
        columnas: 1,
        opciones: [
          o('hot', 'The red one that really burns', 'La roja que pica de verdad', 'Brave. Water nearby.', 'Valiente. Agua cerca.'),
          o('some', 'Green, easy', 'La verde, tranqui', 'Balanced.', 'Equilibrado.'),
          o('mild', 'No salsa', 'Sin salsa', 'Purist.', 'Purista.'),
        ],
      },
    ],
  },
  {
    id: 'distancia',
    versiones: [
      {
        q: { en: 'How far will you go?', es: '¿Cuánto te mueves?' },
        columnas: 1,
        opciones: [
          o('near', "Whatever's around the corner", 'Lo que esté a la vuelta', 'Let me see where you are.', 'Déjame ver dónde estás.'),
          o('muni', "I'll take Muni or a Waymo", 'Agarro un Muni o un Waymo', "The Waymo won't judge your cravings.", 'El Waymo no juzga tus antojos.'),
          o('far', "I'll cross the city for it", 'Cruzo la ciudad por algo bueno', "That's the spirit.", 'Así se habla.'),
        ],
      },
      {
        q: { en: 'How are you getting there?', es: '¿Cómo llegas?' },
        columnas: 1,
        opciones: [
          o('near', 'Walking', 'Caminando', 'Good shoes, short walk.', 'Buenos zapatos, poca caminata.'),
          o('muni', 'Waymo', 'Waymo', 'Driverless to dinner. Very SF.', 'Sin chofer a cenar. Muy SF.'),
          o('far', 'Whatever it takes', 'Como sea, voy por la comida', 'Food first.', 'Primero la comida.'),
        ],
      },
    ],
  },
];

// Arma una partida: los temas fijos primero y luego los demás al azar, cada uno con una versión al azar.
export function elegirTanda(azar: () => number = Math.random) {
  const barajar = <T,>(a: T[]) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(azar() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const fijos = temas.filter((t) => t.fijo);
  const resto = barajar(temas.filter((t) => !t.fijo)).slice(0, POR_PARTIDA - fijos.length);
  return [...fijos, ...resto].map((t) => ({ tema: t, version: t.versiones[Math.floor(azar() * t.versiones.length)] }));
}

export const opcionDe = (temaId: string, opcionId: string) => {
  const t = temas.find((x) => x.id === temaId);
  for (const v of t?.versiones ?? []) { const x = v.opciones.find((op) => op.id === opcionId); if (x) return x; }
  return undefined;
};

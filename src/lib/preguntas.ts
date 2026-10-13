// Las diez preguntas de Cvander (Christian) en el juego. Salen de los temas que Christian toca en X y en sus reseñas:
// fútbol, chelas y mezcal, ramen compartido, layovers, keynotes, Waymo, Guatemala.
// Cada opción suma puntos a los lugares (ver puntuar en scripts/juego.ts) y deja un comentario del agente.
export type Bi = { en: string; es: string };
export type Opcion = { id: string; t: Bi; dice: Bi; plan?: Bi };
export type Pregunta = { id: string; q: Bi; opciones: Opcion[]; columnas?: 1 | 2 | 3 };

export const intro: Bi = {
  en: "Cvander here. Ten questions, just taps, and I'll tell you where I'd eat in San Francisco and what I'd order.",
  es: 'Soy Cvander. Diez preguntas, puro clic, y te digo dónde comería yo en San Francisco y qué pediría.',
};

export const preguntas: Pregunta[] = [
  {
    id: 'hora',
    q: { en: 'First things first: what time is it in your stomach?', es: 'Primero lo primero: ¿qué hora es en tu estómago?' },
    columnas: 2,
    opciones: [
      { id: 'breakfast', t: { en: 'Breakfast', es: 'Desayuno' }, dice: { en: 'Good call. Coffee first, decisions later.', es: 'Buena. Primero café, después decisiones.' } },
      { id: 'brunch', t: { en: 'Weekend brunch', es: 'Brunch de fin de semana' }, dice: { en: 'Heads up: brunch in SF comes with a line.', es: 'Ojo: en SF el brunch viene con fila.' } },
      { id: 'lunch', t: { en: 'Lunch', es: 'Almuerzo' }, dice: { en: 'A real lunch. No sad desk salad.', es: 'Almuerzo de verdad. Nada de ensaladita triste.' } },
      { id: 'dinner', t: { en: 'Dinner', es: 'Cena' }, dice: { en: 'The night is young.', es: 'La noche es joven.' } },
      { id: 'late-night', t: { en: "It's late and I'm starving", es: 'Ya es tarde y me muero de hambre' }, dice: { en: 'Got it. Trompo mode.', es: 'Entendido. Modo trompo.' } },
      { id: 'coffee', t: { en: 'Just coffee', es: 'Solo un café' }, dice: { en: 'Coffee and a laptop. Peak SF.', es: 'Café y laptop. Muy de SF.' } },
      { id: 'dessert', t: { en: 'Something sweet', es: 'Algo dulce' }, dice: { en: 'Respect. Dessert is a meal.', es: 'Respeto. El postre también es comida.' } },
    ],
  },
  {
    id: 'con',
    q: { en: "Who's coming?", es: '¿Con quién vas?' },
    columnas: 2,
    opciones: [
      { id: 'group', t: { en: 'The whole crew', es: 'La chamusca completa' }, dice: { en: 'Big table, everything to share.', es: 'Mesa grande y todo al centro.' }, plan: { en: 'for the crew', es: 'para la chamusca' } },
      { id: 'date', t: { en: 'A date', es: 'Una cita' }, dice: { en: "Relax, I'll find something nice.", es: 'Tranqui, te consigo algo bonito.' }, plan: { en: 'for two', es: 'para dos' } },
      { id: 'solo', t: { en: 'Just me', es: 'Solo yo' }, dice: { en: 'Best company there is. Grab a counter seat.', es: 'La mejor compañía. Barra y listo.' }, plan: { en: 'solo', es: 'en solitario' } },
      { id: 'family', t: { en: 'Family and kids', es: 'Familia y niños' }, dice: { en: 'No three-hour tasting menus, promise.', es: 'Nada de menús de tres horas, prometido.' }, plan: { en: 'with the family', es: 'en familia' } },
      { id: 'meeting', t: { en: 'Meeting an investor', es: 'Reunión con un inversionista' }, dice: { en: 'I know a café full of VCs.', es: 'Conozco un café lleno de VCs.' }, plan: { en: 'with a deck in your bag', es: 'con el pitch en la mochila' } },
    ],
  },
  {
    id: 'energia',
    q: { en: "What's the energy today?", es: '¿Qué energía traes hoy?' },
    columnas: 2,
    opciones: [
      { id: 'lively', t: { en: 'World Cup final', es: 'Final del Mundial' }, dice: { en: 'Goal! Noise, toasts, people.', es: '¡Gol! Ruido, brindis y gente.' } },
      { id: 'calm', t: { en: 'MLS game on a Tuesday', es: 'Partido de MLS un martes' }, dice: { en: 'Chill. You can actually hear each other.', es: 'Tranqui. Se oye la conversación.' } },
    ],
  },
  {
    id: 'bebida',
    q: { en: 'What are we drinking?', es: '¿Con qué brindamos?' },
    columnas: 2,
    opciones: [
      { id: 'beer', t: { en: 'A beer', es: 'Una chela' }, dice: { en: 'A beer. No peer pressure.', es: 'Una chela, sin presión social.' }, plan: { en: 'with a beer', es: 'con chela' } },
      { id: 'mezcal', t: { en: 'Mezcal', es: 'Mezcal' }, dice: { en: 'Smoky, with orange. I like you.', es: 'Ahumado y con naranja. Me caes bien.' }, plan: { en: 'with mezcal', es: 'con mezcal' } },
      { id: 'sake', t: { en: 'Sake', es: 'Sake' }, dice: { en: 'Kanpai.', es: 'Kanpai.' }, plan: { en: 'with sake', es: 'con sake' } },
      { id: 'wine', t: { en: 'Natural wine', es: 'Vino natural' }, dice: { en: 'Order a chato and trust the list.', es: 'Pide un chato y confía.' }, plan: { en: 'with natural wine', es: 'con vino natural' } },
      { id: 'cocktails', t: { en: 'A cocktail', es: 'Un coctel' }, dice: { en: 'Something with nice ice.', es: 'Algo con hielo bonito.' }, plan: { en: 'with cocktails', es: 'con tragos' } },
      { id: 'coffee', t: { en: 'Coffee, I have work', es: 'Café, hay que trabajar' }, dice: { en: 'Let an LLM write the code. You drink the coffee.', es: 'Que el código lo escriba un LLM. Tú tómate el café.' }, plan: { en: 'with coffee', es: 'con café' } },
      { id: 'none', t: { en: "Water's fine", es: 'Agua, gracias' }, dice: { en: 'Respect.', es: 'Respeto.' } },
    ],
  },
  {
    id: 'layover',
    q: { en: 'Six-hour layover. Where do you get off to eat?', es: 'Layover de seis horas. ¿Dónde te bajas a comer?' },
    columnas: 2,
    opciones: [
      { id: 'japan', t: { en: 'Tokyo', es: 'Tokio' }, dice: { en: 'Izakaya or ramen. We will see.', es: 'Izakaya o ramen. Ya veremos.' } },
      { id: 'korea', t: { en: 'Seoul', es: 'Seúl' }, dice: { en: 'Charcoal and banchan.', es: 'Carbón y banchan.' } },
      { id: 'china', t: { en: 'Taipei', es: 'Taipéi' }, dice: { en: 'Dumplings incoming.', es: 'Vienen dumplings.' } },
      { id: 'mexico', t: { en: 'Mexico City', es: 'Ciudad de México' }, dice: { en: 'Trompo or nothing.', es: 'Trompo o nada.' } },
      { id: 'guate', t: { en: 'Guatemala City', es: 'Ciudad de Guatemala' }, dice: { en: 'Now we are talking. Something from home.', es: '¡Qué chilero! Algo de la casa.' } },
      { id: 'europe', t: { en: 'Madrid', es: 'Madrid' }, dice: { en: 'Tortilla, jamón and vermut.', es: 'Tortilla, jamón y vermut.' } },
      { id: 'seasia', t: { en: 'Yangon', es: 'Rangún' }, dice: { en: 'Fermented tea leaves. Trust me.', es: 'Hoja de té fermentada. Trust me.' } },
      { id: 'mideast', t: { en: 'Istanbul', es: 'Estambul' }, dice: { en: 'Meze for the table.', es: 'Meze para la mesa.' } },
      { id: 'usa', t: { en: "I'm staying in SF", es: 'Me quedo en SF' }, dice: { en: 'Sourdough and oysters, then.', es: 'Entonces sourdough y ostras.' } },
      { id: 'any', t: { en: 'Surprise me', es: 'Sorpréndeme' }, dice: { en: 'I like that attitude.', es: 'Me gusta esa actitud.' } },
    ],
  },
  {
    id: 'compartir',
    q: { en: 'Shared ramen or a burrito all to yourself?', es: '¿Ramen compartido o burrito para ti solo?' },
    columnas: 1,
    opciones: [
      { id: 'share', t: { en: 'Everything in the middle', es: 'Todo al centro' }, dice: { en: "That's how you eat with friends.", es: 'Así se come con amigos.' } },
      { id: 'personal', t: { en: 'Mine is mine', es: 'Lo mío es mío' }, dice: { en: 'Burrito supreme, no sharing.', es: 'Burrito supreme, sin compartir.' } },
    ],
  },
  {
    id: 'fila',
    q: { en: "Would you wait an hour in line for SF's best?", es: '¿Harías una hora de fila por lo mejor de SF?' },
    columnas: 1,
    opciones: [
      { id: 'line', t: { en: "Yes. Trust me, it's worth it", es: 'Sí. Trust me, vale la pena' }, dice: { en: 'A person of culture.', es: 'Una persona de cultura.' } },
      { id: 'reserve', t: { en: 'Only if I can book', es: 'Solo si puedo reservar' }, dice: { en: 'Open Resy right now.', es: 'Abre Resy desde ya.' } },
      { id: 'noline', t: { en: 'No way, I want in now', es: 'Ni loco, quiero entrar ya' }, dice: { en: 'Zero line. Noted.', es: 'Cero fila. Anotado.' } },
    ],
  },
  {
    id: 'estilo',
    q: { en: 'Steve Jobs keynote or a garage in a hoodie?', es: '¿Keynote de Steve Jobs o garaje con hoodie?' },
    columnas: 1,
    opciones: [
      { id: 'fine', t: { en: 'Keynote: tablecloth and a show', es: 'Keynote: mantel y show' }, dice: { en: 'One more thing: book ahead.', es: 'One more thing: reservá con tiempo.' } },
      { id: 'mid', t: { en: 'Somewhere in between', es: 'Algo en medio' }, dice: { en: 'No tablecloth, no plastic. Perfect.', es: 'Ni mantel ni plástico. Perfecto.' } },
      { id: 'casual', t: { en: 'Garage: plastic table, big flavor', es: 'Garaje: mesa de plástico y sabor' }, dice: { en: "Some of SF's best comes with paper napkins.", es: 'Lo mejor de SF a veces trae servilleta de papel.' } },
    ],
  },
  {
    id: 'picante',
    q: { en: 'How much heat can you take?', es: '¿Cuánto picante aguantas?' },
    columnas: 1,
    opciones: [
      { id: 'hot', t: { en: 'Make me cry', es: 'Que me haga llorar' }, dice: { en: 'Sichuan level unlocked.', es: 'Nivel Sichuan desbloqueado.' } },
      { id: 'some', t: { en: 'A little, on the side', es: 'Un poquito, aparte' }, dice: { en: 'As it should be.', es: 'Como debe ser.' } },
      { id: 'mild', t: { en: 'None, thanks', es: 'Nada, gracias' }, dice: { en: 'No scares tonight.', es: 'Nada de sustos.' } },
    ],
  },
  {
    id: 'distancia',
    q: { en: 'Last one: how far will you go?', es: 'La última: ¿cuánto te mueves?' },
    columnas: 1,
    opciones: [
      { id: 'near', t: { en: "Whatever's around the corner", es: 'Lo que esté a la vuelta' }, dice: { en: 'Let me see where you are.', es: 'Déjame ver dónde estás.' } },
      { id: 'muni', t: { en: "I'll take Muni or a Waymo", es: 'Agarro un Muni o un Waymo' }, dice: { en: "The Waymo won't judge your cravings.", es: 'El Waymo no juzga tus antojos.' } },
      { id: 'far', t: { en: "I'll cross the city for it", es: 'Cruzo la ciudad por algo bueno' }, dice: { en: "That's the spirit.", es: 'Así se habla.' } },
    ],
  },
];

export const COLOR_MAP = {
  'черный': '#1a1a1a',
  'белый': '#f5f5f5',
  'темно-синий': '#0f2744',
  'синий': '#1e40af',
  'светло-голубой': '#93c5fd',
  'голубой': '#60a5fa',
  'лазурный': '#38bdf8',
  'темно-серый': '#4b5563',
  'светло-серый': '#d1d5db',
  'серый': '#9ca3af',
  'графит': '#4b5563',
  'графитовый': '#4b5563',
  'темно-коричневый': '#5c3d2e',
  'пепельно-коричневый': '#9e8572',
  'теплo-коричневый': '#a0785a',
  'коричневый': '#8B7355',
  'мокко': '#7c5c42',
  'кофе': '#6b3f2a',
  'светло-бежевый': '#e8d5b7',
  'бежевый': '#d4b896',
  'песочный': '#c9a96e',
  'сафари': '#a89968',
  'молочный': '#f0ead6',
  'кремовый': '#fdf6e3',
  'красный': '#dc2626',
  'бордовый': '#7f1d1d',
  'розовый': '#f9a8d4',
  'пудровый': '#f9c6d0',
  'зеленый': '#15803d',
  'оливковый': '#6b7c3a',
  'хаки': '#6b7c3a',
  'фисташка': '#a8c5a0',
  'мятный': '#98d1b8',
  'оранжевый': '#f97316',
  'терракотовый': '#c0634c',
  'горчичный': '#c8960c',
  'желтый': '#eab308',
  'фиолетовый': '#7b5ea7',
  'лавандовый': '#b57edc',
  'сиреневый': '#c3a0d8',
};

// Longest keys first so "темно-синий" is tried before the more generic "синий".
const SORTED_ENTRIES = Object.entries(COLOR_MAP).sort((a, b) => b[0].length - a[0].length);

// Collapses spaces/hyphens and normalizes ё so "светло - голубая" and
// "светло-голубой" become comparable regardless of how it was typed.
const compact = (str) => str.toLowerCase().replace(/ё/g, 'е').replace(/[\s-]+/g, '');

// Colors are free-text, hand-typed in Django admin, so the same color shows
// up with different grammatical endings ("голубой" vs "голубая"). Stripping
// the last 2-letter Russian adjective ending turns both into the same stem.
const stem = (str) => str.replace(/(ый|ий|ой|ая|яя|ое|ые|их|ых)$/, '');

export const getColorCode = (colorName) => {
  if (!colorName) return null;
  const first = compact(colorName.split(',')[0]);
  for (const [key, hex] of SORTED_ENTRIES) {
    if (first.includes(stem(compact(key)))) return hex;
  }
  return null;
};

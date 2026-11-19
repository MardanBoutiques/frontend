const API_BASE = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8001/').replace(/\/$/, '');

export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;

  const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${API_BASE}${path}`;
};

// Экран, с которого показываем второе фото. То же число стоит в index.css,
// в правиле .adaptive-bg — менять их нужно вместе.
export const MOBILE_MAX_WIDTH = 1024;

// Адрес берём в кавычки: тогда любой символ в имени файла остаётся частью
// адреса и не может вылезти из url() в остальную часть правила.
const cssUrl = (url) => `url("${String(url).replace(/["\\]/g, '\\$&')}")`;

/**
 * Фон, который сам меняется на узком экране.
 *
 * Возвращает className и style: подставить оба, иначе работать не будет.
 * Подменяет фото медиазапрос, а не скрипт, — поэтому при повороте экрана
 * ничего не мигает и лишнего кадра не грузится.
 *
 * Фото нет вовсе — className пустой, и элемент остаётся со своим
 * оформлением из CSS (у некоторых блоков там лежит запасной снимок).
 */
export const adaptiveBackground = (desktopUrl, mobileUrl) => {
  const desktop = desktopUrl || mobileUrl;
  if (!desktop) return { className: '', style: undefined };

  const style = { '--bg-desktop': cssUrl(desktop) };
  if (mobileUrl) style['--bg-mobile'] = cssUrl(mobileUrl);
  return { className: 'adaptive-bg', style };
};

/** То же, но из записи «Изображения главной страницы»: сразу оба поля. */
export const adaptiveBackgroundFor = (slot) =>
  adaptiveBackground(getImageUrl(slot?.image), getImageUrl(slot?.image_mobile));

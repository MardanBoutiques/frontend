/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";
import NavBar from "../navbar/NavBar";
import openAxios from "../../api/axios";
import { getImageUrl, adaptiveBackground, adaptiveBackgroundFor } from "../../utils/imageUrl";
import StoreVisitCta from "../storescta/StoreVisitCta";
import Stories from "../stories/Stories";
// eslint-disable-next-line react/prop-types
// function Surrounding({ element }) {
//   return <div className="background-container">{element}</div>;
// }

function iconsWhite() {
  const icons = document.querySelectorAll(".icon-1");

  icons.forEach((icon) => {
    icon.style.filter = "brightness(1)";
  });

  const menuIcon = document.querySelectorAll(".menu-icon span");

  menuIcon.forEach((span) => {
    span.style.filter = "brightness(1)";
  });
}

function iconsDark() {
  const icons = document.querySelectorAll(".icon-1");

  icons.forEach((icon) => {
    icon.style.filter = "brightness(0)";
  });

  const menuIcon = document.querySelectorAll(".menu-icon span");

  menuIcon.forEach((span) => {
    span.style.filter = "brightness(0)";
  });
}

const listener2 = () => {
  const navbar = document.querySelector("#navbar-home");
  if (!navbar) return;

  // Icons stay light while the pinned hero is on screen, then go dark
  if (window.scrollY > HERO_COVER_START_PX()) {
    iconsDark();
  } else {
    iconsWhite();
  }

  navbar.style.top = "0";
};

// Каждый пункт открывает главное меню — и сразу раскрывает тот раздел,
// в котором эта категория живёт. Так список на hero не расходится с меню.
// Пункт либо ведёт сразу в каталог, либо открывает нужное подменю:
// без подменю открывать меню бессмысленно — выглядит как «ничего не нажалось»
const HERO_CATEGORIES = [
  { label: 'BLACK FRIDAY', to: '/catalogue?category=sale' },
  { label: 'Новые поступления', to: '/catalogue?category=new' },
  { label: 'Костюмы', submenu: 'clothing' },
  { label: 'Пиджаки', submenu: 'clothing' },
  { label: 'Рубашки', submenu: 'clothing' },
  { label: 'Брюки', submenu: 'clothing' },
  { label: 'Обувь', to: '/catalogue?category=shoes' },
  { label: 'Аксессуары', submenu: 'accessories' },
];

const openMenu = (submenu) =>
  window.dispatchEvent(new CustomEvent('mardan:open-menu', { detail: { submenu } }));

// Hero timeline, in scroll pixels (keep in sync with .hero-pin-wrap height):
//   0 … REVEAL        — список категорий разворачивается
//   REVEAL … +HOLD    — hero держится на месте с полным списком
//   затем             — следующий блок наезжает сверху
const HERO_REVEAL_PX = () => window.innerHeight;
const HERO_HOLD_PX = () => window.innerHeight * 0.5;
const HERO_COVER_START_PX = () => HERO_REVEAL_PX() + HERO_HOLD_PX();
const HERO_TOTAL_PX = () => HERO_COVER_START_PX() + window.innerHeight;

// Из админки приходит ключ шрифта, а не название семейства: подставлять в
// стиль страницы строку из базы нельзя. Ключу соответствует класс, описанный
// в Home.css рядом с @font-face.
const FONT_CLASS = {
  halvar: 'hero-font--halvar',
  mellarose: 'hero-font--mellarose',
  serif: 'hero-font--serif',
  sans: 'hero-font--sans',
};

// Незнакомый ключ — возвращаемся к фирменному, а не остаёмся без шрифта
const шрифт = (ключ) => FONT_CLASS[ключ] || FONT_CLASS.halvar;

// Цвет задаётся в админке в свободной форме: #ffffff, #ffffff80 с
// прозрачностью, rgba(...). Формат намеренно не проверяем.
//
// Значение уходит свойством объекта стиля, а не строкой стиля. Браузер
// разбирает его как значение одного свойства color: неподходящее просто
// не применится, а новых правил из него не возникнет. Пустую строку не
// передаём вовсе, иначе она перебила бы цвет из таблицы стилей.
const цвет = (значение) => (значение ? { color: значение } : undefined);

// Размер из админки задан для обычного экрана (около 1440 точек). Отдаём его
// через clamp, чтобы на узких экранах строка уменьшалась сама, а не уезжала
// за край: нижняя граница — доля от заданного размера, средняя — та же
// величина в долях ширины окна.
const размер = (px, доляМин) => {
  const число = Number(px);
  if (!Number.isFinite(число) || число <= 0) return undefined;
  return {
    fontSize: `clamp(${Math.round(число * доляМин)}px, ${(число / 14.4).toFixed(2)}vw, ${число}px)`,
  };
};

// Доли подобраны так, чтобы значения по умолчанию (52 и 20) повторяли
// прежний вид страницы
const стильЗаголовка = (цветЗн, размерЗн) => ({ ...цвет(цветЗн), ...размер(размерЗн, 0.55) });
const стильПодзаголовка = (цветЗн, размерЗн) => ({ ...цвет(цветЗн), ...размер(размерЗн, 0.75) });

const HeroSection = ({
  heroSlot,
  heroCaption,
  heroSubtitle,
  heroCaptionColor,
  heroSubtitleColor,
  heroCategoriesColor,
  heroFirstCategoryColor,
  heroFont,
  heroSubtitleFont,
  heroCaptionSize,
  heroSubtitleSize,
  heroOverlayColor,
  heroOverlayStrength,
  visibleCount,
  hidden,
}) => {
  const navigate = useNavigate();
  // Затемнение рисует псевдоэлемент, своего стиля в разметке у него нет —
  // поэтому цвет и силу передаём переменными на родителя.
  const сила = Number(heroOverlayStrength);
  // Фото для компьютера и для телефона приходят из админки отдельно;
  // какое показать, решает медиазапрос в index.css.
  const фон = adaptiveBackgroundFor(heroSlot);
  const heroStyle = {
    ...(фон.style || {}),
    ...(heroOverlayColor ? { '--hero-overlay': heroOverlayColor } : {}),
    '--hero-overlay-strength': Number.isFinite(сила) ? сила / 100 : 1,
  };

  return (
    <div className="hero-pin-wrap">
      <div className={`hero-fixed ${hidden ? 'is-hidden' : ''}`}>
        <div className={`hero-picture ${фон.className}`} style={heroStyle}></div>
        {/* Заголовок, подзаголовок, их цвета и шрифт задаются в админке.
            Пустые строки не выводим вовсе, чтобы не оставлять отступ. */}
        {(heroCaption || heroSubtitle) && (
          <div className="hero-caption-block">
            {heroCaption && (
              <p
                className={`hero-caption ${шрифт(heroFont)}`}
                style={стильЗаголовка(heroCaptionColor, heroCaptionSize)}
              >
                {heroCaption}
              </p>
            )}
            {heroSubtitle && (
              <p
                className={`hero-subtitle ${шрифт(heroSubtitleFont)}`}
                style={стильПодзаголовка(heroSubtitleColor, heroSubtitleSize)}
              >
                {heroSubtitle}
              </p>
            )}
          </div>
        )}
        <nav className="hero-section-menu">
          {HERO_CATEGORIES.map((c, i) => (
            <button
              key={c.label}
              type="button"
              className={`hero-nav-item ${i < visibleCount ? 'is-shown' : ''}`}
              // Первый пункт можно выделить своим цветом: сейчас это
              // BLACK FRIDAY. Пусто — берём цвет остальных пунктов.
              style={цвет((i === 0 && heroFirstCategoryColor) || heroCategoriesColor)}
              onClick={() => (c.to ? navigate(c.to) : openMenu(c.submenu))}
            >
              {c.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

const CollectionTile = ({ to, submenu, label, фон }) => {
  const Tag = submenu ? 'button' : Link;
  const props = submenu
    ? {
        type: 'button',
        onClick: () => openMenu(submenu),
      }
    : { to };

  return (
  <Tag {...props} className="collection-section">
    <div
      className={`collection-image-full ${фон.className}`}
      style={{
        ...(фон.style || {}),
        backgroundColor: фон.className ? 'transparent' : '#1a1a1a',
      }}
    >
      <div className="collection-overlay">
        <div className="collection-cta">{label}</div>
      </div>
    </div>
  </Tag>
  );
};

// Фраза ломается по-разному: на узком экране первая строка короче
const MOTTO_LINES_WIDE = [
  'Ежедневный комфорт — не компромисс,',
  'а основа хорошего стиля.',
];

const MOTTO_LINES_NARROW = [
  'Ежедневный комфорт',
  'не компромисс, а основа хорошего стиля.',
];

const MOTTO_QUERY = '(max-width: 768px)';

// Срабатывает один раз, когда блок доходит до экрана
const useInView = (threshold = 0.4) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setInView(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        setInView(true);
        observer.disconnect();
      },
      { threshold }
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
};

// Строки проявляются по очереди, сверху вниз
const Motto = () => {
  const [ref, inView] = useInView(0.5);
  const [narrow, setNarrow] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(MOTTO_QUERY).matches
  );

  useEffect(() => {
    const query = window.matchMedia(MOTTO_QUERY);
    const onChange = (e) => setNarrow(e.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  const lines = narrow ? MOTTO_LINES_NARROW : MOTTO_LINES_WIDE;

  return (
    <p className={`home-motto-text ${inView ? 'in' : ''}`} ref={ref}>
      {lines.map((line, i) => (
        <span
          key={line}
          className="home-reveal home-motto-line"
          style={{ transitionDelay: `${i * 160}ms` }}
        >
          {line}
        </span>
      ))}
    </p>
  );
};

const HomeSections = ({ images, giftBoxImage }) => {
  const слот = (imageType) => images.find((i) => i.image_type === imageType);
  const фон = (imageType) => adaptiveBackgroundFor(слот(imageType));

  return (
    <div className="home-stack">
      {/* Лента сторис; если их нет, компонент ничего не рисует */}
      <Stories />

      <section className="home-row">
        <CollectionTile to="/catalogue?category=suits&subcategory=set" label="Костюмы" фон={фон('section1')} />
        <CollectionTile submenu="outerwear" label="Верхняя одежда" фон={фон('section2')} />
      </section>

      <section className="home-row">
        <CollectionTile to="/catalogue?category=polo" label="Поло и футболки" фон={фон('section4')} />
        {/* Слот из админки главнее: иначе фото бокса перебивало бы то, что
            загрузили в «Главная: Подарочный гид» */}
        <CollectionTile
          to="/gift-guide"
          label="Подарочный гид"
          фон={слот('section5') ? фон('section5') : adaptiveBackground(giftBoxImage)}
        />
      </section>

      <section className="home-motto">
        <Motto />
      </section>

      <StoreVisitCta slot={слот('section6') || null} />
    </div>
  );
};

export default function Home() {
  const [images, setImages] = useState([]);
  const [giftBoxImage, setGiftBoxImage] = useState(null);
  // Hero держит экран, пока прокрутка разворачивает список категорий:
  // 1 категория в самом верху → все к концу закреплённого участка.
  const [visibleCount, setVisibleCount] = useState(1);
  const [heroHidden, setHeroHidden] = useState(false);

  const heroSlot = images.find(img => img.image_type === 'hero');

  useEffect(() => {
    const onScroll = () => {
      const progress = Math.min(1, Math.max(0, window.scrollY / HERO_REVEAL_PX()));
      setVisibleCount(1 + Math.round(progress * (HERO_CATEGORIES.length - 1)));
      // Once the next block has fully covered the hero, drop it from the paint
      setHeroHidden(window.scrollY > HERO_TOTAL_PX());
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  useEffect(() => {
    // Загружаем изображения с API
    const fetchImages = async () => {
      try {
        const response = await openAxios.get('/api/homepage-images/');
        console.log('Loaded images:', response.data);
        setImages(response.data);
      } catch (error) {
        console.error('Ошибка загрузки изображений:', error);
      }
    };

    // Фото для блока «Подарочный гид» — вторая карточка подарочного бокса
    const fetchGiftBox = async () => {
      try {
        const response = await openAxios.get('/api/giftboxes/');
        const box = response.data.find((b) => b.image2);
        if (box) setGiftBoxImage(getImageUrl(box.image2));
      } catch (error) {
        console.error('Ошибка загрузки подарочного бокса:', error);
      }
    };

    fetchImages();
    fetchGiftBox();

    window.addEventListener("scroll", listener2);
    listener2();

    return () => {
      window.removeEventListener("scroll", listener2);
    };
  }, []);

  return (
    <>
      <NavBar forHome={true}>
        <span></span>
        <span></span>
      </NavBar>
      <HeroSection
        heroSlot={heroSlot}
        heroCaption={heroSlot?.caption || ''}
        heroSubtitle={heroSlot?.subtitle || ''}
        heroCaptionColor={heroSlot?.caption_color || ''}
        heroSubtitleColor={heroSlot?.subtitle_color || ''}
        heroCategoriesColor={heroSlot?.categories_color || ''}
        heroFirstCategoryColor={heroSlot?.first_category_color || ''}
        heroFont={heroSlot?.caption_font || 'halvar'}
        heroSubtitleFont={heroSlot?.subtitle_font || 'halvar'}
        heroCaptionSize={heroSlot?.caption_size}
        heroSubtitleSize={heroSlot?.subtitle_size}
        heroOverlayColor={heroSlot?.overlay_color || ''}
        heroOverlayStrength={heroSlot?.overlay_strength}
        visibleCount={visibleCount}
        hidden={heroHidden}
      />
      <HomeSections images={images} giftBoxImage={giftBoxImage} />
    </>
  );
}

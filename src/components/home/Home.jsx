/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import NavBar from "../navbar/NavBar";
import openAxios from "../../api/axios";
import { getImageUrl } from "../../utils/imageUrl";
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
const HERO_CATEGORIES = [
  { label: 'Новые поступления' },
  { label: 'Костюмы', submenu: 'clothing' },
  { label: 'Пиджаки', submenu: 'clothing' },
  { label: 'Рубашки', submenu: 'clothing' },
  { label: 'Брюки', submenu: 'clothing' },
  { label: 'Обувь' },
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

const HeroSection = ({ heroImage, heroCaption, heroCaptionColor, visibleCount, hidden }) => {
  const heroStyle = heroImage ? { backgroundImage: `url(${heroImage})` } : {};

  return (
    <div className="hero-pin-wrap">
      <div className={`hero-fixed ${hidden ? 'is-hidden' : ''}`}>
        <div className="hero-picture" style={heroStyle}></div>
        {/* Подпись и её цвет задаются в админке; пустую не показываем */}
        {heroCaption && (
          <p className="hero-caption" style={heroCaptionColor ? { color: heroCaptionColor } : undefined}>
            {heroCaption}
          </p>
        )}
        <nav className="hero-section-menu">
          {HERO_CATEGORIES.map((c, i) => (
            <button
              key={c.label}
              type="button"
              className={`hero-nav-item ${i < visibleCount ? 'is-shown' : ''}`}
              onClick={() => openMenu(c.submenu)}
            >
              {c.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

const CollectionTile = ({ to, submenu, label, image }) => {
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
      className="collection-image-full"
      style={{
        backgroundImage: image ? `url(${image})` : 'none',
        backgroundColor: image ? 'transparent' : '#1a1a1a',
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
  const img = (imageType) => {
    const image = images.find((i) => i.image_type === imageType);
    return image ? getImageUrl(image.image) : null;
  };

  return (
    <div className="home-stack">
      {/* Лента сторис; если их нет, компонент ничего не рисует */}
      <Stories />

      <section className="home-row">
        <CollectionTile to="/catalogue?category=suits&subcategory=set" label="Костюмы" image={img('section1')} />
        <CollectionTile submenu="outerwear" label="Верхняя одежда" image={img('section2')} />
      </section>

      <section className="home-row">
        <CollectionTile to="/catalogue?category=polo" label="Поло и футболки" image={img('section4')} />
        {/* Слот из админки главнее: иначе фото бокса перебивало бы то, что
            загрузили в «Главная: Подарочный гид» */}
        <CollectionTile to="/gift-guide" label="Подарочный гид" image={img('section5') || giftBoxImage} />
      </section>

      <section className="home-motto">
        <Motto />
      </section>

      <StoreVisitCta photo={img('section6')} />
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

  const getHeroImage = () => (heroSlot ? getImageUrl(heroSlot.image) : null);

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
        heroImage={getHeroImage()}
        heroCaption={heroSlot?.caption || ''}
        heroCaptionColor={heroSlot?.caption_color || ''}
        visibleCount={visibleCount}
        hidden={heroHidden}
      />
      <HomeSections images={images} giftBoxImage={giftBoxImage} />
    </>
  );
}

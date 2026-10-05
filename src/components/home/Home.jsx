/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import NavBar from "../navbar/NavBar";
import openAxios from "../../api/axios";
import { getImageUrl } from "../../utils/imageUrl";
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

const HERO_CATEGORIES = [
  { label: 'Новые поступления', path: '/catalogue?category=new' },
  { label: 'Костюмы', path: '/catalogue?category=suits&subcategory=set' },
  { label: 'Пиджаки', path: '/catalogue?category=suits&subcategory=jacket' },
  { label: 'Рубашки', path: '/catalogue?category=shirts' },
  { label: 'Брюки', path: '/catalogue?category=pants' },
  { label: 'Обувь', path: '/catalogue?category=shoes' },
  { label: 'Аксессуары', path: '/catalogue?category=accessories' },
];

// Hero timeline, in scroll pixels (keep in sync with .hero-pin-wrap height):
//   0 … REVEAL        — список категорий разворачивается
//   REVEAL … +HOLD    — hero держится на месте с полным списком
//   затем             — следующий блок наезжает сверху
const HERO_REVEAL_PX = () => window.innerHeight;
const HERO_HOLD_PX = () => window.innerHeight * 0.5;
const HERO_COVER_START_PX = () => HERO_REVEAL_PX() + HERO_HOLD_PX();
const HERO_TOTAL_PX = () => HERO_COVER_START_PX() + window.innerHeight;

const HeroSection = ({ heroImage, visibleCount, hidden }) => {
  const heroStyle = heroImage ? { backgroundImage: `url(${heroImage})` } : {};

  return (
    <div className="hero-pin-wrap">
      <div className={`hero-fixed ${hidden ? 'is-hidden' : ''}`}>
        <div className="hero-picture" style={heroStyle}></div>
        <div className="hero-picture-darkening"></div>
        <nav className="hero-section-menu">
          {HERO_CATEGORIES.map((c, i) => (
            <Link
              key={c.label}
              to={c.path}
              className={`hero-nav-item ${i < visibleCount ? 'is-shown' : ''}`}
            >
              {c.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

const CollectionTile = ({ to, label, image }) => (
  <Link to={to} className="collection-section">
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
  </Link>
);

const HomeSections = ({ images }) => {
  const img = (imageType) => {
    const image = images.find((i) => i.image_type === imageType);
    return image ? getImageUrl(image.image) : null;
  };

  // Reveal each block once it scrolls into view
  useEffect(() => {
    const targets = document.querySelectorAll('[data-reveal]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [images]);

  return (
    <div className="home-stack">
      <section className="home-row" data-reveal>
        <CollectionTile to="/catalogue?category=suits" label="Костюмы" image={img('section1')} />
        <CollectionTile to="/catalogue?category=outerwear" label="Верхняя одежда" image={img('section2')} />
      </section>

      <section className="home-row" data-reveal>
        <CollectionTile to="/catalogue?category=polo" label="Поло и футболки" image={img('section4')} />
        <CollectionTile to="/giftbox" label="Подарочный гид" image={img('section5')} />
      </section>

      <Link to="/stores" className="home-row home-stores" data-reveal>
        <div className="home-statement">
          <h2 className="home-statement-title">Your Daily Comfort</h2>
          <p className="home-statement-text">
            Ждем вас в наших бутиках для примерки, подбора идеального размера и консультации стилистов.
          </p>
        </div>
        <div
          className="home-stores-photo"
          style={{
            backgroundImage: img('section6') ? `url(${img('section6')})` : 'none',
            backgroundColor: img('section6') ? 'transparent' : '#1a1a1a',
          }}
        />
      </Link>
    </div>
  );
};

export default function Home() {
  const [images, setImages] = useState([]);
  // Hero держит экран, пока прокрутка разворачивает список категорий:
  // 1 категория в самом верху → все к концу закреплённого участка.
  const [visibleCount, setVisibleCount] = useState(1);
  const [heroHidden, setHeroHidden] = useState(false);

  const getHeroImage = () => {
    const heroImg = images.find(img => img.image_type === 'hero');
    return heroImg ? getImageUrl(heroImg.image) : null;
  };

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

    fetchImages();

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
      <HeroSection heroImage={getHeroImage()} visibleCount={visibleCount} hidden={heroHidden} />
      <HomeSections images={images} />
    </>
  );
}

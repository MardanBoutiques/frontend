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

const listener = () => {
  const heroContentOverlayDarkening = document.querySelector(
    ".hero-content-overlay-darkening"
  );
  const heroContentOverlay = document.querySelector(".hero-content-overlay");
  const scrollPosition = window.scrollY;

  if (scrollPosition > 500) {
    heroContentOverlayDarkening.style.opacity = "0";
    heroContentOverlay.style.opacity = "0";
    setTimeout(() => {
      heroContentOverlayDarkening.style.visibility = "hidden";
      heroContentOverlay.style.visibility = "hidden";
    }, 400);
    return;
  } else {
    heroContentOverlayDarkening.style.visibility = "visible";
    heroContentOverlay.style.visibility = "visible";
    heroContentOverlayDarkening.style.opacity = "1";
    heroContentOverlay.style.opacity = "1";
  }

  // Adjust the background darkness based on scroll
  const darkenFactor = Math.min(scrollPosition / 700, 0.4);
  heroContentOverlayDarkening.style.backgroundColor = `rgba(0, 0, 0, ${darkenFactor})`;
};

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

let lastScrollTop = 0;

// Create an observer instance
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const homeSection = entry.target;

      const pictures = homeSection.querySelector(".pictures");
      pictures.style.animation = "darkenBackground 1s ease-in-out forwards";
    }
  });
});

const listener2 = () => {
  const scrollPosition = window.scrollY;

  const navbar = document.querySelector("#navbar-home");

  if (scrollPosition > 200) {
    iconsDark();
  } else {
    iconsWhite();
  }

  navbar.style.top = "0";
};

const HeroSection = ({ children, heroImage }) => {
  const heroStyle = heroImage ? { backgroundImage: `url(${heroImage})` } : {};
  
  return (
    <>
      <div className="hero-placeholder"></div>
      <div className="hero-content-overlay" style={heroStyle}></div>
      <div className="hero-content-overlay-darkening"></div>
      <section className="hero-section">
        <div className="hero-picture" style={heroStyle}></div>
        <div className="hero-picture-darkening"></div>
        <div className="hero-section-menu">{children}</div>
      </section>
    </>
  );
};

const HeroPictures = ({ images }) => {
  const getImageByType = (imageType) => {
    const image = images.find(img => img.image_type === imageType);
    return image ? getImageUrl(image.image) : null;
  };

  return (
    <section className="collections-container">
      <Link to="/catalogue?category=suits" className="collection-section">
        <div
          className="collection-image-full"
          style={{
            backgroundImage: getImageByType('section1') ? `url(${getImageByType('section1')})` : 'none',
            backgroundColor: getImageByType('section1') ? 'transparent' : '#1a1a1a',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="collection-overlay">
            <div className="collection-cta">Костюмы</div>
          </div>
        </div>
      </Link>

      <Link to="/catalogue?category=knitwear" className="collection-section">
        <div
          className="collection-image-full"
          style={{
            backgroundImage: getImageByType('section2') ? `url(${getImageByType('section2')})` : 'none',
            backgroundColor: getImageByType('section2') ? 'transparent' : '#1a1a1a',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="collection-overlay">
            <div className="collection-cta">Трикотаж</div>
          </div>
        </div>
      </Link>

      <Link to="/catalogue?category=shirts" className="collection-section">
        <div
          className="collection-image-full"
          style={{
            backgroundImage: getImageByType('section3') ? `url(${getImageByType('section3')})` : 'none',
            backgroundColor: getImageByType('section3') ? 'transparent' : '#1a1a1a',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="collection-overlay">
            <div className="collection-cta">Рубашки</div>
          </div>
        </div>
      </Link>
    </section>
  );
};

export default function Home() {
  const [images, setImages] = useState([]);

  const getHeroImage = () => {
    const heroImg = images.find(img => img.image_type === 'hero');
    return heroImg ? getImageUrl(heroImg.image) : null;
  };

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

    window.addEventListener("scroll", listener);
    window.addEventListener("scroll", listener2);

    return () => {
      window.removeEventListener("scroll", listener);
      window.removeEventListener("scroll", listener2);
    };
  }, []);

  return (
    <>
      <NavBar forHome={true}>
        <span></span>
        <span></span>
      </NavBar>
      <HeroSection heroImage={getHeroImage()}>
        <Link to="/catalogue?category=suits">Костюмы</Link>
        <Link to="/catalogue?category=knitwear">Трикотаж</Link>
        <Link to="/catalogue?category=jackets">Куртки</Link>
        <Link to="/catalogue?category=accessories">Аксессуары</Link>
        <Link to="/giftbox">Подарочный бокс</Link>
        <Link to="/giftcard">Подарочная карта</Link>
      </HeroSection>
      <HeroPictures images={images} />
    </>
  );
}

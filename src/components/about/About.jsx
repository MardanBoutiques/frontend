import { useEffect, useState } from 'react';
import NavBar from '../navbar/NavBar';
import openAxios from '../../api/axios';
import { getImageUrl, adaptiveBackgroundFor } from '../../utils/imageUrl';
import AdaptiveImage from '../AdaptiveImage';
import './About.css';

const About = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    openAxios.get('/api/homepage-images/')
      .then((response) => setImages(response.data))
      .catch((error) => console.error('Ошибка загрузки изображений:', error));
  }, []);

  const слот = (imageType) => images.find((i) => i.image_type === imageType);

  const getImageByType = (imageType) => {
    const img = слот(imageType);
    return img ? getImageUrl(img.image) : null;
  };

  // Фон, который сам меняется на телефоне: в админке у каждой записи
  // два файла, второй — для узкого экрана.
  const фон = (imageType) => adaptiveBackgroundFor(слот(imageType));

  const heroФон = фон('about_hero');

  return (
    <>
      <NavBar />

      {/* Hero */}
      <div className={`about-hero ${heroФон.className}`} style={heroФон.style}>
        <div className="about-hero-inner">
          <h1 className="about-hero-title">MARDAN</h1>
          <p className="about-hero-tagline">
            Твой ежедневный комфорт — классика, мастерство и свобода движений.
          </p>
        </div>
      </div>

      {/* Intro */}
      <section className="about-section about-intro">
        {/* Фото задаётся в админке. Без него карточка становится одноколоночной
            и выглядит как раньше, только на подложке. */}
        <div className="about-container about-container--card">
          <div className={`about-intro-card ${getImageByType('about_intro') ? 'has-photo' : ''}`}>
            <div className="about-intro-text">
              <p className="about-label">Вступление</p>
              <h2 className="about-quote">
                «MARDAN — бренд, рождённый на грани классики и кэжуала.»
              </h2>
              <p className="about-body">
                Наша цель — сделать костюм удобным и уместным в повседневной жизни, чтобы мужчина чувствовал себя уверенно и комфортно в любом ритме дня: на встрече, в дороге, на деловом ужине или семейном событии.
              </p>
            </div>

            {getImageByType('about_intro') && (
              <div className="about-intro-photo">
                <AdaptiveImage
                  src={getImageByType('about_intro')}
                  srcMobile={getImageUrl(слот('about_intro')?.image_mobile)}
                  alt="MARDAN"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Key idea */}
      <section className="about-section about-keyidea">
        <div className="about-container">
          <div className="about-keyidea-line" />
          {/* Фраза ломается по-разному: на узком экране первая строка короче
              и без тире. Показывается всегда одна из двух. */}
          <p className="about-keyidea-text">
            <span className="about-keyidea-wide">
              Ежедневный комфорт — не компромисс,<br />а основа хорошего стиля.
            </span>
            <span className="about-keyidea-narrow">
              Ежедневный комфорт<br />не компромисс, а основа хорошего стиля.
            </span>
          </p>
          <div className="about-keyidea-line" />
        </div>
      </section>

      {/* Philosophy */}
      <section className="about-section about-intro">
        <div className="about-container about-container--narrow">
          <p className="about-label">Философия бренда</p>
          <h2 className="about-quote">
            Стиль не должен быть жертвой комфорта, а комфорт — скучным.
          </h2>
          <p className="about-body">
            Наша одежда создаётся для реальной жизни — для работы, встреч, движения и роста. Мы проектируем вещи, которые служат каждый день: продуманная посадка, качество материалов, функциональные детали и безупречная отделка.
          </p>
        </div>
      </section>

      {/* Name meaning */}
      <section className="about-section about-meaning-section">
        <div className="about-container">
          <p className="about-label">Значение названия</p>
          <h2 className="about-meaning-headline">MARDAN</h2>
          <p className="about-body about-meaning-desc">
            В переводе — «отважный мужчина». Это человек, который принимает решения, несёт ответственность, выбирает качество и ценит комфорт. Название отражает наш характер: уверенный, решительный и ориентированный на поступок.
          </p>
          {/* Фото уходит в фон, карточки лежат поверх него */}
          <div
            className={`about-meaning-stage ${getImageByType('about_meaning') ? 'has-photo' : ''} ${фон('about_meaning').className}`}
            style={фон('about_meaning').style}
          >
            <div className="about-meaning-grid">
              <div className="about-meaning-card">
                <h3 className="about-meaning-title">Принимает решения</h3>
                <p className="about-meaning-text">Готов выбирать лучшее и не боится ответственности.</p>
              </div>
              <div className="about-meaning-card">
                <h3 className="about-meaning-title">Несёт ответственность</h3>
                <p className="about-meaning-text">Стиль — это выбор, который отражается в поступках и отношении к делу.</p>
              </div>
              <div className="about-meaning-card">
                <h3 className="about-meaning-title">Выбирает качество</h3>
                <p className="about-meaning-text">Инвестиция в вещи, которые живут дольше и лучше выглядят со временем.</p>
              </div>
              <div className="about-meaning-card">
                <h3 className="about-meaning-title">Ценит комфорт</h3>
                <p className="about-meaning-text">Комфорт — функциональность, которая не выдаёт усталости и всегда уместна.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founders */}
      <section className="about-section about-founders">
        <div className="about-container">
          <p className="about-label">Команда и основатели</p>
          <p className="about-quote about-founders-desc">
            В 2023 году они объединили опыт классического костюма и современного кэжуала, создав бренд, где одежда служит образу жизни, а не витрине.
          </p>
          <div className="about-founders-grid">
            {/* Кликабельна только кнопка, поэтому карточка — не ссылка */}
            <div className="about-founder-card">
              <div className="about-founder-photo-wrap">
                <div
                  className={`about-founder-photo ${фон('founder_alikhan').className}`}
                  style={фон('founder_alikhan').style}
                />
              </div>
              <div className="about-founder-info">
                <div className="about-founder-text">
                  <span className="about-founder-name">Мардан Алихан</span>
                  <p className="about-founder-role">Сo-founder</p>
                </div>
                <a
                  href="https://www.instagram.com/mardanqs/"
                  target="_blank"
                  rel="noreferrer"
                  className="about-founder-visit"
                >
                  Изучить
                </a>
              </div>
            </div>
            <div className="about-founder-card">
              <div className="about-founder-photo-wrap">
                <div
                  className={`about-founder-photo ${фон('founder_erkebulan').className}`}
                  style={фон('founder_erkebulan').style}
                />
              </div>
              <div className="about-founder-info">
                <div className="about-founder-text">
                  <span className="about-founder-name">Хабидуллин Еркебулан</span>
                  <p className="about-founder-role">Сo-founder</p>
                </div>
                <a
                  href="https://www.instagram.com/eklive13/"
                  target="_blank"
                  rel="noreferrer"
                  className="about-founder-visit"
                >
                  Изучить
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="about-section about-mission">
        <div className="about-container about-container--narrow">
          <p className="about-label">Миссия</p>
          <h2 className="about-mission-text">
            Каждый визит клиента — комфортный, уверенный и премиальный опыт.
          </h2>
          <p className="about-body">
            Стилисты формируют образы, которые экономят время и укрепляют доверие.
          </p>
        </div>
      </section>

      {/* Subsidiaries */}
      <section className="about-section about-brands">
        <div className="about-container">
          <p className="about-label">Дочерние компании</p>
          <p className="about-quote about-brands-intro">
            MARDAN развивает экосистему брендов, дополняющих основной ассортимент и усиливающих ценностное предложение.
          </p>
          <div className="about-brands-grid">
            {/* Кликабельна только кнопка, поэтому карточка — не ссылка */}
            <div className="about-brand-card">
              <div className="about-brand-photo-wrap">
                <div
                  className={`about-brand-photo ${фон('brand_114avenue').className}`}
                  style={фон('brand_114avenue').style}
                />
              </div>
              <div className="about-brand-info">
                <div className="about-brand-text">
                  <span className="about-brand-name">114 Avenue</span>
                  <span className="about-brand-category">Очки</span>
                </div>
                <a
                  href="https://www.instagram.com/114.avenue/"
                  target="_blank"
                  rel="noreferrer"
                  className="about-brand-visit"
                >
                  Посетить
                </a>
              </div>
            </div>
            <div className="about-brand-card">
              <div className="about-brand-photo-wrap">
                <div
                  className={`about-brand-photo ${фон('brand_inspira').className}`}
                  style={фон('brand_inspira').style}
                />
              </div>
              <div className="about-brand-info">
                <div className="about-brand-text">
                  <span className="about-brand-name">INSPIRA</span>
                  <span className="about-brand-category">Женская одежда</span>
                </div>
                <a
                  href="https://www.instagram.com/inspira.kz/"
                  target="_blank"
                  rel="noreferrer"
                  className="about-brand-visit"
                >
                  Посетить
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;

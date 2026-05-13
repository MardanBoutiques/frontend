import NavBar from '../navbar/NavBar';
import './About.css';

const About = () => {
  return (
    <>
      <NavBar />

      {/* Hero */}
      <div className="about-hero">
        <div className="about-hero-inner">
          <p className="about-hero-eyebrow">Премиальная мужская одежда</p>
          <h1 className="about-hero-title">MARDAN</h1>
          <p className="about-hero-tagline">
            Твой ежедневный комфорт — классика, мастерство и свобода движений.
          </p>
        </div>
      </div>

      {/* Intro */}
      <section className="about-section about-intro">
        <div className="about-container about-container--narrow">
          <p className="about-label">Вступление</p>
          <h2 className="about-quote">
            «MARDAN — бренд, рождённый на грани классики и кэжуала.»
          </h2>
          <p className="about-body">
            Наша цель — сделать костюм удобным и уместным в повседневной жизни, чтобы мужчина чувствовал себя уверенно и комфортно в любом ритме дня: на встрече, в дороге, на деловом ужине или семейном событии.
          </p>
        </div>
      </section>

      {/* Key idea */}
      <section className="about-section about-keyidea">
        <div className="about-container">
          <div className="about-keyidea-line" />
          <p className="about-keyidea-text">
            Ежедневный комфорт — не компромисс,<br />а основа хорошего стиля.
          </p>
          <div className="about-keyidea-line" />
        </div>
      </section>

      {/* Philosophy */}
      <section className="about-section">
        <div className="about-container about-container--split">
          <div className="about-split-left">
            <p className="about-label">Философия бренда</p>
          </div>
          <div className="about-split-right">
            <p className="about-body">
              MARDAN верит: стиль не должен быть жертвой комфорта, а комфорт — скучным.
            </p>
            <p className="about-body">
              Наша одежда создаётся для реальной жизни — для работы, встреч, движения и роста. Мы проектируем вещи, которые служат каждый день: продуманная посадка, качество материалов, функциональные детали и безупречная отделка.
            </p>
          </div>
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
      </section>

      {/* Founders */}
      <section className="about-section about-founders">
        <div className="about-container">
          <p className="about-label">Команда и основатели</p>
          <div className="about-founders-grid">
            <div className="about-founder-card">
              <a
                href="https://www.instagram.com/mardanqs/"
                target="_blank"
                rel="noreferrer"
                className="about-founder-name"
              >
                Мардан Алихан
              </a>
              <p className="about-founder-role">Сo-founder</p>
            </div>
            <div className="about-founder-card">
              <a
                href="https://www.instagram.com/eklive13/"
                target="_blank"
                rel="noreferrer"
                className="about-founder-name"
              >
                Хабидуллин Еркебулан
              </a>
              <p className="about-founder-role">Сo-founder</p>
            </div>
          </div>
          <p className="about-body about-founders-desc">
            В 2023 году они объединили опыт классического костюма и современного кэжуала, создав бренд, где одежда служит образу жизни, а не витрине.
          </p>
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
          <p className="about-body about-brands-intro">
            MARDAN развивает экосистему брендов, дополняющих основной ассортимент и усиливающих ценностное предложение.
          </p>
          <div className="about-brands-grid">
            <a
              href="https://www.instagram.com/mardan.boutiques/"
              target="_blank"
              rel="noreferrer"
              className="about-brand-card"
            >
              <span className="about-brand-name">114 Avenue</span>
              <span className="about-brand-arrow">↗</span>
            </a>
            <a
              href="https://www.instagram.com/mardan.boutiques/"
              target="_blank"
              rel="noreferrer"
              className="about-brand-card"
            >
              <span className="about-brand-name">INSPIRE</span>
              <span className="about-brand-arrow">↗</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;

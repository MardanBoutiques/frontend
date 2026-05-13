import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../navbar/NavBar';
import './Vacancies.css';

const BENEFITS = [
  {
    title: 'Экспертиза в моде',
    text: 'Глубокое понимание fashion-индустрии, работа с премиальными брендами и стильными коллекциями.',
  },
  {
    title: 'Навыки продаж',
    text: 'Освоишь технику консультационных продаж и научишься выстраивать долгосрочные отношения с клиентами.',
  },
  {
    title: 'Стилистика и эстетика',
    text: 'Практические знания в подборе образов, визуальном мерчандайзинге и работе с клиентскими запросами.',
  },
  {
    title: 'Карьерный рост',
    text: 'Вертикальный и горизонтальный рост внутри компании — от стилиста до управляющего бутиком.',
  },
];

const VACANCIES = [
  {
    id: 'almaty',
    title: 'Стилист-менеджер в бутик',
    city: 'Алматы',
  },
  {
    id: 'astana',
    title: 'Стилист-менеджер в бутик',
    city: 'Астана',
  },
];

const Vacancies = () => {
  const navigate = useNavigate();
  const vacanciesRef = useRef(null);

  const scrollToVacancies = () => {
    vacanciesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <NavBar />

      {/* Hero */}
      <div className="vac-hero">
        <div className="vac-hero-overlay">
          <h1 className="vac-hero-title">
            Построй карьеру<br />в сфере моды
          </h1>
          <p className="vac-hero-sub">
            Присоединяйся к команде Mardan!
          </p>
          <button className="vac-hero-btn" onClick={scrollToVacancies}>
            Вакансии
          </button>
        </div>
      </div>

      {/* Benefits */}
      <div className="vac-section">
        <h2 className="vac-section-title">Какой опыт тебе даст работа в компании</h2>
        <div className="vac-benefits">
          {BENEFITS.map((b, i) => (
            <div key={i} className="vac-benefit-card">
              <span className="vac-benefit-num">0{i + 1}</span>
              <h3 className="vac-benefit-title">{b.title}</h3>
              <p className="vac-benefit-text">{b.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Vacancies list */}
      <div className="vac-section vac-section-dark" ref={vacanciesRef}>
        <h2 className="vac-section-title">Открытые вакансии</h2>
        <div className="vac-list">
          {VACANCIES.map((v) => (
            <div
              key={v.id}
              className="vac-card"
              onClick={() => navigate(`/vacancies/${v.id}`)}
            >
              <div className="vac-card-left">
                <p className="vac-card-city">{v.city}</p>
                <h3 className="vac-card-title">{v.title}</h3>
              </div>
              <span className="vac-card-arrow">→</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Vacancies;

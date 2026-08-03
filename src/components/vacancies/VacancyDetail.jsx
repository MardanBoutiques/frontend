import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '../navbar/NavBar';
import './Vacancies.css';

const VACANCY_DATA = {
  almaty: {
    title: 'Стилист-менеджер в бутик',
    city: 'Алматы',
    email: 'hr@mardanboutiques.com',
  },
  astana: {
    title: 'Стилист-менеджер в бутик',
    city: 'Астана',
    email: 'hr@mardanboutiques.com',
  },
};

const DUTIES = [
  'Подбирать стильные образы и предлагать клиентам грамотные стилистические решения',
  'Формировать доверительные отношения с клиентами и работать с клиентской базой',
  'Осуществлять продажи и консультировать покупателей на высоком уровне',
  'Следить за визуальным оформлением бутика и поддерживать его эстетику',
  'Оформлять покупки и вести сопутствующую документацию',
  'Оказывать высокий уровень сервиса',
];

const REQUIREMENTS = [
  'Открытого, харизматичного человека с навыками продаж',
  'Специалиста с опытом работы в fashion-ритейле (будет преимуществом)',
  'Ответственного сотрудника, который умеет работать в команде и выстраивать долгосрочные отношения с клиентами',
  'Умеющего работать с несколькими клиентами одновременно',
];

const OFFERS = [
  'Работу в динамичном и перспективном проекте',
  'Конкурентную заработную плату: фиксированный оклад + % с ежедневных продаж + бонусы от личных, общих планов продаж + еженедельные бонусы',
  'Возможность профессионального роста, вертикально и горизонтально',
  'Комфортные условия труда и дружный, молодой коллектив',
];

const VacancyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const vacancy = VACANCY_DATA[id];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!vacancy) {
    navigate('/vacancies');
    return null;
  }

  const mailtoLink = `mailto:${vacancy.email}?subject=${encodeURIComponent(`Отклик на вакансию: ${vacancy.title} (${vacancy.city})`)}&body=${encodeURIComponent(`Здравствуйте!\n\nОтправляю своё резюме на вакансию ${vacancy.title} в бутик ${vacancy.city}.\n\nПочему вы должны выбрать именно меня:\n\n`)}`;

  return (
    <>
      <NavBar />
      <div className="vac-detail-container">
        <button className="vac-back-btn" onClick={() => navigate('/vacancies')}>
          ← Все вакансии
        </button>

        <div className="vac-detail-header">
          <p className="vac-detail-city">{vacancy.city}</p>
          <h1 className="vac-detail-title">{vacancy.title}</h1>
        </div>

        <div className="vac-detail-body">
          <div className="vac-detail-section">
            <h2>Что предстоит делать?</h2>
            <ul>
              {DUTIES.map((d, i) => <li key={i}>{d}</li>)}
            </ul>
          </div>

          <div className="vac-detail-section">
            <h2>Кого мы ищем?</h2>
            <ul>
              {REQUIREMENTS.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>

          <div className="vac-detail-section">
            <h2>Что мы предлагаем?</h2>
            <ul>
              {OFFERS.map((o, i) => <li key={i}>{o}</li>)}
            </ul>
          </div>

          <div className="vac-detail-cta">
            <p className="vac-detail-city-note">Город: {vacancy.city}</p>
            <p className="vac-detail-cta-text">
              Готовы стать частью MARDAN? Откликайтесь — отправьте резюме и приложите сопроводительное письмо, почему мы должны выбрать именно вас!
            </p>
            <a className="vac-apply-btn" href={mailtoLink}>
              Откликнуться
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default VacancyDetail;

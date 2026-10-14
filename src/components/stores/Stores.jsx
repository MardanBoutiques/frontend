import { Fragment, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../navbar/NavBar";
import openAxios from "../../api/axios";
import { getImageUrl } from "../../utils/imageUrl";
import "./Stores.css";


const STORES = [
  {
    id: "almaty",
    city: "г. Алматы",
    address: "Улица Жёлтоқсан, 114",
    // Переносы задаём вручную: на телефоне адрес должен ломаться по смыслу
    addressLines: ["г. Алматы,", "Улица Желтоқсан, 114"],
    phone: "+7 707 165 18 62",
    waPhone: "77071651862",
    photo: "/photos/almaty_boutique.png",
    status: "Открыто до 20:00",
    mapUrl: "https://2gis.kz/almaty/search/Mardanboutiques%20%D0%90%D0%BB%D0%BC%D0%B0%D1%82%D1%8B/firm/70000001084011738/76.940071%2C43.255161?m=76.940071%2C43.255161%2F15.08",
    embedUrl: "https://maps.google.com/maps?q=43.255161,76.940071&z=16&output=embed",
    stops: ["Толе би", "Желтоксан"],
    parking: {
      place: "В 50 м от бутика",
      rows: [
        ["Ориентир", "Желтоксан / Казыбек би"],
        ["Оператор", "Almaty Parking"],
        ["Зона", "№2006"],
        ["Доступ", "Общедоступная"],
        ["Тариф", "Платная, 100 KZT / час"],
        ["Оплата", "По QR-коду"],
        ["Зарядка электромобилей", "2 места"],
      ],
    },
    hours: [
      { day: "Понедельник", time: "11:00 – 21:00" },
      { day: "Вторник",     time: "11:00 – 21:00" },
      { day: "Среда",       time: "11:00 – 21:00" },
      { day: "Четверг",     time: "11:00 – 21:00" },
      { day: "Пятница",     time: "11:00 – 21:00" },
      { day: "Суббота",     time: "11:00 – 21:00" },
      { day: "Воскресенье", time: "11:00 – 21:00" },
    ],
  },
  {
    id: "astana",
    city: "г. Астана",
    address: "ЖК Олимп Палас, Улица Туркестан, 8",
    addressLines: ["г. Астана, ЖК Олимп Палас,", "Улица Туркестан, 8"],
    phone: "+7 771 269 96 45",
    waPhone: "77712699645",
    photo: "/photos/astana_boutique.png",
    status: "Открыто до 20:00",
    mapUrl: "https://2gis.kz/astana/search/mardan%20boutiques%20%D0%90%D1%81%D1%82%D0%B0%D0%BD%D0%B0/firm/70000001112703791/71.427883%2C51.11512?m=71.427818%2C51.114727%2F18.09",
    embedUrl: "https://maps.google.com/maps?q=51.1150065,71.4278776&z=16&output=embed",
    stops: [
      "БЦ Olymp Palace",
      "Тилеп Кобыз сарайы",
      "ЖК Айсанам",
      "ЖК Art House",
      "Школа-лицей №76",
    ],
    parking: {
      place: "У входа в бутик",
      rows: [
        ["Оператор", "ТОО «Парковочное пространство Астаны»"],
        ["Зона", "№1352"],
        ["Доступ", "Общедоступная"],
        ["Тариф", "Платная, 100 KZT / час"],
        ["Оплата", "По QR-коду"],
      ],
    },
    hours: [
      { day: "Понедельник", time: "11:00 – 21:00" },
      { day: "Вторник",     time: "11:00 – 21:00" },
      { day: "Среда",       time: "11:00 – 21:00" },
      { day: "Четверг",     time: "11:00 – 21:00" },
      { day: "Пятница",     time: "11:00 – 21:00" },
      { day: "Суббота",     time: "11:00 – 21:00" },
      { day: "Воскресенье", time: "11:00 – 21:00" },
    ],
  },
];

const BusStopIcon = () => (
  <svg className="store-stop-icon" viewBox="0 0 16 16" aria-hidden="true">
    <rect x="2.5" y="2" width="11" height="9.5" rx="1.5" />
    <path d="M2.5 7h11" />
    <circle cx="5.5" cy="13.4" r="1" />
    <circle cx="10.5" cy="13.4" r="1" />
  </svg>
);

const getAlmatyTime = () => {
  const now = new Date();
  // Алматы UTC+5
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + 5 * 3600000);
};

const getTodayName = () => {
  const days = ["Воскресенье","Понедельник","Вторник","Среда","Четверг","Пятница","Суббота"];
  return days[getAlmatyTime().getDay()];
};

const getStoreStatus = (hours) => {
  const almatyNow = getAlmatyTime();
  const dayName = getTodayName();
  const todayHours = hours.find(h => h.day === dayName);

  if (!todayHours) return { open: false, label: "Откроется в 11:00" };

  const [openStr, closeStr] = todayHours.time.split(" – ");
  const [openH, openM] = openStr.split(":").map(Number);
  const [closeH, closeM] = closeStr.split(":").map(Number);

  const nowMinutes = almatyNow.getHours() * 60 + almatyNow.getMinutes();
  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;

  if (nowMinutes >= openMinutes && nowMinutes < closeMinutes) {
    return { open: true, label: `Открыто до ${closeStr}` };
  }
  return { open: false, label: "Откроется в 11:00" };
};

export default function Stores() {
  // Выбранный бутик живёт в адресе, а не в состоянии: иначе из него нельзя
  // вернуться кнопкой «назад» и не срабатывает стекло на переходе.
  const navigate = useNavigate();
  const { storeId } = useParams();
  const selected = storeId || null;
  const today = getTodayName();
  const [, forceUpdate] = useState(0);
  const [images, setImages] = useState([]);

  // Фото бутиков из админки; если не загружено — остаётся файл из репозитория
  useEffect(() => {
    openAxios.get('/api/homepage-images/')
      .then((response) => setImages(response.data))
      .catch((error) => console.error('Ошибка загрузки изображений:', error));
  }, []);

  const photoFor = (store) => {
    const uploaded = images.find((i) => i.image_type === `store_${store.id}`);
    return uploaded ? getImageUrl(uploaded.image) : store.photo;
  };

  // Обновляем статус каждую минуту
  useEffect(() => {
    const interval = setInterval(() => forceUpdate(n => n + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  const openWhatsApp = (city, waPhone) => {
    const text = encodeURIComponent(`Здравствуйте! Хочу записаться на примерку в бутик Mardan (${city}).`);
    window.open(`https://wa.me/${waPhone}?text=${text}`, "_blank");
  };

  if (selected) {
    const store = STORES.find(s => s.id === selected);
    return (
      <>
        <NavBar forHome={false} />
        <div className="store-detail">
          {/* Сначала город и статус, фото под ними — порядок как в референсе */}
          <div className="store-detail-header">
            <h1 className="store-detail-city">{store.city}</h1>
            {(() => { const s = getStoreStatus(store.hours); return (
              <p className={`store-detail-status ${s.open ? "status-open" : "status-closed"}`}>
                <span className="status-dot"></span>{s.label}
              </p>
            ); })()}
          </div>

          {photoFor(store) && (
            <div className="store-detail-photo">
              <img src={photoFor(store)} alt={store.city} />
            </div>
          )}

          <div className="store-detail-body">
            {/* Адрес и карта — один блок */}
            <div className="store-detail-section">
              <h3>Адрес</h3>
              <p>
                {store.addressLines.map((line, i) => (
                  <Fragment key={line}>
                    {/* Пробел нужен сам по себе: на десктопе <br> скрыт,
                        и без него строки склеились бы */}
                    {i > 0 && <>{" "}<br className="store-address-br" /></>}
                    {line}
                  </Fragment>
                ))}
              </p>
              <div className="store-map-embed">
                <iframe
                  src={store.embedUrl}
                  width="100%"
                  height="280"
                  frameBorder="0"
                  allowFullScreen
                  title={`Карта ${store.city}`}
                />
              </div>
              <a href={store.mapUrl} target="_blank" rel="noreferrer" className="store-map-link">Открыть на карте</a>

              {store.stops.length > 0 && (
                <div className="store-subblock">
                  <h4>Автобусные остановки:</h4>
                  <ul className="store-stops store-panel">
                    {store.stops.map((stop) => (
                      <li key={stop}><BusStopIcon />{stop}</li>
                    ))}
                  </ul>
                </div>
              )}

              {store.parking && (
                <div className="store-subblock">
                  <h4>Парковка:</h4>
                  <div className="store-panel">
                    <p className="store-parking-place">{store.parking.place}</p>
                    <dl className="store-parking">
                      {store.parking.rows.map(([label, value]) => (
                        <div key={label} className="store-parking-row">
                          <dt>{label}</dt>
                          <dd>{value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              )}
            </div>

            <div className="store-detail-section">
              <h3>Контакты</h3>
              <p><a href={`tel:${store.phone}`}>{store.phone}</a></p>
            </div>

            <div className="store-detail-section">
              <h3>Часы работы</h3>
              <div className="store-hours-list store-panel">
                {store.hours.map(({ day, time }) => (
                  <div key={day} className={`store-hours-row ${day === today ? "today" : ""}`}>
                    <span className="store-hours-day">{day === today ? "Сегодня" : day}</span>
                    <span className="store-hours-time">{time}</span>
                  </div>
                ))}
              </div>
            </div>

            <button className="store-booking-btn" onClick={() => openWhatsApp(store.city, store.waPhone)}>
              Записаться на примерку
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar forHome={false} />
      <div className="stores-page">
        <div className="stores-grid">
          {STORES.map((store) => (
            <div key={store.id} className="store-card">
              <div className="store-card-photo">
                <img src={photoFor(store)} alt={store.city} />
              </div>
              <div className="store-card-info">
                {/* Город и статус на лёгком размытии, чтобы текст читался на любом фото */}
                <div className="store-card-head">
                  <h2>{store.city}</h2>
                  {(() => { const s = getStoreStatus(store.hours); return (
                    <p className={`store-card-status ${s.open ? "status-open" : "status-closed"}`}>
                      <span className="status-dot"></span>{s.label}
                    </p>
                  ); })()}
                </div>
                {/* Кликабельна только кнопка, не весь блок */}
                <button
                  type="button"
                  className="store-card-book"
                  onClick={() => navigate(`/stores/${store.id}`)}
                >
                  Записаться на примерку
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

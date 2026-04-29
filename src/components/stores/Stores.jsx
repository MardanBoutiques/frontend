import { useState, useEffect } from "react";
import NavBar from "../navbar/NavBar";
import "./Stores.css";


const STORES = [
  {
    id: "almaty",
    city: "г. Алматы",
    address: "Улица Жёлтоқсан, 114",
    fullAddress: "г. Алматы, Улица Желтоқсан, 114",
    phone: "+7 707 165 18 62",
    waPhone: "77071651862",
    photo: "/photos/almaty_boutique.png",
    status: "Открыто до 20:00",
    mapUrl: "https://2gis.kz/almaty/search/Mardanboutiques%20%D0%90%D0%BB%D0%BC%D0%B0%D1%82%D1%8B/firm/70000001084011738/76.940071%2C43.255161?m=76.940071%2C43.255161%2F15.08",
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
    fullAddress: "г. Астана, ЖК Олимп Палас, Улица Туркестан, 8",
    phone: "+7 771 269 96 45",
    waPhone: "77712699645",
    photo: "/photos/astana_boutique.png",
    status: "Открыто до 20:00",
    mapUrl: "https://2gis.kz/astana/firm/70000001112703791?m=71.425735%2C51.120614%2F15.22",
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
  const [selected, setSelected] = useState(null);
  const today = getTodayName();
  const [, forceUpdate] = useState(0);

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
          <button className="store-back" onClick={() => setSelected(null)}>← Все магазины</button>

          {store.photo && (
            <div className="store-detail-photo">
              <img src={store.photo} alt={store.city} />
            </div>
          )}

          <div className="store-detail-header">
            <h1 className="store-detail-city">{store.city}</h1>
            <p className="store-detail-brand">Mardan Boutique</p>
            {(() => { const s = getStoreStatus(store.hours); return (
              <p className={`store-detail-status ${s.open ? "status-open" : "status-closed"}`}>
                <span className="status-dot"></span>{s.label}
              </p>
            ); })()}
          </div>

          <div className="store-detail-body">
            <div className="store-detail-section">
              <h3>Адрес</h3>
              <p>{store.fullAddress}</p>
              <a href={store.mapUrl} target="_blank" rel="noreferrer" className="store-map-link">Открыть на карте →</a>
            </div>

            <div className="store-detail-section">
              <h3>Контакты</h3>
              <p><a href={`tel:${store.phone}`}>{store.phone}</a></p>
            </div>

            <div className="store-detail-section">
              <h3>Часы работы</h3>
              <div className="store-hours-list">
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
            <div key={store.id} className="store-card" onClick={() => setSelected(store.id)}>
              <div className="store-card-photo">
                <img src={store.photo} alt={store.city} />
              </div>
              <div className="store-card-info">
                <h2>{store.city}</h2>
                <p className="store-card-brand">Mardan Boutique</p>
                {(() => { const s = getStoreStatus(store.hours); return (
                  <p className={`store-card-status ${s.open ? "status-open" : "status-closed"}`}>
                    <span className="status-dot"></span>{s.label}
                  </p>
                ); })()}
                <button className="store-card-book" onClick={(e) => { e.stopPropagation(); setSelected(store.id); }}>
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

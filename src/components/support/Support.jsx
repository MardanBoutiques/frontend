import { useState } from "react";
import NavBar from "../navbar/NavBar";
import "./Support.css";

const NAV_ITEMS = [
  { id: "faq", label: "Частые вопросы" },
  { id: "shipping", label: "Доставка" },
  { id: "returns", label: "Возврат и обмен" },
  { id: "payment", label: "Оплата" },
  { id: "sizing", label: "Размеры" },
  { id: "care", label: "Уход за изделием" },
  { id: "terms", label: "Условия использования" },
  { id: "privacy", label: "Конфиденциальность" },
  { id: "contact", label: "Связаться с нами" },
];

const FAQ_ITEMS = [
  {
    q: "Как оформить заказ?",
    a: "Добавьте товары в корзину и оформите заказ на странице оплаты — понадобятся имя, телефон, город и адрес доставки.",
  },
  {
    q: "Как я узнаю, что заказ подтверждён?",
    a: "После оформления с вами свяжется менеджер по указанному телефону или Instagram для подтверждения деталей и оплаты.",
  },
  {
    q: "Можно ли примерить вещь перед покупкой?",
    a: "Да, запишитесь на примерку в бутик в Алматы или Астане — адреса и часы работы на странице «Магазины».",
  },
  {
    q: "Какие размеры доступны?",
    a: "Доступные размеры указаны на странице каждого товара. Если сомневаетесь с выбором — напишите нам, поможем подобрать.",
  },
];

const DELIVERY_METHODS = [
  { name: "Яндекс Доставка", note: "Алматы и Астана" },
  { name: "Самовывоз", note: "из бутика в Алматы или Астане" },
  { name: "Казпочта", note: "по Казахстану" },
  { name: "RIKA", note: "по Казахстану" },
  "СДЭК и KAZPOST",
  { name: "Международная доставка", note: "СНГ, Турция, ОАЭ и другие страны" },
];

const Accordion = ({ q, a, open, onToggle }) => (
  <div className={`support-faq-item ${open ? "open" : ""}`}>
    <button className="support-faq-question" onClick={onToggle} type="button">
      <span>{q}</span>
      <span className="support-faq-icon">{open ? "−" : "+"}</span>
    </button>
    {open && <p className="support-faq-answer">{a}</p>}
  </div>
);

const Support = () => {
  const [openFaq, setOpenFaq] = useState(0);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <NavBar />

      <div className="support-hero">
        <p className="support-eyebrow">Поддержка</p>
        <h1 className="support-title">Чем можем помочь?</h1>

        <div className="support-contact-cards">
          <a href="mailto:mardan.essential@mail.ru" className="support-contact-card">
            <span className="support-contact-label">Email</span>
            <span className="support-contact-value">mardan.essential@mail.ru</span>
          </a>
          <a
            href={`https://wa.me/77071651862`}
            target="_blank"
            rel="noreferrer"
            className="support-contact-card"
          >
            <span className="support-contact-label">WhatsApp — Алматы</span>
            <span className="support-contact-value">+7 707 165 18 62</span>
          </a>
          <a
            href={`https://wa.me/77712699645`}
            target="_blank"
            rel="noreferrer"
            className="support-contact-card"
          >
            <span className="support-contact-label">WhatsApp — Астана</span>
            <span className="support-contact-value">+7 771 269 96 45</span>
          </a>
        </div>
      </div>

      <nav className="support-quicknav">
        {NAV_ITEMS.map((item) => (
          <button key={item.id} onClick={() => scrollTo(item.id)} type="button">
            {item.label}
          </button>
        ))}
      </nav>

      <section id="faq" className="support-section">
        <div className="support-container">
          <p className="support-label">Частые вопросы</p>
          <div className="support-faq-list">
            {FAQ_ITEMS.map((item, i) => (
              <Accordion
                key={item.q}
                q={item.q}
                a={item.a}
                open={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? -1 : i)}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="shipping" className="support-section support-section--soft">
        <div className="support-container">
          <p className="support-label">Доставка</p>
          <p className="support-body">
            Мы отправляем заказы по Казахстану и на международные направления. Точные сроки и стоимость доставки
            менеджер уточнит при подтверждении заказа — они зависят от города и выбранного способа.
          </p>
          <div className="support-delivery-grid">
            {DELIVERY_METHODS.map((m) => {
              const name = typeof m === "string" ? m : m.name;
              const note = typeof m === "string" ? null : m.note;
              return (
                <div key={name} className="support-delivery-item">
                  <span className="support-delivery-name">{name}</span>
                  {note && <span className="support-delivery-note">{note}</span>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="returns" className="support-section">
        <div className="support-container support-container--narrow">
          <p className="support-label">Возврат и обмен</p>
          <p className="support-body support-placeholder">
            Раздел уточняется. Напишите нам в WhatsApp или на почту — поможем с возвратом или обменом
            индивидуально по каждому заказу.
          </p>
        </div>
      </section>

      <section id="payment" className="support-section support-section--soft">
        <div className="support-container">
          <p className="support-label">Оплата</p>
          <div className="support-payment-grid">
            <div className="support-payment-item">
              <span className="support-payment-name">Kaspi</span>
            </div>
            <div className="support-payment-item">
              <span className="support-payment-name">Банковская карта</span>
            </div>
          </div>
        </div>
      </section>

      <section id="sizing" className="support-section">
        <div className="support-container support-container--narrow">
          <p className="support-label">Размеры</p>
          <p className="support-body">
            Доступные размеры указаны на странице каждого товара. Если не уверены с выбором — напишите нам
            артикул или название товара, поможем подобрать подходящий размер, или запишитесь на примерку
            в один из бутиков.
          </p>
        </div>
      </section>

      <section id="care" className="support-section support-section--soft">
        <div className="support-container support-container--narrow">
          <p className="support-label">Уход за изделием</p>
          <p className="support-body">
            Рекомендации по уходу для каждой вещи — в описании товара на его странице (материал, состав
            и инструкции по уходу указаны индивидуально).
          </p>
        </div>
      </section>

      <section id="terms" className="support-section">
        <div className="support-container support-container--narrow">
          <p className="support-label">Условия использования</p>
          <p className="support-body support-placeholder">
            Раздел в разработке.
          </p>
        </div>
      </section>

      <section id="privacy" className="support-section support-section--soft">
        <div className="support-container support-container--narrow">
          <p className="support-label">Конфиденциальность</p>
          <p className="support-body support-placeholder">
            Раздел в разработке.
          </p>
        </div>
      </section>

      <section id="contact" className="support-section support-mission">
        <div className="support-container support-container--narrow">
          <p className="support-label">Связаться с нами</p>
          <h2 className="support-quote">
            Не нашли ответ? Напишите — ответим быстро.
          </h2>
          <div className="support-contact-cards support-contact-cards--dark">
            <a href="mailto:mardan.essential@mail.ru" className="support-contact-card">
              <span className="support-contact-label">Email</span>
              <span className="support-contact-value">mardan.essential@mail.ru</span>
            </a>
            <a href="https://wa.me/77071651862" target="_blank" rel="noreferrer" className="support-contact-card">
              <span className="support-contact-label">WhatsApp — Алматы</span>
              <span className="support-contact-value">+7 707 165 18 62</span>
            </a>
            <a href="https://wa.me/77712699645" target="_blank" rel="noreferrer" className="support-contact-card">
              <span className="support-contact-label">WhatsApp — Астана</span>
              <span className="support-contact-value">+7 771 269 96 45</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default Support;

import { useState } from "react";
import { Link } from "react-router-dom";

const CONTACT_CARDS = [
  { label: "Email", value: "mardan.essential@mail.ru", href: "mailto:mardan.essential@mail.ru" },
  { label: "WhatsApp — Алматы", value: "+7 707 165 18 62", href: "https://wa.me/77071651862" },
  { label: "WhatsApp — Астана", value: "+7 771 269 96 45", href: "https://wa.me/77712699645" },
];

const ContactCards = () => (
  <div className="support-contact-cards">
    {CONTACT_CARDS.map((c) => (
      <a
        key={c.label}
        href={c.href}
        target={c.href.startsWith("http") ? "_blank" : undefined}
        rel={c.href.startsWith("http") ? "noreferrer" : undefined}
        className="support-contact-card"
      >
        <span className="support-contact-label">{c.label}</span>
        <span className="support-contact-value">{c.value}</span>
      </a>
    ))}
  </div>
);

export const SupportOverview = () => (
  <div>
    <p className="support-label">Поддержка</p>
    <h1 className="support-title">Чем можем помочь?</h1>
    <ContactCards />
  </div>
);

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

const Accordion = ({ q, a, open, onToggle }) => (
  <div className={`support-faq-item ${open ? "open" : ""}`}>
    <button className="support-faq-question" onClick={onToggle} type="button">
      <span>{q}</span>
      <span className="support-faq-icon">{open ? "−" : "+"}</span>
    </button>
    {open && <p className="support-faq-answer">{a}</p>}
  </div>
);

export const SupportFaq = () => {
  const [openFaq, setOpenFaq] = useState(0);
  return (
    <div>
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
  );
};

const DELIVERY_METHODS = [
  { name: "Яндекс Доставка", note: "Алматы и Астана" },
  { name: "Самовывоз", note: "из бутика в Алматы или Астане" },
  { name: "Казпочта", note: "по Казахстану" },
  { name: "RIKA", note: "по Казахстану" },
  { name: "СДЭК и KAZPOST", note: null },
  { name: "Международная доставка", note: "СНГ, Турция, ОАЭ и другие страны" },
];

export const SupportShipping = () => (
  <div>
    <p className="support-label">Доставка и возврат</p>
    <p className="support-body">
      Мы отправляем заказы по Казахстану и на международные направления. Точные сроки и стоимость доставки
      менеджер уточнит при подтверждении заказа — они зависят от города и выбранного способа.
    </p>
    <div className="support-delivery-grid">
      {DELIVERY_METHODS.map((m) => (
        <div key={m.name} className="support-delivery-item">
          <span className="support-delivery-name">{m.name}</span>
          {m.note && <span className="support-delivery-note">{m.note}</span>}
        </div>
      ))}
    </div>

    <p className="support-label support-subsection-label">Возврат и обмен</p>
    <p className="support-body support-placeholder">
      Раздел уточняется. Напишите нам в WhatsApp или на почту — поможем с возвратом или обменом
      индивидуально по каждому заказу.
    </p>
  </div>
);

export const SupportTerms = () => (
  <div>
    <p className="support-label">Условия использования</p>
    <p className="support-body support-placeholder">Раздел в разработке.</p>
  </div>
);

export const SupportPrivacy = () => (
  <div>
    <p className="support-label">Конфиденциальность</p>
    <p className="support-body support-placeholder">Раздел в разработке.</p>
  </div>
);

export const SupportContact = () => (
  <div>
    <p className="support-label">Связаться с нами</p>
    <h2 className="support-quote">Не нашли ответ? Напишите — ответим быстро.</h2>
    <ContactCards />
    <p className="support-body" style={{ marginTop: 32 }}>
      Или посмотрите <Link to="/stores" className="support-inline-link">адреса бутиков</Link> и запишитесь на примерку.
    </p>
  </div>
);

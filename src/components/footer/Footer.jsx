import { useState } from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

/**
 * Секция подвала: заголовок со знаком «+», подпункты под ним.
 * Открытая секция всегда одна — состояние живёт в подвале целиком.
 */
const FooterSection = ({ title, className = "", open, onToggle, children }) => {
  return (
    <div className={`footer-col ${className} ${open ? "open" : ""}`}>
      <button
        type="button"
        className="footer-col-head"
        onClick={onToggle}
        aria-expanded={open}
      >
        <span>{title}</span>
        <span className="footer-col-icon" aria-hidden="true">{open ? "−" : "+"}</span>
      </button>

      <div className="footer-col-body">
        <div className="footer-col-list">{children}</div>
      </div>
    </div>
  );
};

const Footer = () => {
  const [openSection, setOpenSection] = useState(null);

  // Повторное нажатие на открытую секцию закрывает её
  const toggle = (key) => setOpenSection((prev) => (prev === key ? null : key));

  return (
    <footer className="footer">
      <div className="footer-content">

        {/* Каталог не раскрывается: по нажатию открывается главное меню,
            чтобы не держать второй список разделов, который разъедется
            с меню при первом же изменении. */}
        <div className="footer-col footer-col-catalogue">
          <button
            type="button"
            className="footer-col-head"
            onClick={() => window.dispatchEvent(new CustomEvent("mardan:open-menu"))}
          >
            <span>Каталог</span>
          </button>
        </div>

        <FooterSection title="Сервис" open={openSection === "service"} onToggle={() => toggle("service")}>
          <Link to="/gift-guide">Подарочный гид</Link>
          <Link to="/stores">Запись на примерку</Link>
        </FooterSection>

        <FooterSection
          title="Контакты"
          className="footer-col-contacts"
          open={openSection === "contacts"}
          onToggle={() => toggle("contacts")}
        >
          <Link to="/stores">Адреса магазинов</Link>
          <a
            href={`https://wa.me/77071651862?text=${encodeURIComponent('Здравствуйте! Хочу записаться на примерку в бутик Mardan (г. Алматы).')}`}
            target="_blank"
            rel="noreferrer"
            className="footer-phone-link"
          >
            <img src="/whatsapp-icon.png" alt="WhatsApp" className="footer-phone-icon" />
            +7 707 165 18 62 — ALMATY
          </a>
          <a
            href={`https://wa.me/77712699645?text=${encodeURIComponent('Здравствуйте! Хочу записаться на примерку в бутик Mardan (г. Астана).')}`}
            target="_blank"
            rel="noreferrer"
            className="footer-phone-link"
          >
            <img src="/whatsapp-icon.png" alt="WhatsApp" className="footer-phone-icon" />
            +7 771 269 96 45 — ASTANA
          </a>
        </FooterSection>

      </div>

      <div className="footer-social">
        <a href="https://www.instagram.com/mardan.boutiques/" target="_blank" rel="noreferrer">
          <img src="/instagram-icon.png" alt="Instagram" />
        </a>
        <a href="https://www.tiktok.com/@mardan.boutiques" target="_blank" rel="noreferrer">
          <img src="/tiktok-icon.png" alt="TikTok" />
        </a>
        <a href="mailto:mardan.essential@mail.ru" title="mardan.essential@mail.ru">
          <img src="/email_icon.png" alt="Email" className="footer-email-icon" />
        </a>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} MardanBoutiques. Все права защищены.</span>
        <div className="footer-bottom-links">
          <Link to="/support/offer">Публичная оферта</Link>
          <span className="footer-bottom-sep" aria-hidden="true">|</span>
          <Link to="/support">Поддержка</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">

        <div className="footer-col">
          <h4>Каталог</h4>
          <Link to="/catalogue?category=suits">Костюмы</Link>
          <Link to="/catalogue?category=knitwear">Трикотаж</Link>
          <Link to="/catalogue?category=jackets">Куртки</Link>
          <Link to="/catalogue?category=accessories">Аксессуары</Link>
        </div>

        <div className="footer-col">
          <h4>Сервис</h4>
          <Link to="/stores">Адреса магазинов</Link>
          <Link to="/giftbox">Подарочный бокс</Link>
          <Link to="/giftcard">Подарочная карта</Link>
        </div>

        <div className="footer-col footer-col-contacts">
          <h4>Контакты</h4>
          <span>+7 707 165 18 62 (ALM)</span>
          <span>+7 771 269 96 45 (AST)</span>
          <div className="footer-social">
            <a href="https://www.instagram.com/mardan.boutiques/" target="_blank" rel="noreferrer">
              <img src="/instagram-icon.png" alt="Instagram" />
            </a>
            <a href="https://wa.me/77071651862" target="_blank" rel="noreferrer">
              <img src="/whatsapp-icon.png" alt="WhatsApp" />
            </a>
          </div>
        </div>


      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Mardan Boutique. Все права защищены.</span>
      </div>
    </footer>
  );
};

export default Footer;

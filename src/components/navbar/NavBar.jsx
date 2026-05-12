import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../../context/CartContext";
import "./NavBar.css";

/* eslint-disable react/prop-types */
const NavBar = ({ children, forHome }) => {
  const navigate = useNavigate();
  const { getTotalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      <div id={`navbar${forHome ? "-home" : ""}`}>
        <div className="burger-menu" onClick={toggleMenu}>
          <img src="/menu.png" alt="Menu" />
        </div>

        <div className="icon" onClick={() => navigate("/")}>
          <img src="/icon.png" alt="Logo" />
        </div>
        <div className="icon-1 cart-icon" onClick={() => navigate("/cart")}>
          <img src="/shopping-bag.png" alt="Cart" />
          {getTotalItems() > 0 && (
            <span className="cart-badge">{getTotalItems()}</span>
          )}
        </div>
      </div>

      {/* Fullscreen Menu */}
      <div className={`sidebar-menu ${menuOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={toggleMenu}>✕</button>
        <nav className="sidebar-nav">
          <a href="#" onClick={() => { navigate("/catalogue?category=suits"); setMenuOpen(false); }}>Костюмы</a>
          <a href="#" onClick={() => { navigate("/catalogue?category=shirts"); setMenuOpen(false); }}>Рубашки</a>
          <a href="#" onClick={() => { navigate("/catalogue?category=knitwear"); setMenuOpen(false); }}>Трикотаж</a>
          <a href="#" onClick={() => { navigate("/catalogue?category=accessories"); setMenuOpen(false); }}>Аксессуары</a>
          <a href="#" onClick={() => { navigate("/giftbox"); setMenuOpen(false); }}>Подарочный бокс</a>
          <a href="#" onClick={() => { navigate("/giftcard"); setMenuOpen(false); }}>Подарочная карта</a>
          <a href="#" onClick={() => { navigate("/stores"); setMenuOpen(false); }}>Адреса магазинов</a>
        </nav>
      </div>
    </>
  );
};

export default NavBar;

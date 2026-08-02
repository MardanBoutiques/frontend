import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../../context/CartContext";
import "./NavBar.css";

/* eslint-disable react/prop-types */
const NavBar = ({ children, forHome }) => {
  const navigate = useNavigate();
  const { getTotalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accessoriesOpen, setAccessoriesOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    setAccessoriesOpen(false);
  };

  const goTo = (path) => {
    navigate(path);
    setMenuOpen(false);
    setAccessoriesOpen(false);
  };

  const accessorySubcategories = [
    { label: 'Все аксессуары', value: null },
    { label: 'Галстуки', value: 'ties' },
    { label: 'Платки', value: 'pocket_squares' },
    { label: 'Кардхолдеры', value: 'cardholders' },
    { label: 'Клатчи', value: 'clutches' },
    { label: 'Дипломаты', value: 'briefcases' },
    { label: 'Портмоне', value: 'wallets' },
  ];

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
      <div className={`sidebar-menu ${menuOpen ? "open" : ""} ${accessoriesOpen ? "drilled" : ""}`}>
        <button className="close-btn" onClick={toggleMenu}>✕</button>
        <div className="sidebar-columns">
          <nav className="sidebar-nav sidebar-nav-main">
            <a href="#" onClick={() => goTo("/catalogue?category=suits")}>Костюмы</a>
            <a href="#" onClick={() => goTo("/catalogue?category=shirts")}>Рубашки</a>
            <a href="#" onClick={() => goTo("/catalogue?category=pants")}>Брюки</a>
            <a
              href="#"
              className={accessoriesOpen ? "active" : ""}
              onClick={(e) => { e.preventDefault(); setAccessoriesOpen(true); }}
            >
              Аксессуары
            </a>
            <a href="#" onClick={() => goTo("/giftbox")}>Подарочный бокс</a>
            <a href="#" onClick={() => goTo("/giftcard")}>Подарочная карта</a>
            <a href="#" onClick={() => goTo("/stores")}>Адреса магазинов</a>
          </nav>

          <nav className="sidebar-nav sidebar-nav-sub">
            <button className="sidebar-back" onClick={() => setAccessoriesOpen(false)}>← Назад</button>
            {accessorySubcategories.map((sub) => (
              <a
                key={sub.label}
                href="#"
                className={sub.value ? "sidebar-subnav-item" : "sidebar-subnav-all"}
                onClick={() => goTo(sub.value ? `/catalogue?category=accessories&subcategory=${sub.value}` : '/catalogue?category=accessories')}
              >
                {sub.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default NavBar;

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
  const [outerwearOpen, setOuterwearOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    setAccessoriesOpen(false);
    setOuterwearOpen(false);
  };

  const goTo = (path) => {
    navigate(path);
    setMenuOpen(false);
    setAccessoriesOpen(false);
    setOuterwearOpen(false);
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

  // Пальто/тренчи/куртки пока не выводим — товаров ещё нет
  const outerwearSubcategories = [
    { label: 'Жилеты', value: 'vests' },
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
      <div className={`sidebar-menu ${menuOpen ? "open" : ""} ${(accessoriesOpen || outerwearOpen) ? "drilled" : ""}`}>
        <div className="sidebar-topbar">
          {(accessoriesOpen || outerwearOpen) && (
            <button
              className="back-btn"
              onClick={() => { setAccessoriesOpen(false); setOuterwearOpen(false); }}
            >&lt;</button>
          )}
          <button className="close-btn" onClick={toggleMenu}>✕</button>
        </div>
        <div className="sidebar-columns">
          <nav className="sidebar-nav sidebar-nav-main">
            <a href="#" onClick={() => goTo("/catalogue?category=suits")}>Костюмы</a>
            <a href="#" onClick={() => goTo("/catalogue?category=shirts")}>Рубашки</a>
            <a href="#" onClick={() => goTo("/catalogue?category=pants")}>Брюки</a>
            <a
              href="#"
              className={outerwearOpen ? "active" : ""}
              onClick={(e) => { e.preventDefault(); setOuterwearOpen(true); }}
            >
              Верхняя одежда
            </a>
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

          {accessoriesOpen && (
            <nav className="sidebar-nav sidebar-nav-sub">
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
          )}

          {outerwearOpen && (
            <nav className="sidebar-nav sidebar-nav-sub">
              {outerwearSubcategories.map((sub) => (
                <a
                  key={sub.label}
                  href="#"
                  className={sub.value ? "sidebar-subnav-item" : "sidebar-subnav-all"}
                  onClick={() => goTo(sub.value ? `/catalogue?category=outerwear&subcategory=${sub.value}` : '/catalogue?category=outerwear')}
                >
                  {sub.label}
                </a>
              ))}
            </nav>
          )}
        </div>
      </div>
    </>
  );
};

export default NavBar;

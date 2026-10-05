import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../../context/CartContext";
import "./NavBar.css";

/* eslint-disable react/prop-types */
const NavBar = ({ children, forHome }) => {
  const navigate = useNavigate();
  const { getTotalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [clothingOpen, setClothingOpen] = useState(false);
  const [outerwearOpen, setOuterwearOpen] = useState(false);
  const [accessoriesOpen, setAccessoriesOpen] = useState(false);
  const [giftGuideOpen, setGiftGuideOpen] = useState(false);

  const closeSubmenus = () => {
    setClothingOpen(false);
    setOuterwearOpen(false);
    setAccessoriesOpen(false);
    setGiftGuideOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    closeSubmenus();
  };

  const goTo = (path) => {
    navigate(path);
    setMenuOpen(false);
    closeSubmenus();
  };

  const openSubmenu = (setter) => (e) => {
    e.preventDefault();
    closeSubmenus();
    setter(true);
  };

  const clothingItems = [
    { label: 'Костюмы', path: '/catalogue?category=suits&subcategory=set' },
    { label: 'Пиджаки', path: '/catalogue?category=suits&subcategory=jacket' },
    // Брюки к костюмам уже есть в общей категории "Брюки" — ведём туда напрямую,
    // а не в отдельный suit_type, чтобы не дублировать и не переносить товары.
    { label: 'Брюки', path: '/catalogue?category=pants' },
    { label: 'Рубашки', path: '/catalogue?category=shirts' },
    { label: 'Трикотаж и свитера', path: '/catalogue?category=knitwear' },
    { label: 'Поло и футболки', path: '/catalogue?category=polo' },
  ];

  // Пальто/тренчи пока не выводим — товаров ещё нет
  const outerwearItems = [
    { label: 'Жилеты', path: '/catalogue?category=outerwear&subcategory=vests' },
    { label: 'Куртки', path: '/catalogue?category=outerwear&subcategory=jackets' },
    { label: 'Пальто', path: '/catalogue?category=outerwear&subcategory=coats' },
  ];

  const accessoryItems = [
    { label: 'Галстуки', path: '/catalogue?category=accessories&subcategory=ties' },
    { label: 'Платки', path: '/catalogue?category=accessories&subcategory=pocket_squares' },
    { label: 'Кардхолдеры', path: '/catalogue?category=accessories&subcategory=cardholders' },
    { label: 'Клатчи', path: '/catalogue?category=accessories&subcategory=clutches' },
    { label: 'Дипломаты', path: '/catalogue?category=accessories&subcategory=briefcases' },
    { label: 'Портмоне', path: '/catalogue?category=accessories&subcategory=wallets' },
    { label: 'Ремни', path: '/catalogue?category=accessories&subcategory=belts' },
    { label: 'Носки', path: '/catalogue?category=accessories&subcategory=socks' },
  ];

  const giftGuideItems = [
    { label: 'Подарочный бокс', path: '/giftbox' },
    { label: 'Подарочная карта', path: '/giftcard' },
  ];

  const anySubmenuOpen = clothingOpen || outerwearOpen || accessoriesOpen || giftGuideOpen;

  return (
    <>
      <div id={`navbar${forHome ? "-home" : ""}`}>
        <div className="burger-menu" onClick={toggleMenu}>
          <img src="/menu.png" alt="Menu" />
        </div>

        <div className="icon" onClick={() => navigate("/")}>
          <img src="/icon.png" alt="Logo" />
        </div>
        <nav className="navbar-links">
          <a href="#" onClick={(e) => { e.preventDefault(); navigate("/about"); }}>О компании</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate("/vacancies"); }}>Вакансии</a>
        </nav>
        <div className="icon-1 cart-icon" onClick={() => navigate("/cart")}>
          <img src="/shopping-bag.png" alt="Cart" />
          {getTotalItems() > 0 && (
            <span className="cart-badge">{getTotalItems()}</span>
          )}
        </div>
      </div>

      {/* Dims the rest of the site while the menu is open, so focus stays on the menu */}
      <div className={`sidebar-overlay ${menuOpen ? "open" : ""}`} onClick={toggleMenu} />

      {/* Fullscreen Menu */}
      <div className={`sidebar-menu ${menuOpen ? "open" : ""} ${anySubmenuOpen ? "drilled" : ""}`}>
        <div className="sidebar-topbar">
          {anySubmenuOpen && (
            <button className="back-btn" onClick={closeSubmenus}>&lt;</button>
          )}
          <button className="close-btn" onClick={toggleMenu}>✕</button>
        </div>
        <div className="sidebar-columns">
          <nav className="sidebar-nav sidebar-nav-main">
            <a href="#" onClick={() => goTo("/catalogue?category=new")}>Новые поступления</a>
            <a
              href="#"
              className={clothingOpen ? "active" : ""}
              onClick={openSubmenu(setClothingOpen)}
            >
              Одежда
            </a>
            <a
              href="#"
              className={outerwearOpen ? "active" : ""}
              onClick={openSubmenu(setOuterwearOpen)}
            >
              Верхняя одежда
            </a>
            <a href="#" onClick={() => goTo("/catalogue?category=shoes")}>Обувь</a>
            <a
              href="#"
              className={accessoriesOpen ? "active" : ""}
              onClick={openSubmenu(setAccessoriesOpen)}
            >
              Аксессуары
            </a>
            <a
              href="#"
              className={giftGuideOpen ? "active" : ""}
              onClick={openSubmenu(setGiftGuideOpen)}
            >
              Подарочный гид
            </a>
            <a href="#" onClick={() => goTo("/stores")}>Магазины</a>
            {/* В навбаре эти ссылки не помещаются на мобильных — дублируем их здесь */}
            <a href="#" className="sidebar-mobile-only" onClick={() => goTo("/about")}>О компании</a>
            <a href="#" className="sidebar-mobile-only" onClick={() => goTo("/vacancies")}>Вакансии</a>
          </nav>

          {clothingOpen && (
            <nav className="sidebar-nav sidebar-nav-sub">
              <p className="sidebar-subnav-heading">Одежда</p>
              {clothingItems.map((sub) => (
                <a key={sub.label} href="#" className="sidebar-subnav-item" onClick={() => goTo(sub.path)}>
                  {sub.label}
                </a>
              ))}
            </nav>
          )}

          {outerwearOpen && (
            <nav className="sidebar-nav sidebar-nav-sub">
              <p className="sidebar-subnav-heading">Верхняя одежда</p>
              {outerwearItems.map((sub) => (
                <a key={sub.label} href="#" className="sidebar-subnav-item" onClick={() => goTo(sub.path)}>
                  {sub.label}
                </a>
              ))}
            </nav>
          )}

          {accessoriesOpen && (
            <nav className="sidebar-nav sidebar-nav-sub">
              <p className="sidebar-subnav-heading">Аксессуары</p>
              {accessoryItems.map((sub) => (
                <a key={sub.label} href="#" className="sidebar-subnav-item" onClick={() => goTo(sub.path)}>
                  {sub.label}
                </a>
              ))}
            </nav>
          )}

          {giftGuideOpen && (
            <nav className="sidebar-nav sidebar-nav-sub">
              <p className="sidebar-subnav-heading">Подарочный гид</p>
              {giftGuideItems.map((sub) => (
                <a key={sub.label} href="#" className="sidebar-subnav-item" onClick={() => goTo(sub.path)}>
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

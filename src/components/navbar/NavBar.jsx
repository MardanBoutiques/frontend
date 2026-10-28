import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
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
  const closeSubmenus = () => {
    setClothingOpen(false);
    setOuterwearOpen(false);
    setAccessoriesOpen(false);
  };

  // Подвал и главная просят открыть меню — слушаем событие, чтобы не тянуть
  // состояние меню через всё приложение ради пары кнопок. В detail.submenu
  // можно передать раздел, который нужно сразу раскрыть.
  useEffect(() => {
    const open = (event) => {
      setMenuOpen(true);
      setClothingOpen(false);
      setOuterwearOpen(false);
      setAccessoriesOpen(false);

      const submenu = event.detail && event.detail.submenu;
      if (submenu === "clothing") setClothingOpen(true);
      else if (submenu === "outerwear") setOuterwearOpen(true);
      else if (submenu === "accessories") setAccessoriesOpen(true);
    };
    window.addEventListener("mardan:open-menu", open);
    return () => window.removeEventListener("mardan:open-menu", open);
  }, []);

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
    { label: 'Подтяжки', path: '/catalogue?category=accessories&subcategory=suspenders' },
  ];

  const anySubmenuOpen = clothingOpen || outerwearOpen || accessoriesOpen;

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
          <button type="button" onClick={() => navigate("/about")}>О компании</button>
          <button type="button" onClick={() => navigate("/vacancies")}>Вакансии</button>
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
            <button className="back-btn" onClick={closeSubmenus} aria-label="Назад">
              <img src="/left-chevron.png" alt="" />
            </button>
          )}
          <button className="close-btn" onClick={toggleMenu} aria-label="Закрыть меню">
            <img src="/close.png" alt="" />
          </button>
        </div>
        <div className="sidebar-columns">
          <nav className={`sidebar-nav sidebar-nav-main ${anySubmenuOpen ? "has-active" : ""}`}>
            <button type="button" onClick={() => goTo("/catalogue?category=new")}>Новые поступления</button>
            <button
              type="button"
              className={clothingOpen ? "active" : ""}
              onClick={openSubmenu(setClothingOpen)}
            >
              Одежда
            </button>
            <button
              type="button"
              className={outerwearOpen ? "active" : ""}
              onClick={openSubmenu(setOuterwearOpen)}
            >
              Верхняя одежда
            </button>
            <button type="button" onClick={() => goTo("/catalogue?category=shoes")}>Обувь</button>
            <button
              type="button"
              className={accessoriesOpen ? "active" : ""}
              onClick={openSubmenu(setAccessoriesOpen)}
            >
              Аксессуары
            </button>
            <button type="button" onClick={() => goTo("/gift-guide")}>Подарочный гид</button>
            <button type="button" onClick={() => goTo("/stores")}>Магазины</button>
            {/* В навбаре эти ссылки не помещаются на мобильных — дублируем их здесь */}
            <button type="button" className="sidebar-mobile-only" onClick={() => goTo("/about")}>О компании</button>
            <button type="button" className="sidebar-mobile-only" onClick={() => goTo("/vacancies")}>Вакансии</button>
          </nav>

          {clothingOpen && (
            <nav className="sidebar-nav sidebar-nav-sub">
              <p className="sidebar-subnav-heading">Одежда</p>
              {clothingItems.map((sub) => (
                <button
                  key={sub.label}
                  type="button"
                  className="sidebar-subnav-item"
                  onClick={() => goTo(sub.path)}
                >
                  {sub.label}
                </button>
              ))}
            </nav>
          )}

          {outerwearOpen && (
            <nav className="sidebar-nav sidebar-nav-sub">
              <p className="sidebar-subnav-heading">Верхняя одежда</p>
              {outerwearItems.map((sub) => (
                <button
                  key={sub.label}
                  type="button"
                  className="sidebar-subnav-item"
                  onClick={() => goTo(sub.path)}
                >
                  {sub.label}
                </button>
              ))}
            </nav>
          )}

          {accessoriesOpen && (
            <nav className="sidebar-nav sidebar-nav-sub">
              <p className="sidebar-subnav-heading">Аксессуары</p>
              {accessoryItems.map((sub) => (
                <button
                  key={sub.label}
                  type="button"
                  className="sidebar-subnav-item"
                  onClick={() => goTo(sub.path)}
                >
                  {sub.label}
                </button>
              ))}
            </nav>
          )}

        </div>
      </div>
    </>
  );
};

export default NavBar;

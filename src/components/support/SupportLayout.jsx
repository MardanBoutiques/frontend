import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import NavBar from "../navbar/NavBar";
import { useSupportPages } from "./useSupportPages";
import "./Support.css";

/* Названия и порядок разделов приходят из админки. Этот список — то, что
   видно, пока ответ не пришёл, и если API недоступен: шесть подписей меню
   короче любого запроса, и оставлять раздел с пустым меню незачем. */
const FALLBACK_ITEMS = [
  { to: "/support/faq", label: "Частые вопросы" },
  { to: "/support/shipping", label: "Доставка и возврат" },
  { to: "/support/terms", label: "Условия использования" },
  { to: "/support/offer", label: "Публичная оферта" },
  { to: "/support/privacy", label: "Конфиденциальность" },
  { to: "/support/contact", label: "Связаться с нами" },
];

const SupportLayout = () => {
  const { pages } = useSupportPages();
  const navItems = pages.length
    ? pages.map((page) => ({ to: `/support/${page.slug}`, label: page.menu_title }))
    : FALLBACK_ITEMS;

  // key по адресу: при смене раздела содержимое пересоздаётся,
  // и анимация въезда запускается заново
  const { pathname } = useLocation();
  // На телефоне список разделов свёрнут: шесть длинных подписей в ленту
  // не помещаются, а прокрутку вбок никто не замечает.
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => setNavOpen(false), [pathname]);

  const current = navItems.find((item) => item.to === pathname);

  return (
    <>
      <NavBar />
      <div className="support-shell">
        <aside className={`support-sidebar ${navOpen ? "open" : ""}`}>
          <button
            type="button"
            className="support-nav-toggle"
            onClick={() => setNavOpen((o) => !o)}
            aria-expanded={navOpen}
          >
            <span>{current ? current.label : "Разделы"}</span>
            <span className="support-nav-toggle-icon">{navOpen ? "−" : "+"}</span>
          </button>

          <nav>
            {/* Обёртка нужна телефону, чтобы было что схлопывать по высоте;
                на десктопе она растворяется через display: contents */}
            <div className="support-nav-list">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `support-sidebar-link${isActive ? " active" : ""}`}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </nav>
        </aside>
        <main className="support-content" key={pathname}>
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default SupportLayout;

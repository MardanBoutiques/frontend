import { NavLink, Outlet } from "react-router-dom";
import NavBar from "../navbar/NavBar";
import "./Support.css";

const NAV_ITEMS = [
  { to: "/support/faq", label: "Частые вопросы" },
  { to: "/support/shipping", label: "Доставка и возврат" },
  { to: "/support/terms", label: "Условия использования" },
  { to: "/support/privacy", label: "Конфиденциальность" },
  { to: "/support/contact", label: "Связаться с нами" },
];

const SupportLayout = () => {
  return (
    <>
      <NavBar />
      <div className="support-shell">
        <aside className="support-sidebar">
          <nav>
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `support-sidebar-link${isActive ? " active" : ""}`}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="support-content">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default SupportLayout;

import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const тип = useNavigationType();

  useEffect(() => {
    // Браузер при «назад» возвращает прокрутку сам и по своим меркам: в
    // одностраничном сайте он успевает сделать это раньше, чем список
    // отрисован, и спорит с тем местом, которое восстанавливает каталог.
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    // Назад и вперёд — не новая страница, а возврат к уже виденной:
    // там своё место прокрутки восстанавливает сама страница (каталог).
    if (тип === "POP") return;

    // Именно instant: с глобальным scroll-behavior: smooth переход на новую
    // страницу иначе превращался бы в долгую прокрутку наверх.
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname, тип]);

  return null;
};

export default ScrollToTop;

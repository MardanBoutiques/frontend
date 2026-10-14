import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import "./RouteVeil.css";

// Длительность стекла на переходе. Столько же держится белое поле под ним.
const VEIL_MS = 350;

/**
 * Стекло на каждом переходе по сайту: страница под ним размывается, а новая
 * появляется уже готовой. Живёт один раз на всё приложение, рядом с Routes.
 */
const RouteVeil = () => {
  const { pathname, search, state } = useLocation();
  const [on, setOn] = useState(true);
  const prevPath = useRef(pathname);

  useEffect(() => {
    // Переход между карточками товара — это смена оттенка. У неё своя
    // анимация (белая завеса внутри карточки), стекло там лишнее.
    // Переходы внутри одного раздела своей анимации не требуют:
    // карточки товара меняются белой завесой, разделы поддержки — скольжением.
    const insideSameArea = ['/product/', '/support/'].some(
      (prefix) => prevPath.current.startsWith(prefix) && pathname.startsWith(prefix)
    );
    prevPath.current = pathname;

    // navigate(..., { state: { noVeil: true } }) — переход без стекла
    if (insideSameArea || state?.noVeil) {
      setOn(false);
      return undefined;
    }

    setOn(true);
    const timer = setTimeout(() => setOn(false), VEIL_MS);
    return () => clearTimeout(timer);
  }, [pathname, search]);

  return <div className={`route-veil ${on ? "on" : ""}`} aria-hidden="true" />;
};

export default RouteVeil;

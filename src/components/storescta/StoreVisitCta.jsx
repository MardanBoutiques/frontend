/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import openAxios from '../../api/axios';
import { adaptiveBackgroundFor } from '../../utils/imageUrl';
import './StoreVisitCta.css';

// Тот же слот фото, что на главной
const PHOTO_SLOT = 'section6';

/**
 * Приглашение в бутики: слева синий блок с текстом и кнопкой, справа фото.
 * Стоит внизу главной и внизу карточки товара. Запись с фото можно передать
 * сверху — иначе компонент берёт её сам, чтобы не зависеть от страницы.
 *
 * variant="product" делит блок 60/40 вместо пополам: так фото встаёт ровно
 * под правой колонкой карточки товара.
 */
const StoreVisitCta = ({ slot, variant }) => {
  const navigate = useNavigate();
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const [ownSlot, setOwnSlot] = useState(null);

  useEffect(() => {
    if (slot !== undefined) return undefined;

    let alive = true;
    openAxios.get('/api/homepage-images/')
      .then((res) => {
        if (!alive) return;
        setOwnSlot(res.data.find((i) => i.image_type === PHOTO_SLOT) || null);
      })
      .catch(() => {});

    return () => { alive = false; };
  }, [slot]);

  // Текст проявляется, когда блок доходит до экрана
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setInView(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        setInView(true);
        observer.disconnect();
      },
      { threshold: 0.4 }
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  // Фото для компьютера и для телефона задаются в админке по отдельности.
  const фон = adaptiveBackgroundFor(slot !== undefined ? slot : ownSlot);

  return (
    <section
      className={`svc ${variant ? `svc-${variant}` : ''} ${inView ? 'in' : ''}`}
      ref={ref}
    >
      <div className="svc-text">
        <p className="svc-desc svc-reveal">
          Ждем вас в наших бутиках для примерки, подбора идеального размера и консультации стилистов.
        </p>
        <button
          type="button"
          className="svc-btn svc-reveal"
          style={{ transitionDelay: '160ms' }}
          onClick={() => navigate('/stores')}
        >
          Записаться
        </button>
      </div>
      <div
        className={`svc-photo ${фон.className}`}
        style={{
          ...(фон.style || {}),
          backgroundColor: фон.className ? 'transparent' : '#1a1a1a',
        }}
      />
    </section>
  );
};

export default StoreVisitCta;

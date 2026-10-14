/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import openAxios from '../../api/axios';
import { getImageUrl } from '../../utils/imageUrl';
import './StoreVisitCta.css';

// Тот же слот фото, что на главной
const PHOTO_SLOT = 'section6';

/**
 * Приглашение в бутики: слева синий блок с текстом и кнопкой, справа фото.
 * Стоит внизу главной и внизу карточки товара. Фото можно передать сверху —
 * иначе компонент берёт его сам, чтобы не зависеть от страницы.
 *
 * variant="product" делит блок 60/40 вместо пополам: так фото встаёт ровно
 * под правой колонкой карточки товара.
 */
const StoreVisitCta = ({ photo, variant }) => {
  const navigate = useNavigate();
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const [ownPhoto, setOwnPhoto] = useState(null);

  useEffect(() => {
    if (photo !== undefined) return undefined;

    let alive = true;
    openAxios.get('/api/homepage-images/')
      .then((res) => {
        if (!alive) return;
        const found = res.data.find((i) => i.image_type === PHOTO_SLOT);
        setOwnPhoto(found ? getImageUrl(found.image) : null);
      })
      .catch(() => {});

    return () => { alive = false; };
  }, [photo]);

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

  const src = photo !== undefined ? photo : ownPhoto;

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
        className="svc-photo"
        style={{
          backgroundImage: src ? `url(${src})` : 'none',
          backgroundColor: src ? 'transparent' : '#1a1a1a',
        }}
      />
    </section>
  );
};

export default StoreVisitCta;

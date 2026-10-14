import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import NavBar from "../navbar/NavBar";
import StoreVisitCta from '../storescta/StoreVisitCta';
import api from "../../api/axios";
import { useCart } from "../../context/CartContext";
import { getImageUrl } from "../../utils/imageUrl";
import "./ProductView.css";

const Accordion = ({ title, children, open, onToggle }) => (
  <div className={`pv-accordion ${open ? 'open' : ''}`}>
    <button className="pv-accordion-head" onClick={onToggle} type="button">
      <span>{title}</span>
      <span className="pv-accordion-icon">{open ? '−' : '+'}</span>
    </button>
    {/* Содержимое не размонтируется — иначе высоту нечего анимировать */}
    <div className="pv-accordion-wrap">
      <div className="pv-accordion-clip">
        <div className="pv-accordion-body">{children}</div>
      </div>
    </div>
  </div>
);

const TruckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
    <path d="M2 7h11v9H2zM13 10h4.5l2.5 3v3h-7z" />
    <circle cx="6" cy="18" r="1.6" />
    <circle cx="16.5" cy="18" r="1.6" />
  </svg>
);

const BoxIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
    <path d="M12 3l8 4.2v9L12 20.4 4 16.2v-9z" />
    <path d="M4 7.2l8 4.2 8-4.2M12 11.4v9" />
  </svg>
);

const SpecRow = ({ label, value }) =>
  value ? (
    <div className="pv-spec-row">
      <span className="pv-spec-label">{label}</span>
      <span className="pv-spec-value">{value}</span>
    </div>
  ) : null;

const ProductView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  // Весь каталог держим в памяти: по нему строятся свотчи, и из него же
  // мгновенно берётся товар при переключении оттенка — без похода на сервер.
  const [catalogue, setCatalogue] = useState([]);
  const catalogueRef = useRef([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [sizesOpen, setSizesOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  // Полоса оттенков показывает 4 карточки; счётчик на четвёртой пропадает,
  // как только её пролистали и остальные стали видны.
  const [variantsScrolled, setVariantsScrolled] = useState(false);
  // Блок покупки прилип к низу экрана (лежит на фото) или уже встал на место
  const [buyStuck, setBuyStuck] = useState(false);
  const buyRef = useRef(null);
  // Фото закрывается белым, и уже под ним подменяется товар
  const [veilOn, setVeilOn] = useState(false);
  const swapTimer = useRef(null);

  // На мобильном фото листаются свайпом, полоса снизу показывает позицию —
  // как на карточке в каталоге.
  const galleryRef = useRef(null);

  const handleGalleryScroll = () => {
    const el = galleryRef.current;
    if (!el || !el.clientWidth) return;
    setPhotoIndex(Math.round(el.scrollLeft / el.clientWidth));
  };

  // Клик по оттенку: кадр сразу закрывается белым, через 0,3с
  // под ним уже другой цвет, и белое так же сразу снимается.
  const openVariant = (variantId) => {
    if (String(variantId) === String(id)) return;
    setVeilOn(true);
    clearTimeout(swapTimer.current);
    swapTimer.current = setTimeout(() => navigate(`/product/${variantId}`), 300);
  };

  useEffect(() => () => clearTimeout(swapTimer.current), []);

  const toggleAccordion = (key) => {
    setOpenAccordion((prev) => (prev === key ? null : key));
  };

  useEffect(() => {
    // Куда вернуть из корзины по «Продолжить покупки»
    sessionStorage.setItem('lastProductPath', `/product/${id}`);

    setSelectedSize('');
    setSizesOpen(false);
    setOpenAccordion(null);
    setPhotoIndex(0);
    setVariantsScrolled(false);
    setVeilOn(false);

    // Товар уже загружен вместе с каталогом — подменяем содержимое на месте,
    // без экрана загрузки и без прыжка к началу страницы.
    const known = catalogueRef.current.find((p) => String(p.id) === String(id));
    if (known) {
      setProduct(known);
      setLoading(false);
    } else {
      window.scrollTo(0, 0);
      setLoading(true);
    }

    // Всё равно дочитываем карточку: в списке может не быть части полей
    api.get(`/${id}`)
      .then((response) => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
        setLoading(false);
      });
  }, [id]);

  // Стекло нужно, только пока блок лежит на фотографии. Прилип — значит его
  // нижний край совпадает с нижним краем экрана.
  useEffect(() => {
    const update = () => {
      const buy = buyRef.current;
      if (!buy) return;
      setBuyStuck(buy.getBoundingClientRect().bottom >= window.innerHeight - 1);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);

    // Пока фото не загрузились, страница короткая и название попадает в экран —
    // без этого панель гасла бы сразу при открытии и больше не возвращалась.
    const observer = new ResizeObserver(update);
    observer.observe(document.body);

    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      observer.disconnect();
    };
  }, [product]);

  useEffect(() => {
    api.get('/')
      .then((response) => {
        catalogueRef.current = response.data;
        setCatalogue(response.data);
      })
      .catch(() => setCatalogue([]));
  }, []);

  // Другие оттенки того же товара — по артикулу, как в каталоге
  const variants = useMemo(() => {
    if (!product || catalogue.length === 0) return [];
    const same = product.article
      ? catalogue.filter((p) => p.article === product.article)
      : catalogue.filter((p) => p.name === product.name && !p.article);
    return same.length > 1 ? same : [];
  }, [product, catalogue]);

  if (loading) {
    return (
      <>
        <NavBar />
        <div className="pv-state" />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <NavBar />
        <div className="pv-state">Товар не найден</div>
      </>
    );
  }

  const isAccessory = product.category === 'accessories';

  const getSizes = () => {
    if (product.available_sizes) {
      return product.available_sizes.split(',').map((s) => s.trim()).filter(Boolean);
    }
    if (isAccessory) return [];
    if (product.category === 'suits') return ['46', '48', '50', '52', '54', '56'];
    return ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  };
  const sizes = getSizes();

  const photos = [product.image, ...(product.images || []).map((i) => i.image)].filter(Boolean);

  // Подзаголовок: цвет · краткое описание · состав
  const subtitle = [product.colors, product.description, product.material]
    .filter(Boolean)
    .join(' · ');

  const cartButtonLabel = () => {
    if (!isAccessory && !selectedSize) return 'Выбрать размер';
    return `Добавить в корзину${selectedSize ? ` — ${selectedSize}` : ''}`;
  };

  const handleCartButtonClick = () => {
    if (!isAccessory && !selectedSize) {
      setSizesOpen((o) => !o);
      return;
    }
    handleAddToCart();
  };

  const handleAddToCart = () => {
    if (!isAccessory && !selectedSize) {
      setSizesOpen(true);
      return;
    }
    addToCart(product, isAccessory ? 'Один размер' : selectedSize, 1);
    navigate('/cart', { state: { noVeil: true } });
  };

  return (
    <>
      <NavBar />
      <div className="pv-layout">
        {/* Все фото идут одно за другим, с таким же зазором, как между
            карточками товара в каталоге */}
        <div className="pv-gallery-wrap">
          <div
            className="pv-gallery"
            key={product.id}
            ref={galleryRef}
            onScroll={handleGalleryScroll}
          >
            {photos.length > 0 ? (
              photos.map((photo, i) => (
                <div className="pv-photo" key={i}>
                  <img src={getImageUrl(photo)} alt={`${product.name} — фото ${i + 1}`} />
                </div>
              ))
            ) : (
              <div className="pv-photo pv-photo-empty"><span>👔</span></div>
            )}
          </div>

          {/* Белая завеса на время смены оттенка */}
          <div className={`pv-gallery-veil ${veilOn ? 'on' : ''}`} aria-hidden="true" />

          {/* Полоса-индикатор под фото — только на мобильном */}
          {photos.length > 1 && (
            <div className="pv-progress">
              <span
                style={{
                  width: `${100 / photos.length}%`,
                  left: `${(100 / photos.length) * photoIndex}%`,
                }}
              />
            </div>
          )}
        </div>

        <aside className="pv-info">
          {/* Тот же товар в других оттенках */}
          {variants.length > 1 && (
            <div
              className="pv-variants"
              onScroll={(e) => setVariantsScrolled(e.currentTarget.scrollLeft > 4)}
            >
              {variants.map((v, i) => (
                <button
                  key={v.id}
                  type="button"
                  className={`pv-variant ${String(v.id) === String(id) ? 'active' : ''}`}
                  title={v.colors || v.name}
                  onClick={() => openVariant(v.id)}
                >
                  {v.image ? (
                    <img src={getImageUrl(v.image)} alt={v.colors || v.name} />
                  ) : (
                    <span className="pv-variant-empty" />
                  )}
                  {i === 3 && variants.length > 4 && !variantsScrolled && (
                    <span className="pv-variant-more">+{variants.length - 4}</span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* На телефоне этот блок лежит на фото, прижатый к низу экрана,
              и встаёт на своё место, когда до него долистали */}
          <div className={`pv-buy ${buyStuck ? 'stuck' : ''}`} ref={buyRef}>
            <div className="pv-head">
              <h1 className="pv-title">{product.name}</h1>
              <span className="pv-price">{Math.round(product.price).toLocaleString('ru-RU')} KZT</span>
            </div>
            {subtitle && <p className="pv-subtitle">{subtitle}</p>}

            {/* Размеры раскрываются над кнопкой */}
            {!isAccessory && sizesOpen && (
              <div className="pv-sizes">
                {sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`pv-size ${selectedSize === size ? 'selected' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            )}

            {/* Одна кнопка на два шага: раскрыть размеры → добавить и уйти в корзину */}
            <button type="button" className="pv-cart-btn" onClick={handleCartButtonClick}>
              {cartButtonLabel()}
            </button>
          </div>

          <p className="pv-ship-note">
            <span className="pv-check">✓</span> Возврат в течение 14 дней
          </p>

          {/* Размер и посадка — у аксессуаров размеров нет */}
          {!isAccessory && (
            <Accordion
              title="Размер и посадка"
              open={openAccordion === 'fit'}
              onToggle={() => toggleAccordion('fit')}
            >
              <div className="pv-specs">
                <SpecRow label="Доступные размеры" value={product.available_sizes || sizes.join(', ')} />
                <SpecRow label="Посадка" value={product.fit} />
                <SpecRow label="Стиль" value={product.style} />
              </div>
              <p className="pv-note">
                Не уверены с размером? Приходите в бутик — стилисты помогут подобрать.
              </p>
            </Accordion>
          )}

          {/* Детали и уход */}
          <Accordion
            title="Детали и уход"
            open={openAccordion === 'details'}
            onToggle={() => toggleAccordion('details')}
          >
            {product.detailed_description && (
              <p className="pv-text">{product.detailed_description}</p>
            )}
            <div className="pv-specs">
              <SpecRow label="Артикул" value={product.article} />
              <SpecRow label="Цвет" value={product.colors} />
              <SpecRow label="Состав" value={product.material} />
              <SpecRow label="Фактура" value={product.texture} />
              <SpecRow label="Сезон" value={product.season} />
              <SpecRow label="Инструкция по уходу" value={product.care_instructions} />
            </div>
          </Accordion>

          {/* Доставка и возврат */}
          <Accordion
            title="Доставка и возврат"
            open={openAccordion === 'delivery'}
            onToggle={() => toggleAccordion('delivery')}
          >
            {product.delivery_info && (
              <p className="pv-text" style={{ whiteSpace: 'pre-line' }}>{product.delivery_info}</p>
            )}
            <ul className="pv-links">
              <li>
                <TruckIcon />
                <span>
                  <Link to="/support/shipping">Доставка</Link> по тарифам служб доставки
                </span>
              </li>
              <li>
                <BoxIcon />
                <span>
                  Возврат в течение 14 дней — <Link to="/support/offer">условия</Link>
                </span>
              </li>
            </ul>
          </Accordion>
        </aside>
      </div>

      {/* Приглашение в бутики — тот же блок, что внизу главной */}
      <StoreVisitCta variant="product" />
    </>
  );
};

export default ProductView;

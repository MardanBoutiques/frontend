/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from "react";
import NavBar from "../navbar/NavBar";
import "./Catalogue.css";
import api from "../../api/axios";
import { useSearchParams, useNavigate, useNavigationType } from "react-router-dom";
import { getImageUrl } from "../../utils/imageUrl";
import { getColorCode } from "../../utils/colorMap";
import { formatPrice, hasDiscount } from "../../utils/price";

const Grid = ({ children, onClick, className }) => {
  return (
    <div className={className} onClick={(event) => onClick(event)}>
      {children}
    </div>
  );
};

// Сколько карточек грузят своё фото сразу. Остальные ждут, пока до них
// долистают: на странице их сорок, и разом это семь мегабайт — телефон
// стоит с пустыми плитками, пока всё не приедет.
const СРАЗУ_ВИДНО = 4;

// Что уже показывали в каждом разделе: товары, счётчик, ссылка на
// следующую страницу и место, до которого долистали.
//
// Живёт в памяти вкладки, не в хранилище: при возврате с карточки товара
// список рисуется сразу, без запроса и без белого поля. Перезагрузка
// страницы память очищает — цены всегда свежие после обновления.
const ПАМЯТЬ_РАЗДЕЛОВ = new Map();

const ключРаздела = (category, subcategory, sortType) =>
  `${category || ''}|${subcategory || ''}|${sortType || ''}`;

const ProductCard = ({ product, variants, индекс, приОткрытии }) => {
  const navigate = useNavigate();
  const [photoIndex, setPhotoIndex] = useState(0);

  const handleCardClick = () => {
    // Место прокрутки запоминаем здесь, до перехода: к тому времени, когда
    // каталог будет размонтирован, страница уже уедет к началу.
    if (приОткрытии) приОткрытии();
    navigate(`/product/${product.id}`);
  };

  // Главное фото + дополнительные из галереи товара
  const photos = [product.image, ...(product.images || []).map((i) => i.image)].filter(Boolean);

  // Галерея — горизонтальная прокрутка: на мобильных листается свайпом,
  // на десктопе её же прокручивают стрелки.
  const scrollerRef = useRef(null);

  const handleScroll = () => {
    const el = scrollerRef.current;
    if (!el || !el.clientWidth) return;
    setPhotoIndex(Math.round(el.scrollLeft / el.clientWidth));
  };

  const stepPhoto = (e, delta) => {
    e.stopPropagation();
    const el = scrollerRef.current;
    if (!el) return;
    const next = Math.min(photos.length - 1, Math.max(0, photoIndex + delta));
    el.scrollTo({ left: next * el.clientWidth, behavior: 'smooth' });
  };

  // variants = other color options of this same product (matched by article; see caller)
  const dots = variants
    .map(v => ({ id: v.id, hex: getColorCode(v.colors), label: v.colors }))
    .filter(d => d.hex);

  return (
    <div className="product-card" onClick={handleCardClick} style={{cursor: 'pointer'}}>
      <div className="product-image-container">
        {photos.length > 0 ? (
          <div className="product-photos" ref={scrollerRef} onScroll={handleScroll}>
            {photos.map((photo, i) => (
              <div className="product-photo" key={i}>
                {/* Первое фото нужно сразу, остальные — только когда до них
                    долистают: иначе каталог тянет сотни картинок разом */}
                <img
                  src={getImageUrl(photo)}
                  alt={product.name}
                  className="product-img"
                  loading={i === 0 && индекс < СРАЗУ_ВИДНО ? 'eager' : 'lazy'}
                  decoding="async"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="product-image">
            <div className="image-placeholder">
              <span>👔</span>
            </div>
          </div>
        )}

        {photos.length > 1 && (
          <>
            <button
              type="button"
              className="product-nav prev"
              aria-label="Предыдущее фото"
              onClick={(e) => stepPhoto(e, -1)}
            >
              ‹
            </button>
            <button
              type="button"
              className="product-nav next"
              aria-label="Следующее фото"
              onClick={(e) => stepPhoto(e, 1)}
            >
              ›
            </button>
            {/* Полоса-индикатор под фото — показывается на мобильных */}
            <div className="product-progress">
              <span
                style={{
                  width: `${100 / photos.length}%`,
                  left: `${(100 / photos.length) * photoIndex}%`,
                }}
              />
            </div>
          </>
        )}
      </div>
      <div className="product-info">
        <div className="product-header">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-price">
            {hasDiscount(product) && (
              <span className="product-price-old">{formatPrice(product.old_price)}</span>
            )}
            {formatPrice(product.price)}
          </p>
        </div>
        <p className="product-desc">{product.description}</p>
        {dots.length > 0 && (
          <div className="product-colors">
            {dots.slice(0, 5).map((d) => (
              <span
                key={d.id}
                className={`color-dot${d.id === product.id ? ' active' : ''}`}
                style={{ backgroundColor: d.hex }}
                title={d.label}
                onClick={(e) => { e.stopPropagation(); navigate(`/product/${d.id}`); }}
              />
            ))}
            {dots.length > 5 && (
              <span className="color-more">+{dots.length - 5}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const Filter = ({ isHidden, onSort, currentSort }) => {
  return (
    <div className={`side-filter ${isHidden ? "hidden" : ""}`}>
      <div className="filter-header">
        <h2>Фильтры</h2>
      </div>
      
      <div className="filter-section">
        <h3>Сортировать</h3>
        <div className="filter-options">
          <div 
            className={`filter-option ${currentSort === 'price-asc' ? 'active' : ''}`}
            onClick={() => onSort('price-asc')}
          >
            По цене: по возрастанию
          </div>
          <div 
            className={`filter-option ${currentSort === 'price-desc' ? 'active' : ''}`}
            onClick={() => onSort('price-desc')}
          >
            По цене: по убыванию
          </div>
        </div>
      </div>
    </div>
  );
};

const PAGE_SIZE = 40;

const Catalogue = () => {
  const [filterChosen, setFilterChosen] = useState(false);
  const [products, setProducts] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortType, setSortType] = useState('');
  // Каталог приходит страницами: сервер фильтрует и сортирует сам, а за раз
  // отдаёт сорок товаров — раньше все двести приходили одним ответом
  const [total, setTotal] = useState(0);
  const [nextPage, setNextPage] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchParams] = useSearchParams();
  const тип_перехода = useNavigationType();
  const category = searchParams.get("category");
  const subcategory = searchParams.get("subcategory");

  // Точка возврата из корзины — ровно тот раздел, где покупатель был,
  // включая подкатегорию, а не общая страница категории.
  useEffect(() => {
    if (category) {
      const params = new URLSearchParams({ category });
      if (subcategory) params.set('subcategory', subcategory);
      sessionStorage.setItem('lastCataloguePath', `/catalogue?${params}`);
    }
    sessionStorage.removeItem('lastProductPath');
  }, [category, subcategory]);

  // Последнее отрисованное состояние — его же и запоминаем, когда уходим
  const состояние = useRef({});
  // Куда вернуть прокрутку, когда список снова окажется на экране
  const вернутьПрокрутку = useRef(null);
  // Место, на котором покупатель ушёл в карточку товара
  const местоУхода = useRef(null);
  состояние.current = { products, total, nextPage };

  useEffect(() => {
    const ключ = ключРаздела(category, subcategory, sortType);
    const запомненное = ПАМЯТЬ_РАЗДЕЛОВ.get(ключ);

    // Возврат с карточки товара: показываем то же, что и было, и на том
    // же месте. Запрашивать раздел заново — это белое поле, повторная
    // отрисовка сорока карточек и прыжок к началу списка.
    if (тип_перехода === 'POP' && запомненное) {
      setProducts(запомненное.products);
      setTotal(запомненное.total);
      setNextPage(запомненное.nextPage);
      setLoading(false);
      вернутьПрокрутку.current = запомненное.scrollY || 0;
    } else {
      // Смена категории — это такой же вход в раздел: сначала стекло и белое
      // поле, и только потом новые карточки. Без сброса под стеклом остались
      // бы висеть товары предыдущей категории.
      setLoading(true);
      setError(null);
      setProducts([]);
      window.scrollTo(0, 0);

      fetchPage(1)
        .then(({ results, count, next }) => {
          setProducts(results);
          setTotal(count);
          setNextPage(next);
          setLoading(false);
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false);
        });
    }

    return () => {
      const { products: т, total: в, nextPage: с } = состояние.current;
      if (т.length) {
        ПАМЯТЬ_РАЗДЕЛОВ.set(ключ, {
          products: т, total: в, nextPage: с,
          scrollY: местоУхода.current === null ? window.scrollY : местоУхода.current,
        });
      }
    };
  }, [category, subcategory, sortType]);

  // Прокрутку возвращаем не раньше, чем список отрисован: до этого
  // страница короткая, и браузер прижал бы её к концу содержимого.
  useEffect(() => {
    if (вернутьПрокрутку.current === null || !products.length) return;

    const цель = вернутьПрокрутку.current;
    вернутьПрокрутку.current = null;
    // Первый кадр — React отрисовал карточки, второй — браузер посчитал
    // их высоту: плитки заданы пропорцией, фотографии для этого не нужны.
    //
    // instant обязателен: в стилях сайта стоит scroll-behavior: smooth, и
    // обычный вызов превратился бы в долгую прокрутку через весь список.
    requestAnimationFrame(() => requestAnimationFrame(() =>
      window.scrollTo({ top: цель, behavior: 'instant' })));
  }, [products]);

  const fetchPage = (page) => {
    const params = new URLSearchParams({ page, page_size: PAGE_SIZE });
    if (category) params.set('category', category);
    if (subcategory) params.set('subcategory', subcategory);
    if (sortType) params.set('sort', sortType);

    return api.get(`/?${params}`).then((response) => {
      if (response.status !== 200) throw new Error('Network response was not ok');
      return response.data;
    });
  };

  const loadMore = () => {
    if (!nextPage || loadingMore) return;
    setLoadingMore(true);
    fetchPage(nextPage)
      .then(({ results, next }) => {
        setProducts((current) => [...current, ...results]);
        setNextPage(next);
      })
      .catch(() => {})
      .finally(() => setLoadingMore(false));
  };

  // Сортировка меняет запрос: иначе упорядочивалась бы только загруженная часть
  const handleSort = (type) => {
    setSortType(type);
    setFilterChosen(false);
  };

  const accessoryTypeTitles = {
    'ties': 'Галстуки',
    'pocket_squares': 'Платки',
    'cardholders': 'Кардхолдеры',
    'clutches': 'Клатчи',
    'briefcases': 'Дипломаты',
    'wallets': 'Портмоне',
    'belts': 'Ремни',
    'socks': 'Носки',
    'suspenders': 'Подтяжки',
  };

  const outerwearTypeTitles = {
    'coats': 'Пальто',
    'trench': 'Тренчи',
    'jackets': 'Куртки',
    'vests': 'Жилеты',
  };

  const suitTypeTitles = {
    'set': 'Комплекты',
    'jacket': 'Пиджаки',
  };

  const getCategoryTitle = () => {
    if (subcategory) return accessoryTypeTitles[subcategory] || outerwearTypeTitles[subcategory] || suitTypeTitles[subcategory] || '';

    const categoryTitles = {
      'new': 'Новые поступления',
      'sale': 'BLACK FRIDAY',
      'suits': 'Костюмы',
      'shirts': 'Рубашки',
      'cardigans': 'Кардиганы',
      'knitwear': 'Трикотаж и свитера',
      'polo': 'Поло и футболки',
      'outerwear': 'Верхняя одежда',
      'pants': 'Брюки',
      'shoes': 'Обувь',
      'accessories': 'Аксессуары',
      'giftbox': 'Подарочный бокс и карта'
    };

    return categoryTitles[category] || '';
  };

  const getCategoryDescription = () => {
    if (subcategory === 'jacket') {
      return 'Пиджаки из премиальных материалов — точная посадка и лёгкая структура для уверенного образа на каждый день.';
    }

    const categoryDescriptions = {
      'new': 'Последние поступления в каталог Mardan — свежие модели, которые только что появились в продаже.',
      'sale': 'Межсезонная распродажа с 20 по 30 ноября включительно.',
      'suits': 'Наши костюмы — идеальный баланс современного силуэта и легкости, обеспечивающий комфорт в любой ситуации.',
      'shirts': 'Рубашки, созданные для рабочих дней, путешествий и летних вечеров, чтобы вы выглядели элегантно в любой обстановке.',
      'cardigans': 'Кардиганы из премиальных материалов для завершённого образа в любое время года.',
      'knitwear': 'Трикотаж и свитера из мягких премиальных материалов — комфорт и стиль на каждый день.',
      'polo': 'Поло и футболки из дышащих премиальных материалов — лёгкость и аккуратный силуэт на каждый день.',
      'outerwear': 'Верхняя одежда для прохладных дней — от классики до современных силуэтов, для комфорта в любом ритме дня.',
      'pants': 'Брюки продуманного кроя — комфортная посадка и точный силуэт для уверенности в любой обстановке.',
      'shoes': 'Обувь из премиальной кожи — точная посадка и аккуратная отделка для уверенности в любой обстановке.',
      'accessories': 'Детали, которые делают образ завершенным. От классических акцентов до функциональных аксессуаров на каждый день.',
      'giftbox': 'Подарочные боксы и карты — идеальный подарок для ценителей качественной одежды.'
    };

    return category
      ? categoryDescriptions[category] || 'Откройте для себя нашу коллекцию премиум одежды и аксессуаров для истинного джентльмена.'
      : '';
  };

  return (
    <>
      <NavBar>
        <div className="filter" onClick={() => setFilterChosen(!filterChosen)}>
          <span className="filter-icon">☰</span>
          <p>Filter</p>
        </div>
      </NavBar>
      
      {/* Category Header */}
      <div className="category-header">
        <div className="category-header-top">
          <h1 className="category-title">{getCategoryTitle()}</h1>
          <div className="filter-btn" onClick={() => setFilterChosen(!filterChosen)}>
            <span className="filter-icon">☰</span>
            <span>Filter</span>
          </div>
        </div>
        <p className="category-description">{getCategoryDescription()}</p>
        {/* Условие акции: мелкой строкой под описанием, чтобы не
            потерялось, но и не спорило с ним */}
        {category === 'sale' && (
          <p className="category-note">
            Скидки действуют только на модели и цвета, собранные в этом разделе.
          </p>
        )}
      </div>
      
      <Filter isHidden={!filterChosen} onSort={handleSort} currentSort={sortType} />
      {/* Пока грузится — просто белое поле во весь экран: ни надписи
          «Loading», ни подъехавшего снизу футера под стеклом не видно */}
      {isLoading && <div className="catalogue-loading" />}
      {error && <div className="error">Error: {error}</div>}
      {!isLoading && products.length === 0 && !error && (
        <div className="no-products">Товары не найдены</div>
      )}
      <Grid
        className={`grid ${filterChosen ? "dark" : "light"}`}
        onClick={() => setFilterChosen(false)}
      >
        {products.map((product, индекс) => (
          // Оттенки считает сервер: на странице каталога лежат не все товары,
          // и подобрать их по артикулу здесь было бы уже не из чего
          <ProductCard
            product={product}
            variants={product.variant_colors || []}
            индекс={индекс}
            приОткрытии={() => { местоУхода.current = window.scrollY; }}
            key={product.id}
          />
        ))}
      </Grid>

      {nextPage && (
        <div className="catalogue-more">
          <button
            type="button"
            className="catalogue-more-btn"
            onClick={loadMore}
            disabled={loadingMore}
          >
            {loadingMore ? 'Загружаем…' : `Показать ещё (${total - products.length})`}
          </button>
        </div>
      )}
    </>
  );
};

export default Catalogue;

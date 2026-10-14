/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from "react";
import NavBar from "../navbar/NavBar";
import "./Catalogue.css";
import api from "../../api/axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getImageUrl } from "../../utils/imageUrl";
import { getColorCode } from "../../utils/colorMap";

const Grid = ({ children, onClick, className }) => {
  return (
    <div className={className} onClick={(event) => onClick(event)}>
      {children}
    </div>
  );
};

const ProductCard = ({ product, variants }) => {
  const navigate = useNavigate();
  const [photoIndex, setPhotoIndex] = useState(0);

  const handleCardClick = () => {
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
                  loading={i === 0 ? 'eager' : 'lazy'}
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
          <p className="product-price">{Math.round(product.price).toLocaleString('ru-RU')} KZT</p>
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

// Дата добавления товара попадает в период из админки. Пустая граница
// означает «без ограничения», поэтому сравниваем только заданные.
const inPeriod = (createdAt, period) => {
  if (!period || (!period.date_from && !period.date_to)) return true;
  if (!createdAt) return false;

  const day = createdAt.slice(0, 10);
  if (period.date_from && day < period.date_from) return false;
  if (period.date_to && day > period.date_to) return false;
  return true;
};

const PAGE_SIZE = 40;

const Catalogue = () => {
  const [filterChosen, setFilterChosen] = useState(false);
  const [products, setProducts] = useState([]);
  const [sortedProducts, setSortedProducts] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const [sortType, setSortType] = useState('');
  // Каталог выводится порциями: 200 карточек разом роняли Safari на телефоне
  const [shown, setShown] = useState(PAGE_SIZE);
  const [searchParams] = useSearchParams();
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

  useEffect(() => {
    // Смена категории — это такой же вход в раздел: сначала стекло и белое
    // поле, и только потом новые карточки. Без сброса под стеклом остались
    // бы висеть товары предыдущей категории.
    setLoading(true);
    setError(null);
    setProducts([]);
    setSortedProducts([]);
    setShown(PAGE_SIZE);
    window.scrollTo(0, 0);

    // Для «Новых поступлений» нужен ещё период из админки
    const requests = [api.get("/")];
    if (category === 'new') {
      requests.push(
        api.get('/api/new-arrivals/').catch(() => ({ data: {} }))
      );
    }

    Promise.all(requests)
      .then(([productsResponse, periodResponse]) => {
        if (productsResponse.status != 200) {
          throw new Error("Network response was not ok");
        }
        return { data: productsResponse.data, period: periodResponse?.data || {} };
      })
      .then(({ data, period }) => {
        let filtered = data;

        // «Новые поступления» — псевдо-категория: не фильтруем по category,
        // но оставляем только товары, заведённые в заданный период.
        if (category && category !== 'new') {
          filtered = filtered.filter(product => product.category === category);
        } else if (category === 'new') {
          filtered = filtered.filter((product) => inPeriod(product.created_at, period));
        }
        if (subcategory) {
          filtered = filtered.filter(product =>
            product.accessory_type === subcategory || product.outerwear_type === subcategory || product.suit_type === subcategory
          );
        }

        setProducts(filtered);
        setSortedProducts(filtered);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [category, subcategory]);

  const handleSort = (type) => {
    setSortType(type);
    let sorted = [...products];
    
    switch(type) {
      case 'price-asc':
        sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case 'price-desc':
        sorted.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      default:
        sorted = products;
    }
    
    setSortedProducts(sorted);
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
      </div>
      
      <Filter isHidden={!filterChosen} onSort={handleSort} currentSort={sortType} />
      {/* Пока грузится — просто белое поле во весь экран: ни надписи
          «Loading», ни подъехавшего снизу футера под стеклом не видно */}
      {isLoading && <div className="catalogue-loading" />}
      {error && <div className="error">Error: {error}</div>}
      {!isLoading && sortedProducts.length === 0 && !error && (
        <div className="no-products">No products found</div>
      )}
      <Grid
        className={`grid ${filterChosen ? "dark" : "light"}`}
        onClick={() => setFilterChosen(false)}
      >
        {sortedProducts.slice(0, shown).map((product, index) => {
          // Same article = same design in different colors. Matching by name alone
          // would wrongly group unrelated products that happen to share a name but
          // have different articles (and are therefore different products).
          const variants = product.article
            ? products.filter(p => p.article === product.article)
            : products.filter(p => p.name === product.name && !p.article);
          return <ProductCard product={product} variants={variants} key={index} />;
        })}
      </Grid>

      {shown < sortedProducts.length && (
        <div className="catalogue-more">
          <button
            type="button"
            className="catalogue-more-btn"
            onClick={() => setShown((n) => n + PAGE_SIZE)}
          >
            Показать ещё
          </button>
        </div>
      )}
    </>
  );
};

export default Catalogue;

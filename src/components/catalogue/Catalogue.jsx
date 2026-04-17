/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import NavBar from "../navbar/NavBar";
import "./Catalogue.css";
import api from "../../api/axios";
import { useSearchParams, useNavigate } from "react-router-dom";

const Grid = ({ children, onClick, className }) => {
  return (
    <div className={className} onClick={(event) => onClick(event)}>
      {children}
    </div>
  );
};

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    const cloudName = 'dmwmkfv6w';
    const path = imagePath.startsWith('/media/') ? imagePath.replace('/media/', '') : imagePath;
    return `https://res.cloudinary.com/${cloudName}/image/upload/${path}`;
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="product-card" onClick={handleCardClick} style={{cursor: 'pointer'}}>
      <div className="product-image-container">
        <div className="product-image">
          {product.image ? (
            <img src={getImageUrl(product.image)} alt={product.name} className="product-img" />
          ) : (
            <div className="image-placeholder">
              <span>👔</span>
            </div>
          )}
        </div>
      </div>
      <div className="product-info">
        <div className="product-header">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-price">{Math.round(product.price).toLocaleString('ru-RU')} KZT</p>
        </div>
        <p className="product-desc">{product.description}</p>
        <div className="product-colors">
          <span className="color-dot" style={{ backgroundColor: '#8B7355' }}></span>
          <span className="color-dot" style={{ backgroundColor: '#D3D3D3' }}></span>
          <span className="color-dot" style={{ backgroundColor: '#000000' }}></span>
        </div>
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
          <div 
            className={`filter-option ${currentSort === 'name-asc' ? 'active' : ''}`}
            onClick={() => onSort('name-asc')}
          >
            По названию: А-Я
          </div>
          <div 
            className={`filter-option ${currentSort === 'name-desc' ? 'active' : ''}`}
            onClick={() => onSort('name-desc')}
          >
            По названию: Я-А
          </div>
        </div>
      </div>
    </div>
  );
};

const Catalogue = () => {
  const [filterChosen, setFilterChosen] = useState(false);
  const [products, setProducts] = useState([]);
  const [sortedProducts, setSortedProducts] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const [sortType, setSortType] = useState('');
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");

  useEffect(() => {
    api
      .get("/")
      .then((response) => {
        if (response.status != 200) {
          throw new Error("Network response was not ok");
        }
        return response.data;
      })
      .then((data) => {
        let filtered = data;
        
        // Фильтрация по категории из URL
        if (category) {
          filtered = data.filter(product => product.category === category);
        }
        
        setProducts(filtered);
        setSortedProducts(filtered);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [category]);

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
      case 'name-asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name, 'ru'));
        break;
      case 'name-desc':
        sorted.sort((a, b) => b.name.localeCompare(a.name, 'ru'));
        break;
      default:
        sorted = products;
    }
    
    setSortedProducts(sorted);
    setFilterChosen(false);
  };

  const getCategoryTitle = () => {
    const categoryTitles = {
      'suits': 'Костюмы',
      'shirts': 'Рубашки',
      'cardigans': 'Кардиганы',
      'knitwear': 'Трикотаж',
      'coats': 'Пальто',
      'trench': 'Тренчи',
      'jackets': 'Куртки',
      'accessories': 'Аксессуары',
      'giftbox': 'Подарочный бокс и карта'
    };

    return category ? categoryTitles[category] || 'Все товары' : 'Все товары';
  };

  const getCategoryDescription = () => {
    const categoryDescriptions = {
      'suits': 'Наши костюмы — идеальный баланс современного силуэта и легкости, обеспечивающий комфорт в любой ситуации.',
      'shirts': 'Рубашки, созданные для рабочих дней, путешествий и летних вечеров, чтобы вы выглядели элегантно в любой обстановке.',
      'cardigans': 'Кардиганы из премиальных материалов для завершённого образа в любое время года.',
      'knitwear': 'Универсальные решения для расслабленного образа, которые позволяют выглядеть стильно в течение всего дня.',
      'coats': 'Пальто из шерсти и кашемира — элегантность и защита от холода для настоящего джентльмена.',
      'trench': 'Тренчи классического кроя, вдохновлённые британской традицией и адаптированные для современного гардероба.',
      'jackets': 'Стильные решения для прохладных дней и путешествий. Легкость в движении и эстетика в каждой детали вашего образа.',
      'accessories': 'Детали, которые делают образ завершенным. \n От классических акцентов до функциональных аксессуаров на каждый день.',
      'giftbox': 'Подарочные боксы и карты — идеальный подарок для ценителей качественной одежды.'
    };

    return category
      ? categoryDescriptions[category] || 'Откройте для себя нашу коллекцию премиум одежды и аксессуаров для истинного джентльмена.'
      : 'Откройте для себя нашу коллекцию премиум одежды и аксессуаров для истинного джентльмена.';
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
      {isLoading && <div className="loading">Loading...</div>}
      {error && <div className="error">Error: {error}</div>}
      {!isLoading && sortedProducts.length === 0 && !error && (
        <div className="no-products">No products found</div>
      )}
      <Grid
        className={`grid ${filterChosen ? "dark" : "light"}`}
        onClick={() => setFilterChosen(false)}
      >
        {sortedProducts.map((product, index) => (
          <ProductCard product={product} key={index}></ProductCard>
        ))}
      </Grid>
    </>
  );
};

export default Catalogue;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../navbar/NavBar";
import api from "../../api/axios";
import { useCart } from "../../context/CartContext";
import { getImageUrl } from "../../utils/imageUrl";
import { getColorCode as getMappedColorCode } from "../../utils/colorMap";
import "./ProductView.css";

const Accordion = ({ title, children, open, onToggle }) => {
  return (
    <div className={`accordion-section ${open ? 'open' : ''}`}>
      <button className="accordion-header" onClick={onToggle}>
        <h3>{title}</h3>
        <span className="accordion-icon">{open ? '−' : '+'}</span>
      </button>
      {open && <div className="accordion-body">{children}</div>}
    </div>
  );
};

// Variant swatches must stay clickable even when a color can't be mapped,
// so this falls back to a neutral grey instead of hiding the option.
const getColorCode = (colorName) => getMappedColorCode(colorName) || '#888';

const ProductView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [openAccordion, setOpenAccordion] = useState(null);

  const toggleAccordion = (key) => {
    setOpenAccordion(prev => prev === key ? null : key);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    setSelectedSize('');
    setSelectedImageIndex(0);
    setOpenAccordion(null);
    api.get(`/${id}`)
      .then((response) => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
        setLoading(false);
      });
    api.get(`/${id}/variants`)
      .then((response) => setVariants(response.data))
      .catch(() => setVariants([]));
  }, [id]);



  if (loading) {
    return (
      <>
        <NavBar />
        <div className="product-view-container">
          <div className="loading">Загрузка...</div>
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <NavBar />
        <div className="product-view-container">
          <div className="error">Товар не найден</div>
        </div>
      </>
    );
  }

  const getSizes = () => {
    if (product.available_sizes) {
      return product.available_sizes.split(',').map(s => s.trim()).filter(s => s);
    }
    if (product.category === 'accessories') return [];
    if (product.category === 'suits') return ['46', '48', '50', '52', '54', '56'];
    return ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  };
  const sizes = getSizes();
  const isAccessory = product.category === 'accessories';

  // Собираем все фото: главное + галерея
  const getAllImages = () => {
    const images = [];

    // Главное фото
    if (product.image) {
      images.push(product.image);
    }

    // Фото из галереи
    if (product.images && product.images.length > 0) {
      product.images.forEach(img => {
        images.push(img.image);
      });
    }

    return images;
  };

  const allImages = getAllImages();
  const currentImage = allImages[selectedImageIndex] || null;

  return (
    <>
      <NavBar />
      <div className="product-view-container">
        <div className="product-view-content">
          {/* Левая часть - изображение */}
          <div className="product-image-section">
            {/* Главное изображение */}
            <div className="main-image-container">
              {currentImage ? (
                <img
                  src={getImageUrl(currentImage)}
                  alt={product.name}
                  className="product-main-image"
                />
              ) : (
                <div className="product-image-placeholder">
                  <span>👔</span>
                </div>
              )}
            </div>

            {/* Миниатюры галереи */}
            {allImages.length > 1 && (
              <div className="image-thumbnails">
                {allImages.map((img, index) => (
                  <div
                    key={index}
                    className={`thumbnail ${selectedImageIndex === index ? 'active' : ''}`}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <img
                      src={getImageUrl(img)}
                      alt={`${product.name} ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Правая часть - информация */}
          <div className="product-info-section">
            <div className="product-title-row">
              <h1 className="product-title">{product.name}</h1>
              <p className="product-price-large">{Math.round(product.price).toLocaleString('ru-RU')} KZT</p>
            </div>

            {/* Цвета */}
            {variants.length > 0 && (
              <div className="product-option">
                <h3>Цвет</h3>
                <div className="color-options">
                  {variants.map((v) => (
                    <button
                      key={v.id}
                      className={`color-option ${String(v.id) === String(id) ? 'active' : ''}`}
                      style={{ backgroundColor: getColorCode(v.colors) }}
                      title={v.colors}
                      onClick={() => navigate(`/product/${v.id}`)}
                      type="button"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Размеры — скрыты для аксессуаров */}
            {!isAccessory && (
              <div className="product-option">
                <h3>Размер</h3>
                <div className="size-options">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Кнопка: добавить в корзину */}
            <div className="product-actions">
              <button
                className={`btn-add-to-cart-large ${addedToCart ? 'added' : ''}`}
                onClick={() => {
                  if (!isAccessory && !selectedSize) {
                    alert('Пожалуйста, выберите размер');
                    return;
                  }
                  addToCart(product, isAccessory ? 'Один размер' : selectedSize, quantity);
                  setAddedToCart(true);
                  setTimeout(() => setAddedToCart(false), 2000);
                }}
                disabled={!isAccessory && !selectedSize}
                type="button"
              >
                {addedToCart ? '✓ ДОБАВЛЕНО В КОРЗИНУ' : 'ДОБАВИТЬ В КОРЗИНУ'}
              </button>
            </div>

            {/* Описание */}
            {(product.description || product.detailed_description) && (
              <div className="product-description">
                <h3>Описание</h3>
                {product.description && <p className="short-desc">{product.description}</p>}
                {product.detailed_description && (
                  <p className="detailed-desc">{product.detailed_description}</p>
                )}
              </div>
            )}

            {/* Характеристики */}
            {product.material && (
              <Accordion title="Характеристики" open={openAccordion === 'specs'} onToggle={() => toggleAccordion('specs')}>
                <ul className="product-specs-list">
                  <li><strong>Состав:</strong> {product.material}</li>
                  {!isAccessory && product.available_sizes && (
                    <li><strong>Размеры:</strong> {product.available_sizes}</li>
                  )}
                  {product.colors && (
                    <li><strong>Цвета:</strong> {product.colors}</li>
                  )}
                </ul>
              </Accordion>
            )}

            {/* Уход */}
            <Accordion title="Уход за изделием" open={openAccordion === 'care'} onToggle={() => toggleAccordion('care')}>
              {product.care_instructions ? (
                <p style={{whiteSpace: 'pre-line'}} className="accordion-text">{product.care_instructions}</p>
              ) : (
                <ul className="product-specs-list">
                  <li>Химчистка рекомендуется</li>
                  <li>Не отбеливать</li>
                  <li>Гладить при низкой температуре</li>
                  <li>Хранить на вешалке</li>
                </ul>
              )}
            </Accordion>

            {/* Доставка */}
            <Accordion title="Доставка и возврат" open={openAccordion === 'delivery'} onToggle={() => toggleAccordion('delivery')}>
              {product.delivery_info ? (
                <p style={{whiteSpace: 'pre-line'}} className="accordion-text">{product.delivery_info}</p>
              ) : (
                <div className="delivery-info">
                  <div className="delivery-section">
                    <p className="delivery-region">Внутри города Алматы и Астана</p>
                    <table className="delivery-table">
                      <thead>
                        <tr><th>Способ</th><th>Стоимость</th><th>Срок</th></tr>
                      </thead>
                      <tbody>
                        <tr><td>Яндекс Доставка</td><td>По тарифу Яндекса</td><td>День в день</td></tr>
                        <tr><td>Самовывоз</td><td>Бесплатно</td><td>В рабочее время магазина</td></tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="delivery-section">
                    <p className="delivery-region">Внутри Казахстана</p>
                    <table className="delivery-table">
                      <thead>
                        <tr><th>Способ</th><th>Стоимость</th><th>Срок</th></tr>
                      </thead>
                      <tbody>
                        <tr><td>Казпочта</td><td>2 000 ₸</td><td>5–9 рабочих дней (до пункта выдачи)</td></tr>
                        <tr><td>RIKA</td><td>от 3 500 ₸</td><td>2–4 дня (до двери, включая посёлки)</td></tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="delivery-section">
                    <p className="delivery-region">СНГ</p>
                    <table className="delivery-table">
                      <thead>
                        <tr><th>Регион</th><th>Стоимость</th><th>Срок</th></tr>
                      </thead>
                      <tbody>
                        <tr><td>СНГ</td><td>По тарифу СДЭК и KAZPOST</td><td>7–14 рабочих дней (до пункта выдачи)</td></tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="delivery-section">
                    <p className="delivery-region">Европа и Америка</p>
                    <table className="delivery-table">
                      <thead>
                        <tr><th>Регион</th><th>Стоимость</th><th>Срок</th></tr>
                      </thead>
                      <tbody>
                        <tr><td>Европа</td><td>По тарифу СДЭК и KAZPOST</td><td>от 2 недель (до пункта выдачи)</td></tr>
                        <tr><td>Америка</td><td>По тарифу СДЭК и KAZPOST</td><td>от 2 недель (до пункта выдачи)</td></tr>
                        <tr><td>Остальные страны</td><td>По тарифу СДЭК и KAZPOST</td><td>от 2 недель (до пункта выдачи)</td></tr>
                      </tbody>
                    </table>
                  </div>

                  <p className="delivery-return">* Возврат в течение 14 дней при сохранении чека, товарного вида и этикеток.</p>
                </div>
              )}
            </Accordion>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductView;

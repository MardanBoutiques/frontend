import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../navbar/NavBar';
import { useCart } from '../../context/CartContext';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, getTotalItems } = useCart();

  const goBackToCatalogue = () => {
    const lastCategory = sessionStorage.getItem('lastCatalogueCategory');
    if (lastCategory === '__giftbox__') navigate('/giftbox');
    else if (lastCategory === '__giftcard__') navigate('/giftcard');
    else navigate(lastCategory ? `/catalogue?category=${lastCategory}` : '/');
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/media/')) return `http://127.0.0.1:8001${imagePath}`;
    return `http://127.0.0.1:8001/media/${imagePath}`;
  };

  if (cartItems.length === 0) {
    return (
      <>
        <NavBar />
        <div className="cart-container">
          <div className="cart-empty">
            <h2>Ваша корзина пуста</h2>
            <p>Добавьте товары из каталога</p>
            <button className="btn-continue-shopping" onClick={goBackToCatalogue}>
              Перейти в каталог
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="cart-container">
        <div className="cart-content">
<div className="cart-layout">
            {/* Левая часть - список товаров */}
            <div className="cart-items">
              {cartItems.map((item, index) => (
                <div key={`${item.id}-${item.size}-${index}`} className="cart-item">
                  <div className="cart-item-image">
                    {item.image ? (
                      <img src={getImageUrl(item.image)} alt={item.name} />
                    ) : (
                      <div className="cart-item-placeholder">👔</div>
                    )}
                  </div>

                  <div className="cart-item-details">
                    <h3 className="cart-item-name">{item.name}</h3>
                    <p className="cart-item-size">Размер: {item.size}</p>
                    <p className="cart-item-price">{Math.round(item.price).toLocaleString('ru-RU')} KZT</p>
                  </div>

                  <div className="cart-item-quantity">
                    <button 
                      className="qty-btn"
                      onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                    >
                      −
                    </button>
                    <span className="qty-value">{item.quantity}</span>
                    <button 
                      className="qty-btn"
                      onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>

                  <div className="cart-item-total">
                    {Math.round(item.price * item.quantity).toLocaleString('ru-RU')} KZT
                  </div>

                  <button 
                    className="cart-item-remove"
                    onClick={() => removeFromCart(item.id, item.size)}
                    title="Удалить"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Правая часть - итоговая сумма */}
            <div className="cart-summary">
              <h2 className="summary-title">Итого</h2>
              
              <div className="summary-row">
                <span>Товары ({getTotalItems()})</span>
                <span>{Math.round(getTotalPrice()).toLocaleString('ru-RU')} KZT</span>
              </div>

              <div className="summary-row">
                <span>Доставка</span>
                <span>Рассчитывается при оформлении</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-total">
                <span>Всего</span>
                <span className="total-price">{Math.round(getTotalPrice()).toLocaleString('ru-RU')} KZT</span>
              </div>

              <button 
                className="btn-checkout"
                onClick={() => navigate('/checkout')}
              >
                Оформить заказ
              </button>

              <button
                className="btn-continue"
                onClick={goBackToCatalogue}
              >
                Продолжить покупки
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;

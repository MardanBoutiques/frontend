import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../navbar/NavBar';
import { useCart } from '../../context/CartContext';
import { getImageUrl } from '../../utils/imageUrl';
import './Cart.css';

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
    <path d="M4 7h16M10 7V5h4v2M6 7l1 13h10l1-13" />
  </svg>
);

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, getTotalItems } = useCart();

  // «Перейти в каталог» — в тот же раздел, где покупатель был, с подкатегорией
  const goToCatalogue = () => {
    navigate(sessionStorage.getItem('lastCataloguePath') || '/');
  };

  // «Продолжить покупки» — на карточку товара, с которой пришли в корзину
  const goBackToCatalogue = () => {
    const lastProduct = sessionStorage.getItem('lastProductPath');
    if (lastProduct) {
      navigate(lastProduct);
      return;
    }
    goToCatalogue();
  };

  if (cartItems.length === 0) {
    return (
      <>
        <NavBar />
        <div className="cart-container">
          <div className="cart-empty">
            <h2>Ваша корзина пуста</h2>
            <p>Добавьте товары из каталога</p>
            <button className="btn-continue-shopping" onClick={goToCatalogue}>
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
          <button
            type="button"
            className="cart-close"
            onClick={goBackToCatalogue}
            aria-label="Закрыть корзину"
          >
            <img src="/close.png" alt="" />
          </button>
          <h1 className="cart-title">Ваша корзина</h1>
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
                    <p className="cart-item-delivery">Доставка: 3–6 рабочих дней</p>

                    <div className="cart-item-row">
                      <div className="cart-item-quantity">
                        {/* На единице «минус» превращается в удаление — как в референсе */}
                        <button
                          className="qty-btn"
                          onClick={() => (item.quantity > 1
                            ? updateQuantity(item.id, item.size, item.quantity - 1)
                            : removeFromCart(item.id, item.size))}
                          aria-label={item.quantity > 1 ? 'Уменьшить количество' : 'Удалить из корзины'}
                        >
                          {item.quantity > 1 ? '−' : <TrashIcon />}
                        </button>
                        <span className="qty-value">{item.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                          aria-label="Увеличить количество"
                        >
                          +
                        </button>
                      </div>

                      <div className="cart-item-total">
                        {Math.round(item.price * item.quantity).toLocaleString('ru-RU')} KZT
                      </div>
                    </div>
                  </div>
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
                <span>При оформлении</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-total">
                <span>Всего</span>
                <span className="total-price">{Math.round(getTotalPrice()).toLocaleString('ru-RU')} KZT</span>
              </div>

              <button 
                className="btn-checkout"
                onClick={() => navigate('/checkout', { state: { noVeil: true } })}
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

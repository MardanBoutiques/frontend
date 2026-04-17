import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../navbar/NavBar';
import { useCart } from '../../context/CartContext';
import api from '../../api/axios';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    city: '',
    address: '',
    deliveryMethod: 'courier',
    paymentMethod: 'cash',
    comment: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    // Validate name (минимум 3 символа, только буквы и пробелы)
    if (!formData.customerName || formData.customerName.trim().length < 3) {
      newErrors.customerName = 'ФИО должно содержать минимум 3 символа';
    }
    
    // Validate phone (казахстанский формат)
    const phoneRegex = /^(\+7|8)?[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
    if (!formData.customerPhone || !phoneRegex.test(formData.customerPhone)) {
      newErrors.customerPhone = 'Введите корректный номер телефона (+7 или 8)';
    }
    
    // Validate email (если указан)
    if (formData.customerEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.customerEmail)) {
        newErrors.customerEmail = 'Введите корректный email';
      }
    }
    
    // Validate city
    if (!formData.city || formData.city.trim().length < 2) {
      newErrors.city = 'Укажите город';
    }
    
    // Validate address
    if (!formData.address || formData.address.trim().length < 10) {
      newErrors.address = 'Введите полный адрес (минимум 10 символов)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      alert('Корзина пуста!');
      return;
    }

    // Валидация формы
    if (!validateForm()) {
      alert('Пожалуйста, исправьте ошибки в форме');
      return;
    }

    setLoading(true);

    const orderData = {
      customer_name: formData.customerName,
      customer_phone: formData.customerPhone,
      customer_email: formData.customerEmail,
      city: formData.city,
      address: formData.address,
      delivery_method: formData.deliveryMethod,
      payment_method: formData.paymentMethod,
      comment: formData.comment,
      items: cartItems.map(item => ({
        product_id: item.id,
        product_name: item.name,
        size: item.size,
        quantity: item.quantity,
        price: item.price
      })),
      total_amount: getTotalPrice()
    };

    try {
      const response = await api.post('/orders/', orderData);
      
      if (response.status === 201) {
        clearCart();
        setOrderId(response.data.id);
        setOrderSuccess(true);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      if (error.response?.status === 429) {
        alert('Слишком много запросов. Пожалуйста, попробуйте через минуту.');
      } else {
        alert('Ошибка при оформлении заказа. Попробуйте еще раз.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="order-success-overlay">
        <div className="order-success-content">
          <p className="order-success-label">Заказ №{orderId}</p>
          <h1 className="order-success-title">Благодарим за покупку!</h1>
          <p className="order-success-text">
            Наш менеджер свяжется с вами в ближайшее время для подтверждения заказа.
          </p>
          <button className="order-success-btn" onClick={() => navigate('/')}>
            На главную
          </button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <>
        <NavBar />
        <div className="checkout-container">
          <div className="checkout-empty">
            <h2>Корзина пуста</h2>
            <p>Добавьте товары перед оформлением заказа</p>
            <button className="btn-to-catalogue" onClick={() => navigate('/catalogue')}>
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
      <div className="checkout-container">
        <div className="checkout-content">
<div className="checkout-layout">
            {/* Левая часть - форма */}
            <form className="checkout-form" onSubmit={handleSubmit}>
              {/* Контактные данные */}
              <div className="form-section">
                <h2>Контактные данные</h2>
                <div className="form-group">
                  <label htmlFor="customerName">ФИО *</label>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    required
                    placeholder="Иванов Иван Иванович"
                    className={errors.customerName ? 'error' : ''}
                  />
                  {errors.customerName && <span className="error-message">{errors.customerName}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="customerPhone">Телефон *</label>
                  <input
                    type="tel"
                    id="customerPhone"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleChange}
                    required
                    placeholder="+7 (777) 123-45-67"
                    className={errors.customerPhone ? 'error' : ''}
                  />
                  {errors.customerPhone && <span className="error-message">{errors.customerPhone}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="customerEmail">Email</label>
                  <input
                    type="email"
                    id="customerEmail"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleChange}
                    placeholder="example@mail.com"
                    className={errors.customerEmail ? 'error' : ''}
                  />
                  {errors.customerEmail && <span className="error-message">{errors.customerEmail}</span>}
                  <small>Для получения подтверждения заказа</small>
                </div>
              </div>

              {/* Адрес доставки */}
              <div className="form-section">
                <h2>Адрес доставки</h2>
                <div className="form-group">
                  <label htmlFor="city">Город *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    placeholder="Алматы"
                    className={errors.city ? 'error' : ''}
                  />
                  {errors.city && <span className="error-message">{errors.city}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="address">Адрес *</label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    placeholder="Улица, дом, квартира"
                    rows="3"
                    className={errors.address ? 'error' : ''}
                  ></textarea>
                  {errors.address && <span className="error-message">{errors.address}</span>}
                </div>
              </div>

              {/* Способ доставки */}
              <div className="form-section">
                <h2>Способ доставки</h2>
                <div className="radio-group">
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="courier"
                      checked={formData.deliveryMethod === 'courier'}
                      onChange={handleChange}
                    />
                    <div className="radio-content">
                      <span className="radio-title">Курьер (Алматы)</span>
                      <span className="radio-desc">1-2 рабочих дня</span>
                    </div>
                  </label>

                  <label className="radio-option">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="post"
                      checked={formData.deliveryMethod === 'post'}
                      onChange={handleChange}
                    />
                    <div className="radio-content">
                      <span className="radio-title">Казпочта</span>
                      <span className="radio-desc">3-5 рабочих дней</span>
                    </div>
                  </label>

                  <label className="radio-option">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="pickup"
                      checked={formData.deliveryMethod === 'pickup'}
                      onChange={handleChange}
                    />
                    <div className="radio-content">
                      <span className="radio-title">Самовывоз</span>
                      <span className="radio-desc">Бесплатно</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Способ оплаты */}
              <div className="form-section">
                <h2>Способ оплаты</h2>
                <div className="radio-group">
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={formData.paymentMethod === 'cash'}
                      onChange={handleChange}
                    />
                    <div className="radio-content">
                      <span className="radio-title">Наличными при получении</span>
                    </div>
                  </label>

                  <label className="radio-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="kaspi"
                      checked={formData.paymentMethod === 'kaspi'}
                      onChange={handleChange}
                    />
                    <div className="radio-content">
                      <span className="radio-title">Kaspi перевод</span>
                      <span className="radio-desc">Реквизиты отправит менеджер</span>
                    </div>
                  </label>

                  <label className="radio-option disabled">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      disabled
                    />
                    <div className="radio-content">
                      <span className="radio-title">Онлайн оплата картой</span>
                      <span className="radio-desc">Скоро</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Комментарий */}
              <div className="form-section">
                <div className="form-group">
                  <label htmlFor="comment">Комментарий к заказу</label>
                  <textarea
                    id="comment"
                    name="comment"
                    value={formData.comment}
                    onChange={handleChange}
                    placeholder="Дополнительная информация"
                    rows="3"
                  ></textarea>
                </div>
              </div>

              <div className="form-section">
                <button
                  type="submit"
                  className="btn-submit-order"
                  disabled={loading}
                >
                  {loading ? 'Оформление...' : 'Подтвердить заказ'}
                </button>
              </div>
            </form>

            {/* Правая часть - сводка заказа */}
            <div className="order-summary">
              <h2>Ваш заказ</h2>
              
              <div className="summary-items">
                {cartItems.map((item, index) => (
                  <div key={`${item.id}-${item.size}-${index}`} className="summary-item">
                    <div className="summary-item-info">
                      <span className="summary-item-name">{item.name}</span>
                      <span className="summary-item-details">
                        Размер: {item.size} × {item.quantity}
                      </span>
                    </div>
                    <span className="summary-item-price">
                      {(item.price * item.quantity).toLocaleString('ru-RU')} KZT
                    </span>
                  </div>
                ))}
              </div>

              <div className="summary-divider"></div>

              <div className="summary-row">
                <span>Доставка</span>
                <span>Уточнит менеджер</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-total">
                <span>Итого</span>
                <span className="total-amount">
                  {getTotalPrice().toLocaleString('ru-RU')} KZT
                </span>
              </div>

              <div className="summary-note">
                * Менеджер свяжется с вами для подтверждения заказа
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;

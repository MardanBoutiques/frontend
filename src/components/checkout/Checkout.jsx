import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../navbar/NavBar';
import { useCart } from '../../context/CartContext';
import api from '../../api/axios';
import _PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Select from 'react-select';
import { Country, State, City } from 'country-state-city';
import { Turnstile } from '@marsidev/react-turnstile';
import './Checkout.css';

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA';

const PhoneInput = _PhoneInput.default || _PhoneInput;

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
    instagram: '',
    country: '',
    city: '',
    address: '',
    deliveryMethod: 'yandex',
    paymentMethod: 'card',
  });
  const [errors, setErrors] = useState({});
  const [turnstileToken, setTurnstileToken] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  const CIS_CODES = ['RU', 'BY', 'UA', 'UZ', 'KG', 'TJ', 'TM', 'AM', 'AZ', 'GE', 'MD'];

  const getDeliveryZone = (countryCode, city) => {
    const ct = (city || '').toLowerCase().trim();
    if (!countryCode || countryCode === 'KZ') {
      if (['алматы', 'almaty', 'астана', 'astana', 'nur-sultan', 'нур-султан'].includes(ct)) {
        return 'almaty';
      }
      return 'kazakhstan';
    }
    if (CIS_CODES.includes(countryCode)) return 'cis';
    return 'international';
  };

  const countryOptions = Country.getAllCountries().map(c => ({
    value: c.isoCode,
    label: c.name,
  }));

  const stateList = selectedCountry
    ? State.getStatesOfCountry(selectedCountry.value)
    : [];
  const hasStates = stateList.length > 0;

  const stateOptions = stateList.map(s => ({
    value: s.isoCode,
    label: s.name,
  }));

  const cityOptions = selectedCountry
    ? (hasStates && selectedState
        ? City.getCitiesOfState(selectedCountry.value, selectedState.value)
        : hasStates
          ? []
          : City.getCitiesOfCountry(selectedCountry.value)
      ).map(c => ({ value: c.name, label: c.name }))
    : [];

  const DELIVERY_OPTIONS = {
    almaty: [
      { value: 'yandex', title: 'Яндекс Доставка', desc: 'Алматы и Астана · По тарифу Яндекса · День в день' },
      { value: 'pickup', title: 'Самовывоз', desc: 'Бесплатно · В рабочее время магазина' },
      { value: 'kazpost', title: 'Казпочта', desc: 'По Казахстану · 2 000 ₸ · 5–9 рабочих дней (до пункта выдачи)' },
      { value: 'rika', title: 'RIKA', desc: 'По Казахстану · от 3 500 ₸ · 2–4 дня (до двери, включая посёлки)' },
    ],
    kazakhstan: [
      { value: 'kazpost', title: 'Казпочта', desc: 'По Казахстану · 2 000 ₸ · 5–9 рабочих дней (до пункта выдачи)' },
      { value: 'rika', title: 'RIKA', desc: 'По Казахстану · от 3 500 ₸ · 2–4 дня (до двери, включая посёлки)' },
    ],
    cis: [
      { value: 'cdek', title: 'СДЭК и KAZPOST', desc: 'СНГ · По тарифу · 7–14 рабочих дней (до пункта выдачи)' },
    ],
    international: [
      { value: 'international', title: 'СДЭК и KAZPOST (Международная)', desc: 'Европа, Америка и др. · По тарифу · от 2 недель (до пункта выдачи)' },
    ],
  };

  useEffect(() => {
    const zone = getDeliveryZone(selectedCountry?.value, formData.city);
    const options = DELIVERY_OPTIONS[zone];
    const current = options.find(o => o.value === formData.deliveryMethod);
    if (!current) {
      setFormData(prev => ({ ...prev, deliveryMethod: options[0].value }));
    }
  }, [selectedCountry, formData.city]);

  const validateForm = () => {
    const newErrors = {};
    
    // Validate name (минимум 3 символа, только буквы и пробелы)
    if (!formData.customerName || formData.customerName.trim().length < 3) {
      newErrors.customerName = 'ФИО должно содержать минимум 3 символа';
    }
    
    // Validate phone (минимум 7 цифр с кодом страны)
    if (!formData.customerPhone || formData.customerPhone.replace(/\D/g, '').length < 7) {
      newErrors.customerPhone = 'Введите корректный номер телефона';
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

    if (!validateForm()) {
      alert('Пожалуйста, исправьте ошибки в форме');
      return;
    }

    setLoading(true);

    const orderData = {
      customer_name: formData.customerName,
      customer_phone: formData.customerPhone,
      customer_email: formData.customerEmail,
      instagram: formData.instagram,
      city: formData.city,
      address: formData.address,
      delivery_method: formData.deliveryMethod,
      payment_method: formData.paymentMethod,
      items: cartItems.map(item => ({
        product_id: item.id,
        product_name: item.name,
        size: item.size,
        quantity: item.quantity,
        price: item.price
      })),
      total_amount: getTotalPrice(),
      turnstile_token: turnstileToken,
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
                  <PhoneInput
                    country={'kz'}
                    value={formData.customerPhone}
                    onChange={(phone) => setFormData(prev => ({ ...prev, customerPhone: '+' + phone }))}
                    inputClass={errors.customerPhone ? 'error' : ''}
                    containerClass="phone-input-container"
                    preferredCountries={['kz', 'ru', 'ua', 'uz', 'by']}
                    enableSearch
                    searchPlaceholder="Поиск страны..."
                    searchNotFound="Не найдено"
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

                <div className="form-group">
                  <label htmlFor="instagram">Instagram</label>
                  <input
                    type="text"
                    id="instagram"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleChange}
                    placeholder="@username"
                  />
                </div>
              </div>

              {/* Адрес доставки */}
              <div className="form-section">
                <h2>Адрес доставки</h2>
                <div className="form-group">
                  <label>Страна *</label>
                  <Select
                    options={countryOptions}
                    value={selectedCountry}
                    onChange={(opt) => {
                      setSelectedCountry(opt);
                      setSelectedState(null);
                      setSelectedCity(null);
                      setFormData(prev => ({ ...prev, country: opt ? opt.label : '', city: '' }));
                    }}
                    placeholder="Выберите страну..."
                    classNamePrefix="rs"
                    className={errors.country ? 'rs-error' : ''}
                    noOptionsMessage={() => 'Не найдено'}
                  />
                  {errors.country && <span className="error-message">{errors.country}</span>}
                </div>

                {hasStates && (
                  <div className="form-group">
                    <label>Штат / Провинция *</label>
                    <Select
                      options={stateOptions}
                      value={selectedState}
                      onChange={(opt) => {
                        setSelectedState(opt);
                        setSelectedCity(null);
                        setFormData(prev => ({ ...prev, city: '' }));
                      }}
                      placeholder="Выберите штат/провинцию..."
                      classNamePrefix="rs"
                      noOptionsMessage={() => 'Не найдено'}
                    />
                  </div>
                )}

                <div className="form-group">
                  <label>Город *</label>
                  <Select
                    options={cityOptions}
                    value={selectedCity}
                    onChange={(opt) => {
                      setSelectedCity(opt);
                      setFormData(prev => ({ ...prev, city: opt ? opt.label : '' }));
                    }}
                    placeholder={
                      !selectedCountry ? 'Сначала выберите страну' :
                      hasStates && !selectedState ? 'Сначала выберите штат/провинцию' :
                      'Выберите город...'
                    }
                    isDisabled={!selectedCountry || (hasStates && !selectedState)}
                    classNamePrefix="rs"
                    className={errors.city ? 'rs-error' : ''}
                    noOptionsMessage={() => 'Не найдено'}
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
                  {DELIVERY_OPTIONS[getDeliveryZone(selectedCountry?.value, formData.city)].map(opt => (
                    <label className="radio-option" key={opt.value}>
                      <input type="radio" name="deliveryMethod" value={opt.value}
                        checked={formData.deliveryMethod === opt.value} onChange={handleChange} />
                      <div className="radio-content">
                        <span className="radio-title">{opt.title}</span>
                        <span className="radio-desc">{opt.desc}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Способ оплаты */}
              <div className="form-section">
                <h2>Способ оплаты</h2>
                <div className="radio-group">
                  <label className="radio-option">
                    <input type="radio" name="paymentMethod" value="card"
                      checked={formData.paymentMethod === 'card'} onChange={handleChange} />
                    <div className="radio-content">
                      <span className="radio-title">Банковская карта</span>
                      <span className="radio-desc">Реквизиты отправит менеджер</span>
                      <div className="payment-logos">
                        <img src="/payment/visa.png" alt="Visa" className="payment-logo" />
                        <img src="/payment/mastercard.png" alt="Mastercard" className="payment-logo" />
                      </div>
                    </div>
                  </label>

                  <label className="radio-option">
                    <input type="radio" name="paymentMethod" value="kaspi"
                      checked={formData.paymentMethod === 'kaspi'} onChange={handleChange} />
                    <div className="radio-content">
                      <span className="radio-title">Kaspi</span>
                      <div className="payment-logos">
                        <img src="/payment/kaspi.png" alt="Kaspi" className="payment-logo" />
                        <img src="/payment/kaspi-kredit.png" alt="Kaspi Kredit" className="payment-logo" />
                      </div>
                    </div>
                  </label>

                </div>
              </div>

              <div className="form-section">
                <Turnstile
                  siteKey={TURNSTILE_SITE_KEY}
                  onSuccess={setTurnstileToken}
                  onExpire={() => setTurnstileToken(null)}
                  onError={() => setTurnstileToken(null)}
                  options={{ theme: 'light', language: 'ru' }}
                />
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
                {cartItems.some(item => String(item.id).startsWith('giftbox-')) && (
                  <><br /><br />* По подарочному боксу менеджер свяжется для уточнения наполнения</>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;

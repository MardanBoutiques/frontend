import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import NavBar from '../navbar/NavBar';
import { getImageUrl } from '../../utils/imageUrl';
import { useCart } from '../../context/CartContext';
import './GiftCard.css';

function GiftCard() {
  const [giftcard, setGiftCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cardType, setCardType] = useState('physical');
  const [amount, setAmount] = useState('20000');
  const [customAmount, setCustomAmount] = useState('');
  const [addedToCart, setAddedToCart] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    sessionStorage.setItem('lastCatalogueCategory', '__giftcard__');
  }, []);

  useEffect(() => {
    const fetchGiftCard = async () => {
      try {
        const response = await axios.get('/api/giftcards/');
        if (response.data && response.data.length > 0) {
          setGiftCard(response.data[0]); // Берем первую активную карту
        }
      } catch (error) {
        console.error('Error fetching gift card:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGiftCard();
  }, []);

  const handleAddToCart = () => {
    const selectedPrice = amount === 'custom' ? customAmount : amount;
    if (!selectedPrice) return;
    const typeName = cardType === 'physical' ? 'Физическая' : 'Онлайн';
    addToCart(
      {
        id: `giftcard-${cardType}-${selectedPrice}`,
        name: 'Подарочная карта',
        price: Number(selectedPrice),
        image: giftcard.image1,
      },
      `${typeName} · ${Number(selectedPrice).toLocaleString('ru-RU')} KZT`
    );
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (loading) {
    return <div className="giftcard-loading">Загрузка...</div>;
  }

  if (!giftcard) {
    return <div className="giftcard-empty">Подарочная карта не найдена</div>;
  }

  return (
    <>
      <NavBar />
      <div className="giftcard-container">
        {/* Двухколоночный layout */}
        <div className="giftcard-content">
        {/* Левая колонка - три фото вертикально */}
        <div className="giftcard-images-column">
          {giftcard.image1 && (
            <div className="giftcard-image-item">
              <img 
                src={getImageUrl(giftcard.image1)} 
                alt="Gift Card 1" 
                className="giftcard-image"
              />
            </div>
          )}
          {giftcard.image2 && (
            <div className="giftcard-image-item">
              <img 
                src={getImageUrl(giftcard.image2)} 
                alt="Gift Card 2" 
                className="giftcard-image"
              />
            </div>
          )}
          {giftcard.image3 && (
            <div className="giftcard-image-item">
              <img 
                src={getImageUrl(giftcard.image3)} 
                alt="Gift Card 3" 
                className="giftcard-image"
              />
            </div>
          )}
        </div>

        {/* Правая колонка - форма выбора */}
        <div className="giftcard-form-column">
          <h1 className="giftcard-title">{giftcard.title}</h1>
          
          {giftcard.full_description && (
            <p className="giftcard-description">{giftcard.full_description}</p>
          )}

          {/* Выбор типа карты */}
          <div className="card-type-section">
            <h3 className="section-label">Выберите тип подарочной карты</h3>
            <div className="card-type-options">
              <button
                className={`card-type-btn ${cardType === 'physical' ? 'active' : ''}`}
                onClick={() => setCardType('physical')}
              >
                <span className="type-name">Физическая</span>
                <span className="type-desc">Доступно для г.Алматы и Астана</span>
              </button>
              <button
                className={`card-type-btn ${cardType === 'digital' ? 'active' : ''}`}
                onClick={() => setCardType('digital')}
              >
                <span className="type-name">Онлайн</span>
                <span className="type-desc">Доставка по электронной почте в течение одного дня</span>
              </button>
            </div>
          </div>

          {/* Выбор суммы */}
          <div className="amount-section">
            <h3 className="section-label">Выберите сумму</h3>
            <div className="amount-options">
              {['20000', '100000', '150000', '200000', '300000'].map((value) => (
                <button
                  key={value}
                  className={`amount-btn ${amount === value ? 'active' : ''}`}
                  onClick={() => { setAmount(value); setCustomAmount(''); }}
                >
                  {Number(value).toLocaleString('ru-RU')} KZT
                </button>
              ))}
              <button
                className={`amount-btn ${amount === 'custom' ? 'active' : ''}`}
                onClick={() => setAmount('custom')}
              >
                Другая сумма
              </button>
            </div>
            {amount === 'custom' && (
              <input 
                type="number" 
                className="custom-amount-input"
                placeholder="Введите сумму"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
              />
            )}
          </div>

          {/* Кнопка добавления в корзину */}
          <button
            className="add-to-bag-btn"
            onClick={handleAddToCart}
          >
            {addedToCart ? '✓ ДОБАВЛЕНО В КОРЗИНУ' : 'ДОБАВИТЬ В КОРЗИНУ'}
          </button>

          {/* Условия использования */}
          {giftcard.terms && (
            <div className="terms-link">
              <a href="#terms">Условия использования</a>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}

export default GiftCard;

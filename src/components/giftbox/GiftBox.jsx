import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./GiftBox.css";
import NavBar from "../navbar/NavBar";
import openAxios from "../../api/axios";
import { getImageUrl } from "../../utils/imageUrl";
import { useCart } from "../../context/CartContext";

export default function GiftBox() {
  const [giftboxes, setGiftboxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    sessionStorage.setItem('lastCatalogueCategory', '__giftbox__');
    openAxios.get('/api/giftboxes/')
      .then((res) => setGiftboxes(res.data))
      .catch((err) => console.error('Ошибка загрузки:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <>
        <NavBar />
        <div className="giftbox-loading">Загрузка...</div>
      </>
    );
  }

  if (!giftboxes.length) {
    return (
      <>
        <NavBar />
        <div className="giftbox-empty">Подарочные боксы пока недоступны</div>
      </>
    );
  }

  // Берем первый активный бокс
  const giftbox = giftboxes[0];

  return (
    <>
      <NavBar />
      <div className="giftbox-container">
        <section className="giftbox-images-section">

          {/* Карточка 1 */}
          <div className="giftbox-image-container">
            {giftbox.image1 && (
              <img src={getImageUrl(giftbox.image1)} alt="Gift Box 1" className="giftbox-image" />
            )}
            <div className="giftbox-overlay">
              {giftbox.card1_title && (
                <p className="giftbox-overlay-title">{giftbox.card1_title}</p>
              )}
              {giftbox.card1_description && (
                <p className="giftbox-overlay-text">{giftbox.card1_description}</p>
              )}
            </div>
          </div>

          {/* Карточка 2 */}
          <div className="giftbox-image-container">
            {giftbox.image2 && (
              <img src={getImageUrl(giftbox.image2)} alt="Gift Box 2" className="giftbox-image" />
            )}
            <div className="giftbox-overlay">
              {giftbox.card2_title && (
                <p className="giftbox-overlay-title">{giftbox.card2_title}</p>
              )}
              {giftbox.card2_description && (
                <p className="giftbox-overlay-text">{giftbox.card2_description}</p>
              )}
            </div>
          </div>

          {/* Карточка 3 — фото + кнопка по центру */}
          <div
            className="giftbox-image-container giftbox-order-card"
            onClick={() => {
              if (!giftbox.in_stock) return;
              addToCart(
                { id: `giftbox-${giftbox.id}`, name: giftbox.title || 'Подарочный бокс', price: Number(giftbox.price), image: giftbox.image1 },
                'Стандарт'
              );
              setAddedToCart(true);
              setTimeout(() => setAddedToCart(false), 2000);
            }}
          >
            {giftbox.image3 && (
              <img src={getImageUrl(giftbox.image3)} alt="Gift Box 3" className="giftbox-image" />
            )}
            <div className="giftbox-overlay-center">
              {giftbox.in_stock ? (
                <div className="giftbox-overlay-center-content">
                  <span className="giftbox-order-card-text">
                    {addedToCart ? '✓ ДОБАВЛЕНО В КОРЗИНУ' : 'ЗАКАЗАТЬ БОКС'}
                  </span>
                  <span className="giftbox-manager-note">Менеджер свяжется с вами для уточнения наполнения</span>
                </div>
              ) : (
                <span className="giftbox-order-card-text giftbox-order-card-unavailable">Временно недоступен</span>
              )}
            </div>
          </div>

        </section>

      </div>
    </>
  );
}

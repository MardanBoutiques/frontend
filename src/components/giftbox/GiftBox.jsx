import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./GiftBox.css";
import NavBar from "../navbar/NavBar";
import openAxios from "../../api/openAxios";

export default function GiftBox() {
  const [giftboxes, setGiftboxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGiftBoxes = async () => {
      try {
        const response = await openAxios.get('/api/giftboxes/');
        console.log('Loaded giftboxes:', response.data);
        setGiftboxes(response.data);
      } catch (error) {
        console.error('Ошибка загрузки подарочных боксов:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGiftBoxes();
  }, []);

  // Функция для получения полного URL изображения
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    const cloudName = 'dmwmkfv6w';
    const path = imagePath.startsWith('/media/') ? imagePath.replace('/media/', '') : imagePath;
    return `https://res.cloudinary.com/${cloudName}/image/upload/${path}`;
  };

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
          <div className="giftbox-image-container giftbox-order-card" onClick={() => giftbox.in_stock && navigate('/checkout')}>
            {giftbox.image3 && (
              <img src={getImageUrl(giftbox.image3)} alt="Gift Box 3" className="giftbox-image" />
            )}
            <div className="giftbox-overlay-center">
              {giftbox.in_stock ? (
                <span className="giftbox-order-card-text">ЗАКАЗАТЬ БОКС</span>
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

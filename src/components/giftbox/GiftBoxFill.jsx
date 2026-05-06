import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../navbar/NavBar";
import api from "../../api/axios";
import { getImageUrl } from "../../utils/imageUrl";
import { useCart } from "../../context/CartContext";
import "./GiftBoxFill.css";

const BOX_PRICE = 100000;

export default function GiftBoxFill() {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
    api.get("/").then((res) => {
      setProducts(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const toggle = (product) => {
    setSelected((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) return prev.filter((p) => p.id !== product.id);
      return [...prev, product];
    });
  };

  const isSelected = (id) => selected.some((p) => p.id === id);

  const selectedTotal = selected.reduce((sum, p) => sum + Number(p.price), 0);

  const handleAddToCart = () => {
    // Добавляем бокс
    addToCart(
      { id: "giftbox-main", name: "Подарочный бокс Mardan", price: BOX_PRICE, image: null },
      "Стандарт"
    );
    // Добавляем каждый выбранный товар
    selected.forEach((p) => {
      addToCart({ id: p.id, name: p.name, price: p.price, image: p.image }, "Один размер");
    });
    navigate("/cart");
  };

  return (
    <>
      <NavBar />
      <div className="giftboxfill-page">

        <div className="giftboxfill-header">
          <button className="giftboxfill-back" onClick={() => navigate("/giftbox")}>← Назад</button>
          <div className="giftboxfill-header-info">
            <h1 className="giftboxfill-title">Наполнение бокса</h1>
            <p className="giftboxfill-subtitle">Выберите товары для включения в подарочный бокс</p>
          </div>
        </div>

        {loading ? (
          <div className="giftboxfill-loading">Загрузка...</div>
        ) : (
          <div className="giftboxfill-grid">
            {products.map((product) => (
              <div
                key={product.id}
                className={`giftboxfill-card ${isSelected(product.id) ? "selected" : ""}`}
                onClick={() => toggle(product)}
              >
                <div className="giftboxfill-card-image">
                  {product.image ? (
                    <img src={getImageUrl(product.image)} alt={product.name} />
                  ) : (
                    <div className="giftboxfill-card-placeholder" />
                  )}
                  {isSelected(product.id) && (
                    <div className="giftboxfill-card-check">✓</div>
                  )}
                </div>
                <div className="giftboxfill-card-info">
                  <p className="giftboxfill-card-name">{product.name}</p>
                  <p className="giftboxfill-card-price">{Math.round(product.price).toLocaleString("ru-RU")} KZT</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Нижняя панель итоговой суммы */}
      <div className="giftboxfill-summary">
        <div className="giftboxfill-summary-prices">
          <span>Бокс — {BOX_PRICE.toLocaleString("ru-RU")} KZT</span>
          {selected.length > 0 && (
            <span>Товары ({selected.length}) — {selectedTotal.toLocaleString("ru-RU")} KZT</span>
          )}
          <strong>Итого — {(BOX_PRICE + selectedTotal).toLocaleString("ru-RU")} KZT</strong>
        </div>
        <button className="giftboxfill-btn" onClick={handleAddToCart}>
          Добавить в корзину
        </button>
      </div>
    </>
  );
}

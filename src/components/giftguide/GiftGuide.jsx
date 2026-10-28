import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../navbar/NavBar";
import openAxios from "../../api/axios";
import { getImageUrl } from "../../utils/imageUrl";
import "./GiftGuide.css";

const Accordion = ({ title, children, open, onToggle }) => (
  <div className={`gg-faq-item ${open ? "open" : ""}`}>
    <button type="button" className="gg-faq-head" onClick={onToggle}>
      <span>{title}</span>
      <span className="gg-faq-icon">{open ? "−" : "+"}</span>
    </button>
    <div className="gg-faq-wrap">
      <div className="gg-faq-clip">
        <div className="gg-faq-body">{children}</div>
      </div>
    </div>
  </div>
);

/**
 * Подарочный гид. Строение как у витрины подарочной карты в референсе:
 * блок с заголовком, кнопкой и изображением, затем такой же блок на серой
 * подложке и раздел вопросов внизу. Размеры шрифтов — из общей шкалы.
 */
const GiftGuide = () => {
  const navigate = useNavigate();
  const [cardImage, setCardImage] = useState(null);
  const [terms, setTerms] = useState("");
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    openAxios.get("/api/giftcards/")
      .then((res) => {
        const card = res.data.find((c) => c.is_active) || res.data[0];
        setCardImage(card?.image1 || null);
        setTerms(card?.terms || "");
      })
      .catch(() => setCardImage(null));
  }, []);

  const toggleFaq = (key) => setOpenFaq((prev) => (prev === key ? null : key));

  return (
    <>
      <NavBar />

      <div className="gg-page">
        {/* Подарочная карта */}
        <section className="gg-hero">
          <div className="gg-intro">
            <h1 className="gg-title">
              Пусть джентльмен выберет сам{" "}
              <br className="gg-br" />
              <span className="gg-title-soft">с нашей подарочной картой</span>
            </h1>
            <button type="button" className="gg-btn" onClick={() => navigate("/giftcard")}>
              Выбрать карту
            </button>
          </div>

          {cardImage && (
            <div className="gg-visual gg-visual-card">
              <img src={getImageUrl(cardImage)} alt="Подарочная карта Mardan" />
            </div>
          )}
        </section>

        {/* Подарочный бокс — на серой подложке, как второй блок в референсе */}
        <section className="gg-section">
          <div className="gg-intro">
            <h2 className="gg-title">
              <span className="gg-title-soft">Либо вручите символ внимания,</span>{" "}
              <br className="gg-br" />
              собранный вами лично
            </h2>
            <button type="button" className="gg-btn" onClick={() => navigate("/giftbox")}>
              Собрать бокс
            </button>
          </div>

          <div className="gg-visual gg-visual-box">
            <img src="/photos/gift-box.png" alt="Подарочный бокс Mardan" />
          </div>
        </section>

        {/* Вопросы */}
        <section className="gg-faq">
          <h2 className="gg-faq-title">Частые вопросы</h2>

          <Accordion
            title="Чем отличается карта от бокса"
            open={openFaq === "diff"}
            onToggle={() => toggleFaq("diff")}
          >
            <p>
              Подарочная карта оставляет выбор за получателем — он придёт в бутик
              или на сайт и соберёт образ сам. Подарочный бокс вы наполняете
              лично: выбираете вещи и аксессуары, мы упаковываем их вместе.
            </p>
          </Accordion>

          <Accordion
            title="Где можно использовать подарочную карту"
            open={openFaq === "where"}
            onToggle={() => toggleFaq("where")}
          >
            <p>
              Только в том бутике, где она была приобретена: карта, купленная в
              Алматы, принимается в бутике Алматы, купленная в Астане — в бутике
              Астаны. Адреса и режим работы — на странице{" "}
              <button type="button" className="gg-link" onClick={() => navigate("/stores")}>
                магазинов
              </button>
              .
            </p>
          </Accordion>

          {terms && (
            <Accordion
              title="Условия использования"
              open={openFaq === "terms"}
              onToggle={() => toggleFaq("terms")}
            >
              <p style={{ whiteSpace: "pre-line" }}>{terms}</p>
            </Accordion>
          )}
        </section>
      </div>
    </>
  );
};

export default GiftGuide;

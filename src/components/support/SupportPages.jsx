import { useState } from "react";
import { Link } from "react-router-dom";

const CONTACT_CARDS = [
  { label: "Email", value: "mardan.essential@mail.ru", href: "mailto:mardan.essential@mail.ru" },
  { label: "WhatsApp — Алматы", value: "+7 707 165 18 62", href: "https://wa.me/77071651862" },
  { label: "WhatsApp — Астана", value: "+7 771 269 96 45", href: "https://wa.me/77712699645" },
];

const ContactCards = () => (
  <div className="support-contact-cards">
    {CONTACT_CARDS.map((c) => (
      <a
        key={c.label}
        href={c.href}
        target={c.href.startsWith("http") ? "_blank" : undefined}
        rel={c.href.startsWith("http") ? "noreferrer" : undefined}
        className="support-contact-card"
      >
        <span className="support-contact-label">{c.label}</span>
        <span className="support-contact-value">{c.value}</span>
      </a>
    ))}
  </div>
);

export const SupportOverview = () => (
  <div>
    <p className="support-label">Поддержка</p>
    <h1 className="support-title">Чем можем помочь?</h1>
    <ContactCards />
  </div>
);

const FAQ_ITEMS = [
  {
    q: "Как оформить заказ?",
    a: "Добавьте товары в корзину и оформите заказ на странице оплаты — понадобятся имя, телефон, город и адрес доставки.",
  },
  {
    q: "Как я узнаю, что заказ подтверждён?",
    a: "После оформления с вами свяжется менеджер по указанному телефону или Instagram для подтверждения деталей и оплаты.",
  },
  {
    q: "Можно ли примерить вещь перед покупкой?",
    a: "Да, запишитесь на примерку в бутик в Алматы или Астане — адреса и часы работы на странице «Магазины».",
  },
  {
    q: "Какие размеры доступны?",
    a: "Доступные размеры указаны на странице каждого товара. Если сомневаетесь с выбором — напишите нам, поможем подобрать.",
  },
];

const Accordion = ({ q, a, open, onToggle }) => (
  <div className={`support-faq-item ${open ? "open" : ""}`}>
    <button className="support-faq-question" onClick={onToggle} type="button">
      <span>{q}</span>
      <span className="support-faq-icon">{open ? "−" : "+"}</span>
    </button>
    {open && <p className="support-faq-answer">{a}</p>}
  </div>
);

export const SupportFaq = () => {
  const [openFaq, setOpenFaq] = useState(0);
  return (
    <div>
      <p className="support-label">Частые вопросы</p>
      <div className="support-faq-list">
        {FAQ_ITEMS.map((item, i) => (
          <Accordion
            key={item.q}
            q={item.q}
            a={item.a}
            open={openFaq === i}
            onToggle={() => setOpenFaq(openFaq === i ? -1 : i)}
          />
        ))}
      </div>
    </div>
  );
};

const DELIVERY_METHODS = [
  { name: "Яндекс Доставка", note: "Алматы и Астана" },
  { name: "Самовывоз", note: "из бутика в Алматы или Астане" },
  { name: "Казпочта", note: "по Казахстану" },
  { name: "RIKA", note: "по Казахстану" },
  { name: "СДЭК и KAZPOST", note: null },
  { name: "Международная доставка", note: "СНГ, Турция, ОАЭ и другие страны" },
];

export const SupportShipping = () => (
  <div>
    <p className="support-label">Доставка и возврат</p>
    <p className="support-body">
      Мы отправляем заказы по Казахстану и на международные направления. Точные сроки и стоимость доставки
      менеджер уточнит при подтверждении заказа — они зависят от города и выбранного способа.
    </p>
    <div className="support-delivery-grid">
      {DELIVERY_METHODS.map((m) => (
        <div key={m.name} className="support-delivery-item">
          <span className="support-delivery-name">{m.name}</span>
          {m.note && <span className="support-delivery-note">{m.note}</span>}
        </div>
      ))}
    </div>

    <p className="support-label support-subsection-label">Возврат и обмен</p>
    <p className="support-body support-placeholder">
      Раздел уточняется. Напишите нам в WhatsApp или на почту — поможем с возвратом или обменом
      индивидуально по каждому заказу.
    </p>
  </div>
);

export const SupportTerms = () => (
  <div>
    <p className="support-label">Условия использования</p>
    <h1 className="support-title">Условия использования сайта</h1>

    <p className="support-body">
      Сайт Mardan — каталог коллекций бутиков Mardan (Алматы и Астана) и форма для оформления заявки на заказ.
      Используя сайт, вы соглашаетесь с условиями ниже. Если что-то не понятно — свяжитесь с нами через
      контакты на странице «Поддержка».
    </p>

    <p className="support-label support-subsection-label">Оформление заказа</p>
    <p className="support-body">
      Заказ на сайте оформляется в виде заявки: вы указываете товары, контактные данные и способ доставки.
      Отправка заявки не означает автоматического списания оплаты и не является окончательным подтверждением
      покупки — после отправки с вами свяжется менеджер по телефону, WhatsApp или Instagram, чтобы уточнить
      наличие, размер, стоимость доставки и детали заказа. Заказ считается подтверждённым только после этого
      согласования с менеджером.
    </p>
    <p className="support-body">
      Регистрация или создание аккаунта для заказа не требуется.
    </p>

    <p className="support-label support-subsection-label">Оплата</p>
    <p className="support-body">
      Оплата не производится автоматически на сайте. Способ оплаты (перевод на Kaspi, банковской картой или
      наличными) и порядок оплаты менеджер согласовывает с вами индивидуально при подтверждении заказа.
    </p>

    <p className="support-label support-subsection-label">Доставка, возврат и обмен</p>
    <p className="support-body">
      Условия и сроки доставки, а также порядок возврата и обмена описаны на странице{" "}
      <Link to="/support/shipping" className="support-inline-link">«Доставка и возврат»</Link>.
    </p>

    <p className="support-label support-subsection-label">Товары и цены</p>
    <p className="support-body">
      Мы стараемся поддерживать каталог, наличие и цены в актуальном состоянии, но не исключаем отдельных
      неточностей или задержек в обновлении — окончательное наличие и цена всегда подтверждаются менеджером
      при обработке заявки. Изображения товаров могут немного отличаться от изделия из-за особенностей экрана
      или партии ткани.
    </p>

    <p className="support-label support-subsection-label">Персональные данные</p>
    <p className="support-body">
      Данные, указанные в заявке (имя, телефон, адрес и другие контакты), используются только для обработки
      и доставки вашего заказа и связи с вами. Подробнее — на странице{" "}
      <Link to="/support/privacy" className="support-inline-link">«Конфиденциальность»</Link>.
    </p>

    <p className="support-label support-subsection-label">Применимое право</p>
    <p className="support-body">
      Отношения между Mardan и покупателем регулируются законодательством Республики Казахстан, включая
      законодательство о защите прав потребителей.
    </p>

    <p className="support-label support-subsection-label">Изменение условий</p>
    <p className="support-body">
      Мы можем обновлять эти условия — актуальная версия всегда доступна на этой странице. По вопросам,
      связанным с уже подтверждённым заказом, применяются условия, действовавшие на момент подтверждения.
    </p>
  </div>
);

export const SupportPrivacy = () => (
  <div>
    <p className="support-label">Конфиденциальность</p>
    <h1 className="support-title">Политика конфиденциальности</h1>

    <p className="support-body">
      Конфиденциальность ваших данных важна для Mardan. Здесь мы объясняем, какие данные собираем при
      использовании сайта, зачем и как их используем. Используя сайт Mardan, вы соглашаетесь с условиями
      этой страницы. Вопросы — на <a href="mailto:mardan.essential@mail.ru" className="support-inline-link">mardan.essential@mail.ru</a>.
    </p>

    <p className="support-label support-subsection-label">Какие данные мы собираем</p>
    <p className="support-body">
      При оформлении заявки на заказ вы указываете: имя, номер телефона, email и Instagram (по желанию),
      город и адрес доставки, выбранный способ доставки и предпочитаемый способ оплаты, а также состав
      заказа. Эти данные вы предоставляете добровольно, заполняя форму заказа.
    </p>
    <p className="support-body">
      Форма заказа также проходит защиту от спама и автоматических обращений (Cloudflare Turnstile) — при
      этом ваш IP-адрес используется кратко, только для проверки, и не сохраняется вместе с заказом.
    </p>

    <p className="support-label support-subsection-label">Как мы используем данные</p>
    <p className="support-body">
      Собранные данные используются для: оформления и обработки заказа, связи с вами по вопросам заказа и
      доставки, клиентской поддержки, а также защиты сайта от спама и злоупотреблений. Мы не используем ваши
      данные для маркетинговых рассылок или рекламного таргетинга — сайт Mardan не подключён к сервисам
      аналитики или рекламным пикселям.
    </p>

    <p className="support-label support-subsection-label">Cookies и локальное хранение</p>
    <p className="support-body">
      На сайте не установлены Google Analytics, рекламные пиксели или системы отслеживания посетителей. Мы
      используем только технически необходимые файлы: служебные cookies для работы сайта и защиты формы
      заказа от спама (Cloudflare Turnstile), а также локальное хранилище браузера (localStorage) — чтобы
      сохранить содержимое вашей корзины между визитами. Эти данные о корзине хранятся только в вашем
      браузере и никуда не передаются.
    </p>

    <p className="support-label support-subsection-label">Передача данных третьим лицам</p>
    <p className="support-body">
      Мы не продаём и не передаём ваши персональные данные для рекламных целей. Данные могут передаваться
      только: службам доставки — для выполнения доставки заказа; Cloudflare — для защиты формы заказа от
      спама; либо по прямому требованию законодательства.
    </p>

    <p className="support-label support-subsection-label">Хранение данных</p>
    <p className="support-body">
      Данные заказа хранятся столько, сколько необходимо для его обработки, доставки и решения возможных
      вопросов по нему, а также в течение сроков, установленных законодательством Республики Казахстан.
    </p>

    <p className="support-label support-subsection-label">Ваши права</p>
    <p className="support-body">
      Вы можете запросить доступ к своим данным, их исправление или удаление, обратившись по адресу{" "}
      <a href="mailto:mardan.essential@mail.ru" className="support-inline-link">mardan.essential@mail.ru</a>{" "}
      или через контакты на странице <Link to="/support/contact" className="support-inline-link">«Связаться с нами»</Link>.
    </p>

    <p className="support-label support-subsection-label">Изменения политики</p>
    <p className="support-body">
      Мы можем время от времени обновлять эту страницу. Актуальная версия всегда доступна здесь.
    </p>
  </div>
);

export const SupportContact = () => (
  <div>
    <p className="support-label">Связаться с нами</p>
    <h2 className="support-quote">Не нашли ответ? Напишите — ответим быстро.</h2>
    <ContactCards />
    <p className="support-body" style={{ marginTop: 32 }}>
      Или посмотрите <Link to="/stores" className="support-inline-link">адреса бутиков</Link> и запишитесь на примерку.
    </p>
  </div>
);

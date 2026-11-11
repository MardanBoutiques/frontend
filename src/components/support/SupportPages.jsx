import { useState } from "react";
import { Link } from "react-router-dom";
import { useSupportPage } from "./useSupportPages";

/* Страницы раздела «Поддержка» собираются из блоков, которые приходят из
   админки (раздел «Страницы поддержки»). Вид блока задаёт поле kind, и для
   каждого вида здесь своя разметка — ровно та, что была у этих страниц,
   когда текст лежал в коде.

   Текст блока — обычный, без HTML:
     пустая строка        — новый абзац,
     перенос строки       — перенос внутри абзаца,
     [текст](адрес)       — ссылка,
     строка со чертой «|» — строка таблицы, вопрос-ответ или контакт.

   Разметки сложнее нет намеренно: это страницы с юридическим текстом, и
   возможность вставить произвольный HTML из админки означала бы, что любая
   опечатка рушит вид страницы, а чужой скрипт — попадает на сайт. */

const LINK = /\[([^\]]+)\]\(([^)]+)\)/g;

/* Адреса ссылок: список схем закрытый.

   Текст страниц набирают в админке, а читают его все посетители сайта.
   React 18 выводит в href что угодно, включая javascript: — в боевой сборке
   даже без предупреждения в консоли. Поэтому ссылкой становится только путь
   внутри сайта или адрес из этого набора; остальное остаётся просто текстом.
   Такая же проверка стоит на сервере, при сохранении блока. */
const SAFE_SCHEME = /^(https?:|mailto:|tel:)/i;

/* Путь внутри сайта: одна косая черта, но не две — «//evil.com» браузер
   читает как адрес другого сайта */
const INTERNAL_PATH = /^\/(?![/\\])/;

/* Табуляцию и переводы строк браузер из адреса выбрасывает при разборе, и
   «/<таб>/evil.kz» превращается у него в «//evil.kz» — адрес чужого сайта.
   Поэтому проверяем адрес в том виде, в каком его увидит браузер. */
const clean = (href) => (href || "").replace(/[\t\n\r\0]/g, "").trim();

const isInternal = (href) => INTERNAL_PATH.test(href);
const isSafe = (href) => isInternal(href) || SAFE_SCHEME.test(href);

/** Текст одной строки: превращает [текст](адрес) в ссылку. */
const Inline = ({ text }) => {
  const parts = text.split(LINK);
  // split с двумя группами возвращает [текст, подпись, адрес, текст, ...]
  return (
    <>
      {parts.map((part, i) => {
        if (i % 3 === 0) return part;
        if (i % 3 === 2) return null; // адрес уже использован подписью рядом
        const href = clean(parts[i + 1]);
        if (!isSafe(href)) {
          // Адрес не из разрешённых — остаётся подпись без ссылки
          return <span key={i}>{part}</span>;
        }
        const inner = isInternal(href) ? (
          <Link to={href} className="support-inline-link">{part}</Link>
        ) : (
          <a
            href={href}
            className="support-inline-link"
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noreferrer" : undefined}
          >
            {part}
          </a>
        );
        return <span key={i}>{inner}</span>;
      })}
    </>
  );
};

/** Текст блока: пустая строка — абзац, перенос строки — перенос. */
const Body = ({ text }) => {
  const paragraphs = text.split(/\n[ \t]*\n/);
  return (
    <>
      {paragraphs.map((paragraph, p) => (
        <span key={p}>
          {p > 0 && (
            <>
              <br />
              <br />
            </>
          )}
          {paragraph.split("\n").map((line, l) => (
            <span key={l}>
              {l > 0 && <br />}
              <Inline text={line} />
            </span>
          ))}
        </span>
      ))}
    </>
  );
};

const Heading = ({ text }) =>
  text ? <p className="support-label support-subsection-label">{text}</p> : null;

/** Строки блока, разобранные по вертикальной черте. */
const rowsOf = (body) =>
  body
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.split("|").map((cell) => cell.trim()));

const Table = ({ heading, body }) => {
  const [headers, ...rows] = rowsOf(body);
  if (!headers) return null;
  return (
    <div className="support-shipping-table-block">
      <Heading text={heading} />
      <div className="support-shipping-table-scroll">
        <table className="support-shipping-table">
          <thead>
            <tr>
              {headers.map((h, i) => <th key={i}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => <td key={j}>{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Accordion = ({ q, a, open, onToggle }) => (
  <div className={`support-faq-item ${open ? "open" : ""}`}>
    <button className="support-faq-question" onClick={onToggle} type="button">
      <span>{q}</span>
      <span className="support-faq-icon">{open ? "−" : "+"}</span>
    </button>
    <div className="support-faq-wrap">
      <div className="support-faq-clip">
        <p className="support-faq-answer"><Body text={a} /></p>
      </div>
    </div>
  </div>
);

const FaqList = ({ items }) => {
  // Первый вопрос открыт: страница не должна выглядеть пустым списком кнопок
  const [openAt, setOpenAt] = useState(0);
  return (
    <div className="support-faq-list">
      {items.map((item, i) => (
        <Accordion
          key={item.heading + i}
          q={item.heading}
          a={item.body}
          open={openAt === i}
          onToggle={() => setOpenAt(openAt === i ? -1 : i)}
        />
      ))}
    </div>
  );
};

const ContactCards = ({ body }) => (
  <div className="support-contact-cards">
    {rowsOf(body).map(([label, value, rawHref], i) => {
      const href = clean(rawHref);
      const lines = (
        <>
          <span className="support-contact-label">{label}</span>
          <span className="support-contact-value">{value}</span>
        </>
      );
      // Адрес не из разрешённых — карточка остаётся, но не ведёт никуда
      if (!href || !isSafe(href)) {
        return <div key={i} className="support-contact-card">{lines}</div>;
      }
      return (
        <a
          key={i}
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noreferrer" : undefined}
          className="support-contact-card"
        >
          {lines}
        </a>
      );
    })}
  </div>
);

const Block = ({ section }) => {
  const { kind, heading, body } = section;

  if (kind === "table") return <Table heading={heading} body={body} />;
  if (kind === "contacts") return <ContactCards body={body} />;
  if (kind === "quote") return <p className="support-quote"><Body text={body} /></p>;
  if (kind === "note") return <p className="support-note"><Body text={body} /></p>;

  const className =
    kind === "details" ? "support-body support-placeholder" : "support-body";

  return (
    <>
      <Heading text={heading} />
      {body && <p className={className}><Body text={body} /></p>}
    </>
  );
};

/* Вопросы-ответы идут одним списком, а не вереницей отдельных блоков:
   раскрытие одного должно закрывать остальные. */
const groupFaq = (sections) => {
  const out = [];
  sections.forEach((section) => {
    const last = out[out.length - 1];
    if (section.kind === "faq") {
      if (last && last.faq) last.items.push(section);
      else out.push({ faq: true, items: [section] });
    } else {
      out.push(section);
    }
  });
  return out;
};

const SupportPage = ({ slug }) => {
  const { page, failed } = useSupportPage(slug);

  if (!page) {
    return (
      <div>
        {failed && (
          <p className="support-body">
            Страница сейчас недоступна. Напишите нам на{" "}
            <a href="mailto:mardan.essential@mail.ru" className="support-inline-link">
              mardan.essential@mail.ru
            </a>{" "}
            — пришлём нужный документ.
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      <h1 className="support-title">{page.title}</h1>
      {groupFaq(page.sections).map((item, i) =>
        item.faq
          ? <FaqList key={i} items={item.items} />
          : <Block key={i} section={item} />
      )}
    </div>
  );
};

export default SupportPage;

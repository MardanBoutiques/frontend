import { useEffect, useState } from "react";
import openAxios from "../../api/axios";

/* Текст страниц поддержки лежит в базе и правится в админке.

   Все шесть приходят одним ответом: меню раздела показывает названия всех
   сразу, и запрашивать их по одной значило бы шесть запросов на первый же
   заход. Ответ запоминается в модуле — переход между страницами раздела
   обходится без сети.

   ПОРЯДОК разделов задаётся в админке, здесь он не трогается. */

let cache = null;
let inFlight = null;

const load = () => {
  if (cache) return Promise.resolve(cache);
  if (!inFlight) {
    inFlight = openAxios
      .get("/api/support-pages/")
      .then((res) => {
        cache = Array.isArray(res.data) ? res.data : [];
        return cache;
      })
      .finally(() => {
        inFlight = null;
      });
  }
  return inFlight;
};

/** Все страницы раздела: { pages, failed } — failed при недоступном API. */
export const useSupportPages = () => {
  const [pages, setPages] = useState(cache || []);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (cache) return;
    let alive = true;
    load()
      .then((data) => alive && setPages(data))
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
    };
  }, []);

  return { pages, failed, loaded: pages.length > 0 };
};

/** Одна страница по адресу, пока не загрузилась — undefined. */
export const useSupportPage = (slug) => {
  const { pages, failed, loaded } = useSupportPages();
  return { page: pages.find((p) => p.slug === slug), failed, loaded };
};

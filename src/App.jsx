import React, { Suspense, lazy } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes, Navigate, useSearchParams } from "react-router-dom";
import { CartProvider } from "./context/CartContext";

import Home from "./components/home/Home";
import Catalogue from "./components/catalogue/Catalogue";
import ProductView from "./components/productview/ProductView";
import Cart from "./components/cart/Cart";
import GiftBox from "./components/giftbox/GiftBox";
import GiftCard from "./components/giftcard/GiftCard";
import GiftGuide from "./components/giftguide/GiftGuide";
import Stores from "./components/stores/Stores";
import Footer from "./components/footer/Footer";
import About from "./components/about/About";
import SupportLayout from "./components/support/SupportLayout";
import SupportPage from "./components/support/SupportPages";
import Vacancies from "./components/vacancies/Vacancies";
import VacancyDetail from "./components/vacancies/VacancyDetail";
import ScrollToTop from "./components/ScrollToTop";
import RouteVeil from "./components/transition/RouteVeil";

const Checkout = lazy(() => import("./components/checkout/Checkout"));

function CatalogueGuard() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  if (!category) return <Navigate to="/" replace />;
  return <Catalogue />;
}

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <ScrollToTop />
        <RouteVeil />
        {/* Страница всегда занимает экран целиком, иначе на короткой или ещё
            не загруженной странице футер подъезжает под шапку */}
        <div className="page-shell">
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogue" element={<CatalogueGuard />} />
          <Route path="/product/:id" element={<ProductView />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Suspense fallback={<div style={{marginTop:'70px',minHeight:'calc(100vh - 70px)',background:'#fff'}} />}><Checkout /></Suspense>} />
          <Route path="/giftbox" element={<GiftBox />} />
          <Route path="/giftcard" element={<GiftCard />} />
          <Route path="/gift-guide" element={<GiftGuide />} />
          <Route path="/stores" element={<Stores />} />
          <Route path="/stores/:storeId" element={<Stores />} />
          <Route path="/about" element={<About />} />
          <Route path="/support" element={<SupportLayout />}>
            <Route index element={<Navigate to="faq" replace />} />
            {/* Адреса перечислены, а не взяты из базы: чужой путь должен
                по-прежнему уводить на главную, а не показывать пустую страницу */}
            <Route path="faq" element={<SupportPage slug="faq" />} />
            <Route path="shipping" element={<SupportPage slug="shipping" />} />
            <Route path="terms" element={<SupportPage slug="terms" />} />
            <Route path="offer" element={<SupportPage slug="offer" />} />
            <Route path="privacy" element={<SupportPage slug="privacy" />} />
            <Route path="contact" element={<SupportPage slug="contact" />} />
          </Route>
          <Route path="/vacancies" element={<Vacancies />} />
          <Route path="/vacancies/:id" element={<VacancyDetail />} />
          {/* Ничего не совпало — возвращаем на главную, а не пустой экран */}
          <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;

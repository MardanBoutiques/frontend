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
import Stores from "./components/stores/Stores";
import Footer from "./components/footer/Footer";
import About from "./components/about/About";
import SupportLayout from "./components/support/SupportLayout";
import {
  SupportFaq,
  SupportShipping,
  SupportTerms,
  SupportOffer,
  SupportPrivacy,
  SupportContact,
} from "./components/support/SupportPages";
import Vacancies from "./components/vacancies/Vacancies";
import VacancyDetail from "./components/vacancies/VacancyDetail";
import ScrollToTop from "./components/ScrollToTop";

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
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogue" element={<CatalogueGuard />} />
          <Route path="/product/:id" element={<ProductView />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Suspense fallback={<div style={{marginTop:'70px',minHeight:'calc(100vh - 70px)',background:'#fff'}} />}><Checkout /></Suspense>} />
          <Route path="/giftbox" element={<GiftBox />} />
          <Route path="/giftcard" element={<GiftCard />} />
          <Route path="/stores" element={<Stores />} />
          <Route path="/about" element={<About />} />
          <Route path="/support" element={<SupportLayout />}>
            <Route index element={<Navigate to="faq" replace />} />
            <Route path="faq" element={<SupportFaq />} />
            <Route path="shipping" element={<SupportShipping />} />
            <Route path="terms" element={<SupportTerms />} />
            <Route path="offer" element={<SupportOffer />} />
            <Route path="privacy" element={<SupportPrivacy />} />
            <Route path="contact" element={<SupportContact />} />
          </Route>
          <Route path="/vacancies" element={<Vacancies />} />
          <Route path="/vacancies/:id" element={<VacancyDetail />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;

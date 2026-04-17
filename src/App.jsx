import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CartProvider } from "./context/CartContext";

import Products from "./components/products/Products";
import Home from "./components/home/Home";
import Wishlist from "./components/wishlist/Wishlist";
import Catalogue from "./components/catalogue/Catalogue";
import ProductView from "./components/productview/ProductView";
import Cart from "./components/cart/Cart";
import Checkout from "./components/checkout/Checkout";
import GiftBox from "./components/giftbox/GiftBox";
import GiftCard from "./components/giftcard/GiftCard";
import Stores from "./components/stores/Stores";
import Footer from "./components/footer/Footer";

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogue" element={<Catalogue />} />
          <Route path="/product/:id" element={<ProductView />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/giftbox" element={<GiftBox />} />
          <Route path="/giftcard" element={<GiftCard />} />
          <Route path="/stores" element={<Stores />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;

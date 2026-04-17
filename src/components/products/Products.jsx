import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../api/axios";
import useOrders from "../../hooks/useOrder";

export default function Products() {
  const [category, setCategory] = useState([]);
  const [shownProducts, setShownProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const { addOrder, removeOrder, submitOrders, isOrdered } = useOrders();
  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams.has("category")) {
      setCategory(searchParams.get("category"));
    }
  }, [searchParams]);

  useEffect(() => {
    // Fetch data from Django API
    // try {

    api
      .get(`/products`)
      .then((response) => {
        if (response.status != 200) {
          throw new Error("Network response was not ok");
        }
        return response.data;
      })
      .then((data) => {
        setShownProducts(data); // Update state with fetched data
        console.log(data);
        setLoading(false); // Set loading to false
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
    // } catch (err) {
    //   setError(err.message);
    //   setLoading(false);
    // }
  }, [category]);

  return (
    <>
      <input
        type="text"
        value={category}
        onChange={(e) => {
          setCategory(e.target.value);
        }}
      />
      <button
        onClick={() => {
          console.log(localStorage);
          navigate("/wishlist");
          console.log(localStorage);
        }}
      >
        Wishlist
      </button>
      <button
        onClick={() => {
          submitOrders();
        }}
      >
        Save to Wishlist
      </button>
      {error && <h1>{error}</h1>}
      {loading && <div>Loading...</div>}
      {!loading &&
        shownProducts &&
        shownProducts.map((shownProduct) => (
          <div key={shownProduct.name}>
            <h1>{shownProduct.name}</h1>
            <h2>{shownProduct.description}</h2>
            <h3>{shownProduct.price}</h3>
            {isOrdered(shownProduct.id) && (
              <button
                onClick={() => {
                  removeOrder(shownProduct.id);
                }}
              >
                Remove froms wishlist
              </button>
            )}
            {!isOrdered(shownProduct.id) && (
              <button
                onClick={() => {
                  addOrder({ product: shownProduct.id, ...shownProduct });
                }}
              >
                Add to wishlist
              </button>
            )}
          </div>
        ))}
    </>
  );
}

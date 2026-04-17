import React, { useEffect, useState } from "react";
import api from "../../api/axios";

export default function Wishlist() {
  const [rawWishlist, setRawWishlist] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from Django API
    try {
      api
        .get("/wishlist")
        .then((response) => {
          if (response.status != 200) {
            throw new Error("Network response was not ok");
          }
          return response.data;
        })
        .then((data) => {
          setRawWishlist(data); // Update state with fetched data
          console.log(data);
          setLoading(false); // Set loading to false
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false);
        });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    for (let i in rawWishlist) {
      console.log(rawWishlist[i].product );
      api
        .get("/" + rawWishlist[i].product)
        .then((response) => {
          if (response.status != 200) {
            throw new Error("Network response was not ok");
          }
          return response.data;
        })
        .then((data) => {
          setWishlist([...wishlist, data]); // Update state with fetched data
          console.log(data);
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false);
        });
    }
  }, [rawWishlist]);

  return (
    <>
      {error && <h1>{error}</h1>}
      {loading && <h1>Loading</h1>}
      {!loading &&
        wishlist &&
        wishlist.map((preOrder) => <p key={preOrder.id}>{preOrder.id}</p>)}
    </>
  );
}

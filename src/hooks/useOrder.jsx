import { useState } from "react";
import api from "../api/axios";

// Custom hook to manage orders
function useOrders() {
  const [orders, setOrders] = useState([]); // Initialize an empty orders array

  // Function to add an order
  const addOrder = (order) => {
    setOrders((prevOrders) => [...prevOrders, order]); // Add the new order to the existing list
  };

  // Function to remove an order
  const removeOrder = (productId) => {
    setOrders((prevOrders) =>
      prevOrders.filter((order) => order.id !== productId)
    ); // Remove order by id
  };

  const isOrdered = (productId) => {
    const filtered = orders.filter((order) => order.id === productId);
    return filtered.length > 0;  // Check if there are matching orders
  };

  const submitOrders = () => {
    api.post("/wishlist", orders);
  };

  return { orders, addOrder, removeOrder, submitOrders, isOrdered };
}

export default useOrders;

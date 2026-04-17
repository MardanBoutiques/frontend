/*
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const PrivateRoutes = () => {
  let { token } = useAuth();

  console.log(token);
  console.log("accessbouticmardan", localStorage);

  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
*/
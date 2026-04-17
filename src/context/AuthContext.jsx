import { createContext, useState, useContext, useLayoutEffect } from "react";
import PropTypes from "prop-types";
import api from "../api/axios";
import chatapi from "../api/chataxios";

// Create Auth Context
const AuthContext = createContext();

export const useAuth = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("useAuth must be used within a AuthProvider");
  }

  return authContext;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    console.log(localStorage.getItem("accessbouticmardan"));
    return localStorage.getItem("accessbouticmardan");
  });

  const login = async (loginForm, actionAfter) => {
    console.log(loginForm);
    try {
      const response = await api.post("/api/token", loginForm);
      localStorage.setItem("accessbouticmardan", response.data.access);
      setToken(response.data.access);
      console.log(response.data.access);
      actionAfter();
    } catch {
      setToken(null);
    }
  };

  const logout = () => {
    localStorage.removeItem("accessbouticmardan");
  };

  useLayoutEffect(() => {
    const authInterceptor = api.interceptors.request.use((config) => {
      config.headers.Authorization =
        !config._retry && token
          ? `Bearer ${token}`
          : config.headers.Authorization;
      return config;
    });

    return () => {
      api.interceptors.request.eject(authInterceptor);
    };
  }, [token]);

  useLayoutEffect(() => {
    const refreshInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response.status === 401) {
          setToken(null);
          localStorage.removeItem("accessbouticmardan");
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(refreshInterceptor);
    };
  }, [token]);

  useLayoutEffect(() => {
    const authInterceptor = chatapi.interceptors.request.use((config) => {
      config.headers.Authorization =
        !config._retry && token
          ? `Bearer ${token}`
          : config.headers.Authorization;
      return config;
    });

    return () => {
      chatapi.interceptors.request.eject(authInterceptor);
    };
  }, [token]);

  return (
    <AuthContext.Provider value={{ login, logout, token }}>
      {children} {/* Render children components */}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired, // Validate that 'children' is a valid React node
};




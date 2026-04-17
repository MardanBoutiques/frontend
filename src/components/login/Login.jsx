import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  return (
    <div>
      <h2>Login</h2>
      <form>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            login({ username: username, password: password }, () => {
              navigate("/products");
            });
          }}
        >
          Login
        </button>
        <p>
          Not signed in? <a href="/signup">Sign up here</a>
        </p>
      </form>
      {error && <div>{error}</div>}
    </div>
  );
};

export default Login;

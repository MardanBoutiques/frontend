import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/openAxios";

const register = async (registerForm, actionAfter) => {
  try {
    const response = await api.post("/register", registerForm);

    if (response.data == "OK") {
      actionAfter(null);
    }
  } catch (error) {
    console.log(error.message);

    actionAfter(error.message);
  }
};

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  return (
    <div>
      <h2>Register</h2>
      <form className="vertical">
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First Name"
        />
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last Name"
        />
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone"
        />
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Address"
        />
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
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
            register(
              {
                first_name: firstName,
                last_name: lastName,
                phone: phone,
                address: address,
                user: {
                  email: email,
                  username: username,
                  password: password,
                },
              },
              (errorMessage) => {
                if (!errorMessage) {
                  navigate("/login");
                } else {
                  setError(errorMessage);
                }
              }
            );
          }}
        >
          Register
        </button>
      </form>
      {error && <div>{error}</div>}
    </div>
  );
};

export default Register;
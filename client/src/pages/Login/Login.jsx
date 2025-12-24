import React, { useState } from "react";
import './Login.css'
import toast, { Toaster } from 'react-hot-toast';

import { useNavigate, Link } from "react-router-dom";
import clientAxios from "../../utils/clientAxios";
import { setItem, KEY_ACCESS_TOKEN } from "../../utils/localStroage";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const result = await clientAxios.post("/auth/login", { email, password });
      setItem(KEY_ACCESS_TOKEN, result.data.result.AccessToken);
      navigate("/");

      toast.success("Login successful! Welcome back.");

    } catch (error) {
      toast.error("Login failed. Check credentials.");

    }
  }

  return (
    <div className="Login">

      <div className="Login-box">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit">Login</button>
        </form>
        <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
      </div>
    </div>
  );
};

export default Login;










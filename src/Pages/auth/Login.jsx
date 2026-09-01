import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api";
import "./signup.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !pass) {
      alert("All fields are required");
      return;
    }

    try {
      const res = await API.get("/users");

      const user = res.data.find(
        (user) => user.email === email && user.password === pass,
      );

      if (!user) {
        alert("Invalid email or password");
        return;
      }
if (user.status === "inactive") {
  alert("Your account has been deactivated by the admin.");
  return;
}
      console.log("Login successful:", user);

      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/users");
      }
    } catch (error) {
      console.log("Login error:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="main-container">
      <div className="container">
        <h1>Login</h1>

        <p className="auth-subtitle">
          Welcome back! Please login to your account.
        </p>

        <form className="Auth-form" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Enter Password"
            minLength={6}
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />

          <button type="submit">Login</button>
          <Link to="/signup">Don't have an account? Sign up</Link>
        </form>
      </div>
    </div>
  );
};

export default Login;

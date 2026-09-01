import React, { useState } from "react";
import API from "../../api";
import "./signup.css";
import '../../index.css'
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confPass, setConfPass] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !pass || !confPass) {
      alert("All fields are required");
      return;
    }

    if (pass !== confPass) {
      alert("Passwords do not match");
      return;
    }

    const existingUser = await API.get(`/users?email=${email}`);

    if (existingUser.data.length > 0) {
      alert("Email already exists");
      return;
    }

    console.log("Validation successful");

    const newUser = {
      name,
      email,
      password: pass,
      role: "user",
      status: "active",
      profilePicture: "",
    };

    try {
      const res = await API.post("/users", newUser);
      console.log(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      alert("Signup successful");
      navigate("/users");
    } catch (error) {
      alert("Signup Failed");
    }

    console.log(`Name:${name} Email:${email} Pass:${pass}`);
  };
  return (
    <div className="main-container">
      <div className="container">
        <h1>Signup</h1>

        <p className="auth-subtitle">
  Create your account to get started.
</p>

        <form className="Auth-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

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
          <input
            type="password"
            placeholder="Confirm Password"
            value={confPass}
            minLength={6}
            onChange={(e) => setConfPass(e.target.value)}
          />
          <button type="submit">SignUp</button>
          <Link to="/login">You Already have account?</Link>
        </form>
      </div>
    </div>
  );
};

export default SignUp;

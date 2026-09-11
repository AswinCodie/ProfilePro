import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api";
import "./signup.css";

const ForgetPass = () => {
  const [email, setEmail] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!email || !newPass || !confirmPass) {
      alert("All fields are required");
      return;
    }

    if (newPass !== confirmPass) {
      alert("Passwords do not match");
      return;
    }

    try {
      // Find user using email
      const res = await API.get(`/users?email=${email}`);

      if (res.data.length === 0) {
        alert("Email not found");
        return;
      }

      const user = res.data[0];

      // Update password
      await API.patch(`/users/${user.id}`, {
        password: newPass,
      });

      alert("Password changed successfully");

      navigate("/login");

    } catch (error) {
      console.log("Reset password error:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="main-container">
      <div className="container">

        <h1>Reset Password</h1>

        <p className="auth-subtitle">
          Enter your email and create a new password.
        </p>

        <form
          className="Auth-form"
          onSubmit={handleResetPassword}
        >

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Enter new password"
            minLength={6}
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm new password"
            minLength={6}
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
          />

          <button type="submit">
            Reset Password
          </button>

          <Link to="/login">
            Back to Login
          </Link>

        </form>
      </div>
    </div>
  );
};

export default ForgetPass;
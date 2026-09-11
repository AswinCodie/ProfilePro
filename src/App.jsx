import React from "react";
import { Route, Routes } from "react-router-dom";

import SignUp from "./Pages/auth/SignUp";
import UserProfile from "./Pages/UserProfile";
import Login from "./Pages/auth/Login";
import AdminPanel from "./Pages/AdminPanel";
import ProtectedRoute from "./Pages/ProtectedRoute";
import HomeRedirect from "./Pages/HomeRedirect";
import ForgotPass from "./Pages/auth/ForgotPass";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />

      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forget-pass" element={<ForgotPass/>}/>

      {/* Only users can access /users */}
      <Route
        path="/users"
        element={
          <ProtectedRoute role="user">
            <UserProfile />
          </ProtectedRoute>
        }
      />

      {/* Only admin can access /admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminPanel />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;

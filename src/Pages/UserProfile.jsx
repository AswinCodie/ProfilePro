import React from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import './userProfile.css'

const UserProfile = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const handleSignout = () => {
    localStorage.removeItem("user")
    navigate("/login");
  };


  return (
    <div>
      <nav>
         <h1>User Profile</h1>
        <button className="signOut-btn"
          onClick={handleSignout}>
          📤
        </button>
      </nav>
      <h2>Hi,{user.name}</h2>
      
      <div className="userCard">
          {/* {user.name[0].toUpperCase() ||  */}
        <div className="dp-img"><img src="https://www.nicepng.com/png/detail/128-1280406_view-user-icon-png-user-circle-icon-png.png"/></div>
        <div className="user-info">
         <h2>{user.name.toUpperCase()}</h2> 
         <h3>{user.role.toUpperCase()}</h3> 
          <p>{user.status}</p>
          <p>{user.email}</p>

        </div>

      </div>
    </div>
  );
};

export default UserProfile;

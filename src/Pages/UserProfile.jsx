import React from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "./userProfile.css";

const UserProfile = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleSignout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Change profile picture
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = async () => {
      const image = reader.result;

      try {
        // Update profile picture in JSON Server
        const res = await API.patch(`/users/${user.id}`, {
          profilePicture: image,
        });

        // Update localStorage
        localStorage.setItem("user", JSON.stringify(res.data));

        alert("Profile picture updated!");

        // Refresh to show new picture
        window.location.reload();

      } catch (error) {
        console.log(error);
        alert("Failed to update profile picture");
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div>
      <nav>
        <img
          className="navLogo"
          src="/src/assets/namelogo.png"
          alt="Logo"
        />

        <button
          className="signOut-btn"
          onClick={handleSignout}
        >
          📤
        </button>
      </nav>

      <h2>Hi, {user.name}</h2>

      <div className="userCard">

        <div className="dp-img">

          <img
            src={
              user.profilePicture ||
              "https://www.nicepng.com/png/detail/128-1280406_view-user-icon-png-user-circle-icon-png.png"
            }
            alt="Profile"
          />

          <label className="change-dp">
            Change DP

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              hidden
            />
          </label>

        </div>

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
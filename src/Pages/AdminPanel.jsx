import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "./AdminPanel.css";

const AdminPanel = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const [editingUser, setEditingUser] = useState(null);

  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  // Check admin
  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("user"));

    if (!loggedUser || loggedUser.role !== "admin") {
      navigate("/login");
      return;
    }

    fetchUsers();
  }, [navigate]);

  // Get users
  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/users/${id}`);

      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== id)
      );
    } catch (error) {
      console.log(error);
      alert("Failed to delete user");
    }
  };

  // Change status
  const handleStatus = async (user) => {
    const newStatus =
      user.status === "active" ? "inactive" : "active";

    try {
      const res = await API.patch(`/users/${user.id}`, {
        status: newStatus,
      });

      setUsers((prevUsers) =>
        prevUsers.map((item) =>
          item.id === user.id ? res.data : item
        )
      );
    } catch (error) {
      console.log(error);
      alert("Failed to change status");
    }
  };

  // Open edit modal
  const handleEdit = (user) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
  };

  // Save edited user
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editName || !editEmail) {
      alert("All fields are required");
      return;
    }

    try {
      const res = await API.patch(`/users/${editingUser.id}`, {
        name: editName,
        email: editEmail,
      });

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === editingUser.id ? res.data : user
        )
      );

      setEditingUser(null);
    } catch (error) {
      console.log(error);
      alert("Failed to update user");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Search
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  // Statistics
  const totalUsers = users.filter(
    (user) => user.role === "user"
  ).length;

  const activeUsers = users.filter(
    (user) => user.role === "user" && user.status === "active"
  ).length;

  const inactiveUsers = users.filter(
    (user) => user.role === "user" && user.status === "inactive"
  ).length;

  return (
    <div className="admin-page">

      {/* Navbar */}
      <nav className="admin-nav">

        <div>
          <h1>Admin Panel</h1>
          <p>Manage your users</p>
        </div>

        <button
          className="admin-logout"
          onClick={handleLogout}
        >
          Logout
        </button>

      </nav>


      {/* Dashboard cards */}
      <div className="stats-container">

        <div className="stat-card">
          <span>👥</span>
          <div>
            <h3>Total Users</h3>
            <strong>{totalUsers}</strong>
          </div>
        </div>

        <div className="stat-card active-card">
          <span>🟢</span>
          <div>
            <h3>Active Users</h3>
            <strong>{activeUsers}</strong>
          </div>
        </div>

        <div className="stat-card inactive-card">
          <span>🔴</span>
          <div>
            <h3>Inactive Users</h3>
            <strong>{inactiveUsers}</strong>
          </div>
        </div>

      </div>


      {/* Users section */}
      <div className="users-section">

        <div className="users-header">

          <div>
            <h2>Users</h2>
            <p>Manage registered users</p>
          </div>

          <input
            type="text"
            placeholder="🔍 Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>


        {/* Table */}
        <div className="table-container">

          <table>

            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {filteredUsers
                .filter((user) => user.role !== "admin")
                .map((user) => (

                <tr key={user.id}>

                  <td>
                    <div className="user-name">
                      <div className="avatar">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>

                      <strong>{user.name}</strong>
                    </div>
                  </td>

                  <td>{user.email}</td>

                  <td>
                    <span className="role">
                      {user.role}
                    </span>
                  </td>

                  <td>
                    <span
                      className={
                        user.status === "active"
                          ? "status active"
                          : "status inactive"
                      }
                    >
                      {user.status}
                    </span>
                  </td>

                  <td>

                    <div className="actions">

                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(user)}
                      >
                        ✏️
                      </button>

                      <button
                        className="status-btn"
                        onClick={() => handleStatus(user)}
                      >
                        {user.status === "active"
                          ? "🔴"
                          : "🟢"}
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(user.id)}
                      >
                        🗑️
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>


      {/* Edit Modal */}
      {editingUser && (

        <div className="modal-overlay">

          <div className="edit-modal">

            <h2>Edit User</h2>

            <form onSubmit={handleUpdate}>

              <label>Name</label>

              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />

              <label>Email</label>

              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
              />

              <div className="modal-buttons">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setEditingUser(null)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-btn"
                >
                  Save Changes
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

export default AdminPanel;

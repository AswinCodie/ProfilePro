import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "./AdminPanel.css";

const AdminPanel = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const [editingUser, setEditingUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const [selectedUser,setSelectedUser]=useState(null)

  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  // Check admin
  useEffect(() => {
    fetchUsers();
  }, []);

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
      "Are you sure you want to delete this user?",
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/users/${id}`);

      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    } catch (error) {
      console.log(error);
      alert("Failed to delete user");
    }
  };

  // Change status
  const handleStatus = async (user) => {
    const newStatus = user.status === "active" ? "inactive" : "active";

    try {
      const res = await API.patch(`/users/${user.id}`, {
        status: newStatus,
      });

      setUsers((prevUsers) =>
        prevUsers.map((item) => (item.id === user.id ? res.data : item)),
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
        prevUsers.map((user) => (user.id === editingUser.id ? res.data : user)),
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
  const filteredUsers = users
    .filter((user) => user.role !== "admin")
    .filter(
      (user) =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()),
    );

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const startIndex = (currentPage - 1) * usersPerPage;

  const currentUsers = filteredUsers.slice(
    startIndex,
    startIndex + usersPerPage,
  );

  // Statistics
  const totalUsers = users.filter((user) => user.role === "user").length;

  const activeUsers = users.filter(
    (user) => user.role === "user" && user.status === "active",
  ).length;

  const inactiveUsers = users.filter(
    (user) => user.role === "user" && user.status === "inactive",
  ).length;

  return (
    <div className="admin-page">
      {/* Navbar */}
      <nav className="admin-nav">
        <div>
          <h1>Admin Panel</h1>
          <p>Manage your users</p>
        </div>

        <button className="admin-logout" onClick={handleLogout}>
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
              {currentUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div
                      className="user-name clickable-user"
                      onClick={() => setSelectedUser(user)}
                    >
                      <div className="avatar">
                        <img
                          src={
                            user.profilePicture ||
                            "https://www.nicepng.com/png/detail/128-1280406_view-user-icon-png-user-circle-icon-png.png"
                          }
                          alt={user.name}
                        />
                      </div>

                      <strong>{user.name}</strong>
                    </div>
                  </td>

                  <td>{user.email}</td>

                  <td>
                    <span className="role">{user.role}</span>
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
                        {user.status === "active" ? "🔴" : "🟢"}
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
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ← Previous
            </button>

            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={currentPage === index + 1 ? "active-page" : ""}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next →
            </button>
          </div>
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

                <button type="submit" className="save-btn">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div
            className="user-details-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-modal"
              onClick={() => setSelectedUser(null)}
            >
              ✕
            </button>

            <div className="profile-details">
              <img
                src={
                  selectedUser.profilePicture ||
                  "https://www.nicepng.com/png/detail/128-1280406_view-user-icon-png-user-circle-icon-png.png"
                }
                alt={selectedUser.name}
                className="details-profile-pic"
              />

              <h2>{selectedUser.name}</h2>

              <span className="role">{selectedUser.role}</span>
            </div>

            <div className="user-details">
              <div className="detail-item">
                <span>Name</span>
                <strong>{selectedUser.name}</strong>
              </div>

              <div className="detail-item">
                <span>Email</span>
                <strong>{selectedUser.email}</strong>
              </div>

              <div className="detail-item">
                <span>Role</span>
                <strong>{selectedUser.role}</strong>
              </div>

              <div className="detail-item">
                <span>Status</span>
                <strong
                  className={
                    selectedUser.status === "active"
                      ? "details-active"
                      : "details-inactive"
                  }
                >
                  {selectedUser.status}
                </strong>
              </div>

              <div className="detail-item">
                <span>User ID</span>
                <strong>{selectedUser.id}</strong>
              </div>
            </div>

            <button
              className="close-details-btn"
              onClick={() => setSelectedUser(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;

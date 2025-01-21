import React, { useState } from "react";
import { getUsers, addUser, updateUser, deleteUser } from "../services/api";
import "./Home.css"; // 引入 CSS 檔案

const Home = () => {
  const [userList, setUserList] = useState([]);
  const [addForm, setAddForm] = useState({ username: "", age: "" });
  const [updateForm, setUpdateForm] = useState({ id: "", username: "", age: "" });
  const [deleteId, setDeleteId] = useState("");
  const [pagination, setPagination] = useState({ page_index: 1, page_size: 10 });

  const handleGetUsers = async () => {
    try {
      const data = await getUsers(pagination);
      setUserList(data.data);
    } catch (error) {
      console.error("Error fetching user list:", error);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const data = {
        username: addForm.username,
        age: parseInt(addForm.age, 10),
      };
      await addUser(data);
      alert("User added successfully!");
      setAddForm({ username: "", age: "" });
      handleGetUsers();
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Error adding user. Please check the input.");
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const data = {
        username: updateForm.username,
        age: parseInt(updateForm.age, 10),
      };
      await updateUser(updateForm.id, data);
      alert("User updated successfully!");
      setUpdateForm({ id: "", username: "", age: "" });
      handleGetUsers();
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Error updating user. Please check the input.");
    }
  };

  const handleDeleteUser = async (e) => {
    e.preventDefault();
    try {
      await deleteUser(deleteId);
      alert("User deleted successfully!");
      setDeleteId("");
      handleGetUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Error deleting user. Please check the ID.");
    }
  };

  return (
    <div className="container">
      <h1 className="title">User Management</h1>

      {/* Add User */}
      <div className="section">
        <h2 className="section-title">Add User</h2>
        <form onSubmit={handleAddUser} className="form">
          <input
            type="text"
            placeholder="Username"
            value={addForm.username}
            onChange={(e) => setAddForm({ ...addForm, username: e.target.value })}
            className="input"
            required
          />
          <input
            type="number"
            placeholder="Age"
            value={addForm.age}
            onChange={(e) => setAddForm({ ...addForm, age: e.target.value })}
            className="input"
            required
          />
          <button type="submit" className="button">
            Add User
          </button>
        </form>
      </div>

      {/* Update User */}
      <div className="section">
        <h2 className="section-title">Update User</h2>
        <form onSubmit={handleUpdateUser} className="form">
          <input
            type="number"
            placeholder="ID"
            value={updateForm.id}
            onChange={(e) => setUpdateForm({ ...updateForm, id: e.target.value })}
            className="input"
            required
          />
          <input
            type="text"
            placeholder="Username"
            value={updateForm.username}
            onChange={(e) => setUpdateForm({ ...updateForm, username: e.target.value })}
            className="input"
            required
          />
          <input
            type="number"
            placeholder="Age"
            value={updateForm.age}
            onChange={(e) => setUpdateForm({ ...updateForm, age: e.target.value })}
            className="input"
            required
          />
          <button type="submit" className="button">
            Update User
          </button>
        </form>
      </div>

      {/* Delete User */}
      <div className="section">
        <h2 className="section-title">Delete User</h2>
        <form onSubmit={handleDeleteUser} className="form">
          <input
            type="number"
            placeholder="ID"
            value={deleteId}
            onChange={(e) => setDeleteId(e.target.value)}
            className="input"
            required
          />
          <button type="submit" className="button">
            Delete User
          </button>
        </form>
      </div>

      {/* Get User List */}
      <div className="section">
        <h2 className="section-title">Get User List</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleGetUsers();
          }}
          className="form"
        >
          <input
            type="number"
            placeholder="Page Index"
            value={pagination.page_index}
            onChange={(e) => setPagination({ ...pagination, page_index: e.target.value })}
            className="input"
            required
          />
          <input
            type="number"
            placeholder="Page Size"
            value={pagination.page_size}
            onChange={(e) => setPagination({ ...pagination, page_size: e.target.value })}
            className="input"
            required
          />
          <button type="submit" className="button">
            Get User List
          </button>
        </form>
      </div>

      {/* User List Table */}
      <div className="section">
        <h2 className="section-title">User List</h2>
        <table className="table">
          <thead>
            <tr>
              <th className="table-header">ID</th>
              <th className="table-header">Username</th>
              <th className="table-header">Age</th>
            </tr>
          </thead>
          <tbody>
            {userList.map((user) => (
              <tr key={user.id}>
                <td className="table-cell">{user.id}</td>
                <td className="table-cell">{user.username}</td>
                <td className="table-cell">{user.age}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;


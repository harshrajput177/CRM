import "../LoginPage/Register.css";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const RegisterUser = () => {
  const [formData, setFormData] = useState({
    userId: "",
    name: "",
    password: "",
    role: "user",
    phone: ""
  });
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };



  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const data = new FormData();
    data.append("userId", formData.userId);
    data.append("name", formData.name);
    data.append("password", formData.password);
    data.append("role", formData.role);
    data.append("phone", formData.phone);
    if (image) data.append("image", image);

    const res = await axios.post("http://localhost:5000/api/register", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    console.log("✅ Registered:", res.data);
    toast.success(res.data.message);
    setFormData({ userId: "", name: "", password: "", role: "user", phone: "" });
    setImage(null);
  } catch (err) {
    console.error("❌ Error:", err.response?.data || err.message);
    toast.error(err.response?.data?.message || "Server error ❌");
  }
};



  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h2>Create New User</h2>

        <input
          type="text"
          name="userId"
          placeholder="User ID"
          value={formData.userId}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
        />

        <input type="file" name="image" accept="image/*" onChange={handleFileChange} />

        <button type="submit">Register User</button>
      </form>
    </div>
  );
};

export default RegisterUser;

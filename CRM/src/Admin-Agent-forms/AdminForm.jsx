import React, { useState } from "react";
import axios from "axios";
import './Admin.css';

const AdminForm = () => {
    const [formData, setFormData] = useState({
        username: "", // Added username
        name: "",
        email:"",
        phone: "",
        password: "", 
        role : "admin"
    });

    const [message, setMessage] = useState("");

    const BASE_URL = import.meta.env.VITE_BASE_URL;


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {    
        e.preventDefault();
        try {
            const response = await axios.post(`${BASE_URL}/api/Admin/Admin-register`
, formData);
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.message || "Something went wrong");
        }

        setFormData({
            username: "", // Added username
            name: "",
            email:"",
            phone: "",
            password: "",
            role : "admin"
        })
    };

    return (
        <div className="AdminContainer">
            <h2>Sign Up Admin</h2>
            <form  className='Admin-register-form'  onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label> {/* Added username field */}
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div>
                    <label>Email:</label>
                    <input
                        type="text"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>
            
                <div>
                    <label>Phone:</label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label> {/* Added password field */}
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <button className="Admin-register-btn" type="submit">Register</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default AdminForm;
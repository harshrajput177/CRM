import React, { useState } from "react";
import axios from "axios";
import '../../Styles-CSS/SalesManager-CSS/AgentForm.css';

const AgentForm = () => {
    const [formData, setFormData] = useState({
        username: "", // Added username
        name: "",
        phone: "",
        password: "", // Added password
        role: "agent",
    });

    const [message, setMessage] = useState("");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/api/Agent/Agent-register", formData);
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.message || "Something went wrong");
        }

        setFormData({
            username: "", // Added username
            name: "",
            phone: "",
            password: "",
        })
    };

    return (
        <div className="AgentContainer">
            <h2>ADD NEW AGENT</h2>
            <form onSubmit={handleSubmit}>
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
                <button  className="Agent-button-submit" type="submit">Register</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default AgentForm;


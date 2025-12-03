import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../LoginPage/Login.css";
import tesglogo from "../Images/GWI-LOGO.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

const BASE_URL = import.meta.env.VITE_BASE_URL;


const handleLogin = async (event, type) => {
  event.preventDefault();
  if (!username || !password) {
    toast.error("All fields are required.");
    return;
  }

  try {
    const url =
      type === "agent"
  ? `${BASE_URL}/api/agent-login`
  : `${BASE_URL}/api/admin-login`;



    const response = await axios.post(
      url,
      { userId: username, password, rememberMe },
      { headers: { "Content-Type": "application/json" } }
    );

if (response.status === 200) {
  console.log("Login Successful:", response.data);

  if (type === "agent") {
    // 👇 token + agentId dono store karo
  localStorage.setItem("token", response.data.token);
  localStorage.setItem("agentId", response.data.user.id); 

    navigate("/AgentDashboard"); 
  } else {
    navigate("/HRM-Dashboard");
  }
}


  } catch (error) {
    console.error("Login Error:", error.response?.data || error.message);
    toast.error(error.response?.data?.message || "Server error ❌");
  }
};


  return (
    <div className="Login-wrapper">
      <div className="Login-card">
        {/* Left Side - Form */}
        <div className="Login-left">
          <h2 className="Login-title">Welcome Back 👋</h2>
          <p className="Login-subtitle">Sign in to continue to your CRM</p>

          <form className="Tesg-main-form">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-field"
            />

            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </span>
            </div>



            <label className="Tesg-label-check">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span className="remember-me">Remember Me</span>
            </label>

            <div className="login-buttons">
            <button
  type="button"
  className="Tesg-login-button agent-btn"
  onClick={(e) => handleLogin(e, "agent")}
>
  Login Agent
</button>


              <button
                type="submit"
                className="Tesg-login-button admin-btn"
                onClick={(e) => handleLogin(e, "admin")}
              >
                Login Admin
              </button>
            </div>
          </form>
        </div>

        {/* Right Side - Image + Text */}
        <div className="Login-right">
          <img src={tesglogo} alt="Tesg Logo" className="Tesg-logo-img" />
          <h2>
            Manage your <br />
            business seamlessly with <br />
            <strong className="technobase-text-color">Technoebase CRM</strong>
          </h2>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Login;






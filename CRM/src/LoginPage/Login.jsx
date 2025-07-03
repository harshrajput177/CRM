import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../LoginPage/Login.css';
import CachedIcon from '@mui/icons-material/Cached';
import tesglogo from '../Images/Tesg-logo.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [text, setText] = useState('');
  const navigate = useNavigate();

  // Generate Random Captcha
  function generateCaptcha() {
    return Math.random().toString(36).substring(2, 8).toLocaleLowerCase();
  }

  // Refresh Captcha
  const refreshCaptcha = () => {
    setText('');
    setCaptcha(generateCaptcha());
  };

  // Form Submission Handler
  const handleLogin = async (event) => {
    event.preventDefault();

    // Validate Captcha
    if (text !== captcha) {
      toast.error('Invalid CAPTCHA. Please try again.');
      return;
    }

    if (!username || !password) {
      toast.error('All fields are required.');
      return;
    }

    try {
      // Sending login request
      const response = await axios.post('http://localhost:5000/api/Admin/Admin-login', {
        username,
        password,
        rememberMe,
      });

      // Successful login
      if (response.data.token) {
        if (rememberMe) {
          localStorage.setItem('token', response.data.token);
        } else {
          sessionStorage.setItem('token', response.data.token);
        }
        toast.success('Login Successful!');

        // Redirect to dashboard
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed!');
    }
  };

  return (
    <div className="Login-container">
      <div className="Tesg-left-panel">
        <h2>
          Manage your <br />
          business seamlessly with{' '}
          <strong className="technobase-text-color">Technoebase</strong> <br /> CRM.
        </h2>
        <div className="Tesg-logo">
          <img src={tesglogo} alt="Tesg Logo" className="Tesg-logo-img" />
        </div>
      </div>

      <div className="Tesg-right-panel">
        <h2>Sign-in</h2>

        <div className="Tesg-role-buttons">
          <div>
            <button  className="Tesg-role-button">Sign-in as Admin</button>
          </div>
          <div >
            <button className="Tesg-role-button" >Sign-in as Agent</button>
          </div>
        </div>

        <div className="Tesg-Login-form">
          <form className="Tesg-main-form" onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              placeholder="Enter Captcha"
              value={text}
              onChange={(e) => setText(e.target.value)}
              type="text"
            />

            <div className='Whole-Captcha'>
              <span className='View-Cap'>{captcha}</span>
              <span className='btn-captcha'>
                <button className='btn-cached' type="button" onClick={refreshCaptcha}><CachedIcon /></button>
              </span>
            </div>

            <label className="Tesg-label-check">
              <span className='checkbox-input'>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
              </span>
              <span className='remember-me'> Remember Me</span>
            </label>

            <button type="submit" className="Tesg-login-button">
              Login
            </button>
          </form>
        </div>
      </div>
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastClassName="custom-toast"
      />
    </div>
  );
}

export default Login;





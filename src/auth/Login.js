import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css'; 
import axios from 'axios';

const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://eventbackend2.onrender.com";

const Login = () => {
  const [email, setEmail] = useState('');
  console.log("Email",email)
  const [password, setPassword] = useState('');
  console.log("password",password)
  const navigate = useNavigate();

 
  const handleLogin = async (e) => {
    e.preventDefault();
   

try {
  const res = await axios.post(
    `${REACT_APP_API_BASE_URL}/api/auth/login`,
      // "http://localhost:5000/api/auth/login",
    {
      email,
      password,
    },
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );

  const data = res.data;
  console.log('data', data.district);

  // Store user info in localStorage
  localStorage.setItem('token', data.token);
  localStorage.setItem('district', data.district);
  localStorage.setItem('role', data.role);
  localStorage.setItem('state', data.state);

  // Navigate to district page
  navigate('/Eventlist');
} catch (error) {
  console.error('Login error:', error);

  const message =
    error.response?.data?.message || 'Login failed. Please try again.';

  alert(message);
}

  };

  return (
    <div className={styles.mainContainer}>
    <div className={styles.loginContainer}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <a href="/register">Register</a>
      </p>
    </div>
    </div>
  );
};

export default Login;

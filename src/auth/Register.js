import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Register.module.css'; // <-- CSS module import



const REACT_APP_API_BASE_URL = "https://eventbackend2.onrender.com";


const Register = () => {
  const [email, setEmail] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('subadmin');
  const navigate = useNavigate();

 const handleRegister = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post(
      `${REACT_APP_API_BASE_URL}/auth/register`,
      // "http://localhost:5000/api/auth/register",
      {
        email,
        password,
        role,
        state,
        district,
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    console.log(res)

    alert('Registered successfully. Please login.');
    navigate('/login');
  } catch (error) {
    console.error('Registration error:', error);

    const message =
      error.response?.data?.message || 'Registration failed. Please try again.';

    alert(message);
  }
};


  return (
    <div className={styles.mainContainer}>
    <div className={styles.registerContainer}>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
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
        <input
          type="state"
          value={state}
          placeholder="state"
          onChange={(e) => setState(e.target.value)}
          required
        />
        <input
          type="district"
          value={district}
          placeholder="district"
          onChange={(e) => setDistrict(e.target.value)}
          required
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="admin">Admin</option>
          <option value="subadmin">Subadmin</option>
        </select>
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
    </div>
  );
};

export default Register;

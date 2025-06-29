import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = ({ theme, toggleTheme }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    
    // For demo purposes, any non-empty username/password is valid
    login(username);
    navigate('/todos');
  };

  return (
    <div className={`login-container ${theme}`}>
      <div className="login-form">
        <div className="theme-toggle-container" style={{ textAlign: 'right', marginBottom: '1rem' }}>
          <button 
            className="theme-toggle" 
            onClick={toggleTheme}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              width: 'auto',
              boxShadow: 'none'
            }}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
        <h2>Login to Todo App</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
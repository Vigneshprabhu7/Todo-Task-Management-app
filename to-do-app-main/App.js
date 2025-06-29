import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import TodoPage from './pages/TodoPage';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <AuthProvider>
      <Router>
        <div className={`App ${theme}`}>
          <Routes>
            <Route path="/" element={<Login theme={theme} toggleTheme={toggleTheme} />} />
            <Route 
              path="/todos" 
              element={
                <ProtectedRoute>
                  <TodoPage theme={theme} toggleTheme={toggleTheme} />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

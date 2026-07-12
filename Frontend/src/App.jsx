import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import './index.css';

// Import các trang vừa tạo
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function App() {
  // Quản lý trạng thái Dark Mode ở cấp cao nhất
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark'); 
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light'); 
    }
  }, [darkMode]);

  return (
    <Router>
      <Routes>
        {/* Mặc định chuyển hướng từ '/' sang '/login' */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        <Route 
          path="/login" 
          element={<Login darkMode={darkMode} setDarkMode={setDarkMode} />} 
        />
        <Route 
          path="/register" 
          element={<Register darkMode={darkMode} setDarkMode={setDarkMode} />} 
        />
        <Route 
          path="/dashboard" 
          element={<Dashboard darkMode={darkMode} setDarkMode={setDarkMode} />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
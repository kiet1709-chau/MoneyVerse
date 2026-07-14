import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import './index.css';

// Import các trang vừa tạo
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import TransactionHistory from './pages/TransactionHistory';
import Transfer from './pages/Transfer';
import SpendingStatistics from './pages/SpendingStatistics';
import SecuritySettings from './pages/SecuritySettings';
import MobileTopUp from './pages/MobileTopUp';
import WalletTopUp from './pages/WalletTopUp';
import Bills from './pages/Bills';
import Profile from './pages/Profile';
import SavingsGoals from './pages/SavingsGoals';
import MovieTickets from './pages/MovieTickets';
import TravelBooking from './pages/TravelBooking';

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

  // --- THÊM MỚI: State quản lý Số dư và Hóa đơn/Giao dịch ---
  const [balance, setBalance] = useState(25000000);
  const [bills, setBills] = useState([
    { id: 1, name: 'Tiền học phí', amount: 2000000, dueDate: '15/07/2026', status: 'pending', provider: 'Đại học', date: '' },
    { id: 2, name: 'Tiền điện tháng 6', amount: 450000, dueDate: '20/07/2026', status: 'pending', provider: 'EVN', date: '' },
    { id: 3, name: 'Internet cáp quang', amount: 275000, dueDate: '22/07/2026', status: 'pending', provider: 'VNPT', date: '' },
  ]);
  
  // 👉 ĐÃ SỬA LỖI: Khai báo mảng transactions để tránh lỗi undefined làm crash app
  const [transactions, setTransactions] = useState([]);
  // ----------------------------------------------------------

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
          element={
            <Dashboard 
              darkMode={darkMode} 
              setDarkMode={setDarkMode} 
              // Truyền state xuống Dashboard
              balance={balance}
              setBalance={setBalance}
              bills={bills}
              setBills={setBills}
              transactions={transactions}
              setTransactions={setTransactions}
            />
          } 
        />
        <Route 
          path="/transaction-history" 
          element={
            <TransactionHistory 
              darkMode={darkMode} 
              setDarkMode={setDarkMode}
              // 👉 ĐÃ SỬA LỖI: Truyền cả transactions và bills xuống để trang Lịch sử có thể sử dụng
              transactions={transactions}
              bills={bills} 
            />
          } 
        />
        <Route 
          path="/transfer" 
          element={
            <Transfer 
              darkMode={darkMode} 
              setDarkMode={setDarkMode}
              balance={balance}
              setBalance={setBalance}
              transactions={transactions}
              setTransactions={setTransactions}
            />
          } 
        />
        <Route 
          path="/spending-statistics" 
          element={
            <SpendingStatistics
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              transactions={transactions}
              bills={bills}
            />
          }
        />
        <Route 
          path="/security-settings" 
          element={
            <SecuritySettings
              darkMode={darkMode}
              setDarkMode={setDarkMode}
            />
          }
        />
        <Route 
          path="/mobile-top-up" 
          element={
            <MobileTopUp
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              balance={balance}
              setBalance={setBalance}
              transactions={transactions}
              setTransactions={setTransactions}
            />
          }
        />
        <Route 
          path="/wallet-top-up" 
          element={
            <WalletTopUp
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              balance={balance}
              setBalance={setBalance}
              transactions={transactions}
              setTransactions={setTransactions}
            />
          }
        />
        <Route 
          path="/bills" 
          element={
            <Bills
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              balance={balance}
              setBalance={setBalance}
              bills={bills}
              setBills={setBills}
              transactions={transactions}
              setTransactions={setTransactions}
            />
          }
        />
        <Route 
          path="/profile" 
          element={
            <Profile
              darkMode={darkMode}
              setDarkMode={setDarkMode}
            />
          }
        />
        <Route 
          path="/savings-goals" 
          element={
            <SavingsGoals
              darkMode={darkMode}
              setDarkMode={setDarkMode}
            />
          }
        />
        <Route 
          path="/movie-tickets" 
          element={
            <MovieTickets
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              balance={balance}
              setBalance={setBalance}
              transactions={transactions}
              setTransactions={setTransactions}
            />
          }
        />
        <Route 
          path="/travel-booking" 
          element={
            <TravelBooking
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              balance={balance}
              setBalance={setBalance}
              transactions={transactions}
              setTransactions={setTransactions}
            />
          }
        />
        {/* THÊM MỚI: Bắt các route không tồn tại và hiển thị trang NotFound */}
        <Route 
          path="*" 
          element={<NotFound darkMode={darkMode} setDarkMode={setDarkMode} />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
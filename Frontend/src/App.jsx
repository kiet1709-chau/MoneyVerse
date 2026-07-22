import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import './index.css';

// Import các trang vừa tạo
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import AddTransaction from './pages/AddTransaction';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import TransactionHistory from './pages/TransactionHistory';
import SpendingStatistics from './pages/SpendingStatistics';
import SecuritySettings from './pages/SecuritySettings';
import Bills from './pages/Bills';
import Profile from './pages/Profile';
import SavingsGoals from './pages/SavingsGoals';
import Settings from './pages/Settings';
import BalanceSetup from './pages/BalanceSetup';
import SidebarLayout from './components/SidebarLayout';

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
  // Lưu trữ và khôi phục từ localStorage
  const [balance, setBalance] = useState(() => {
    const savedBalance = localStorage.getItem('moneyverse_balance');
    return savedBalance ? parseFloat(savedBalance) : 25000000;
  });

  const [bills, setBills] = useState(() => {
    const savedBills = localStorage.getItem('moneyverse_bills');
    return savedBills ? JSON.parse(savedBills) : [
      { id: 1, name: 'Tiền học phí', amount: 2000000, dueDate: '15/07/2026', status: 'pending', provider: 'Đại học', date: '' },
      { id: 2, name: 'Tiền điện tháng 6', amount: 450000, dueDate: '20/07/2026', status: 'pending', provider: 'EVN', date: '' },
      { id: 3, name: 'Internet cáp quang', amount: 275000, dueDate: '22/07/2026', status: 'pending', provider: 'VNPT', date: '' },
    ];
  });
  
  // 👉 ĐÃ SỬA LỖI: Khai báo mảng transactions để tránh lỗi undefined làm crash app
  const [transactions, setTransactions] = useState(() => {
    const savedTransactions = localStorage.getItem('moneyverse_transactions');
    return savedTransactions ? JSON.parse(savedTransactions) : [
      { id: 'sample-1', name: 'Nhận lương tháng', category: 'Thu nhập', amount: 30000000, type: 'income', date: '01/07/2026', icon: '💰' },
      { id: 'sample-2', name: 'Thanh toán tiền điện', category: 'Dịch vụ', amount: 450000, type: 'expense', date: '05/07/2026', icon: '🧾' },
      { id: 'sample-3', name: 'Mua sắm siêu thị', category: 'Mua sắm', amount: 1250000, type: 'expense', date: '08/07/2026', icon: '🛍️' },
      { id: 'sample-4', name: 'Ăn trưa', category: 'Ăn uống', amount: 85000, type: 'expense', date: '10/07/2026', icon: '🍜' },
    ];
  });

  const [vouchers, setVouchers] = useState(() => {
    const savedVouchers = localStorage.getItem('moneyverse_vouchers');
    return savedVouchers ? JSON.parse(savedVouchers) : [];
  });

  // Lưu balance vào localStorage khi thay đổi
  useEffect(() => {
    localStorage.setItem('moneyverse_balance', balance.toString());
  }, [balance]);

  // Lưu bills vào localStorage khi thay đổi
  useEffect(() => {
    localStorage.setItem('moneyverse_bills', JSON.stringify(bills));
  }, [bills]);

  // Lưu transactions vào localStorage khi thay đổi
  useEffect(() => {
    localStorage.setItem('moneyverse_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('moneyverse_vouchers', JSON.stringify(vouchers));
  }, [vouchers]);

  useEffect(() => {
    const sendDailyEntryReminder = () => {
      const savedSettings = localStorage.getItem('moneyverse_settings');
      const settings = savedSettings ? JSON.parse(savedSettings) : null;
      if (!settings?.notifications?.dailyEntryReminder) return;

      const now = new Date();
      if (now.getHours() !== 22) return;

      const reminderKey = `moneyverse_daily_entry_reminder_${now.toLocaleDateString('vi-VN')}`;
      if (localStorage.getItem(reminderKey)) return;

      localStorage.setItem(reminderKey, 'sent');
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('MoneyVerse nhắc nhở nhập liệu', {
          body: 'Đã 22:00. Hãy ghi lại các khoản thu chi hôm nay nhé!',
        });
      }
    };

    sendDailyEntryReminder();
    const reminderInterval = window.setInterval(sendDailyEntryReminder, 60 * 1000);
    return () => window.clearInterval(reminderInterval);
  }, []);
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
          path="/forgot-password"
          element={<ForgotPassword darkMode={darkMode} setDarkMode={setDarkMode} />}
        />
        <Route
          path="/add-transaction"
          element={<AddTransaction darkMode={darkMode} setDarkMode={setDarkMode} balance={balance} setBalance={setBalance} setTransactions={setTransactions} />}
        />
        <Route path="/setup-balance" element={<BalanceSetup setBalance={setBalance} />} />
        <Route element={<SidebarLayout darkMode={darkMode} setDarkMode={setDarkMode} />}>
          <Route
            index
            element={
              <Dashboard
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                balance={balance}
                setBalance={setBalance}
                bills={bills}
                setBills={setBills}
                transactions={transactions}
                setTransactions={setTransactions}
                vouchers={vouchers}
                setVouchers={setVouchers}
              />
            }
          />
          <Route
            path="dashboard"
            element={
              <Dashboard
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                balance={balance}
                setBalance={setBalance}
                bills={bills}
                setBills={setBills}
                transactions={transactions}
                setTransactions={setTransactions}
                vouchers={vouchers}
                setVouchers={setVouchers}
              />
            }
          />
          <Route
            path="transaction-history"
            element={
              <TransactionHistory
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                transactions={transactions}
                bills={bills}
              />
            }
          />
          <Route
            path="spending-statistics"
            element={
              <SpendingStatistics
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                balance={balance}
                transactions={transactions}
                bills={bills}
              />
            }
          />
          <Route
            path="security-settings"
            element={
              <SecuritySettings
                darkMode={darkMode}
                setDarkMode={setDarkMode}
              />
            }
          />
          <Route
            path="savings-goals"
            element={
              <SavingsGoals
                darkMode={darkMode}
                setDarkMode={setDarkMode}
              />
            }
          />
        </Route>
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
          path="/settings" 
          element={
            <Settings
              darkMode={darkMode}
              setDarkMode={setDarkMode}
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

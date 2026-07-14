import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DarkModeToggle from '../components/DarkModeToggle';

const Transfer = ({ darkMode, setDarkMode, balance, setBalance, transactions, setTransactions }) => {
  const navigate = useNavigate();
  
  // State quản lý form
  const [bank, setBank] = useState('Vietcombank');
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  // Định dạng tiền tệ VND
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  const handleTransfer = (e) => {
    e.preventDefault();
    setError('');

    const transferAmount = Number(amount);

    // Validate dữ liệu
    if (!accountNumber || !amount) {
      setError('Vui lòng nhập đầy đủ Số tài khoản và Số tiền.');
      return;
    }
    if (transferAmount <= 0) {
      setError('Số tiền chuyển phải lớn hơn 0.');
      return;
    }
    if (transferAmount > balance) {
      setError('Số dư không đủ để thực hiện giao dịch này.');
      return;
    }

    // 1. Trừ tiền ở số dư
    setBalance(prevBalance => prevBalance - transferAmount);

    // 2. Tạo giao dịch mới và thêm vào đầu danh sách (mới nhất lên trước)
    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const newTransaction = {
      id: `TRX${Math.floor(Math.random() * 1000000)}`,
      name: `Chuyển tiền đến ${bank} - ${accountNumber}`,
      amount: transferAmount,
      type: 'expense',
      category: 'Chuyển khoản',
      date: formattedDate,
      icon: '💸'
    };

    setTransactions([newTransaction, ...transactions]);

    // 3. Thông báo và chuyển hướng về Dashboard
    alert('Chuyển khoản thành công!');
    navigate('/dashboard');
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-200 transition-colors duration-300 font-sans">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 p-4 sticky top-0 z-30 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-1 font-medium"
          >
            ← <span className="hidden sm:inline">Quay lại</span>
          </button>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white border-l pl-3 border-gray-300 dark:border-gray-600">Chuyển khoản</h1>
        </div>
        <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
      </header>

      {/* Main Content */}
      <main className="p-6 md:p-8 max-w-xl mx-auto mt-8">
        <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          
          <div className="mb-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Số dư khả dụng</p>
            <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-1">{formatCurrency(balance)}</h2>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm mb-6 border border-red-100 dark:border-red-800 text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleTransfer} className="space-y-5">
            {/* Chọn ngân hàng */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Ngân hàng thụ hưởng</label>
              <select 
                value={bank}
                onChange={(e) => setBank(e.target.value)}
                className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Vietcombank">Vietcombank</option>
                <option value="Techcombank">Techcombank</option>
                <option value="MB Bank">MB Bank</option>
                <option value="BIDV">BIDV</option>
                <option value="VietinBank">VietinBank</option>
              </select>
            </div>

            {/* Số tài khoản */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Số tài khoản</label>
              <input 
                type="text" 
                placeholder="Nhập số tài khoản..."
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Số tiền */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Số tiền chuyển (VND)</label>
              <input 
                type="number" 
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-bold"
              />
            </div>

            {/* Lời nhắn */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Lời nhắn (không bắt buộc)</label>
              <input 
                type="text" 
                placeholder="Nội dung chuyển khoản..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Nút Submit */}
            <button 
              type="submit"
              className="w-full py-4 mt-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-500/30 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Xác nhận chuyển tiền
            </button>
          </form>

        </div>
      </main>
    </div>
  );
};

export default Transfer;
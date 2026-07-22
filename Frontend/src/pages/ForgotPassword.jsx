import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DarkModeToggle from '../components/DarkModeToggle';

const ForgotPassword = ({ darkMode, setDarkMode }) => {
  const [username, setUsername] = useState('');
  const [account, setAccount] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const findAccount = (event) => {
    event.preventDefault();
    const savedUser = JSON.parse(localStorage.getItem('moneyverse_user') || 'null');
    if (savedUser?.username?.trim().toLowerCase() === username.trim().toLowerCase()) {
      setAccount(savedUser);
      setMessage('Đã tìm thấy tài khoản. Hãy đặt mật khẩu mới.');
      setIsError(false);
      return;
    }
    setAccount(null);
    setMessage('Không tìm thấy tài khoản đã đăng ký với tên đăng nhập này.');
    setIsError(true);
  };

  const resetPassword = (event) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('Mật khẩu xác nhận không khớp. Vui lòng kiểm tra lại.');
      setIsError(true);
      return;
    }
    localStorage.setItem('moneyverse_user', JSON.stringify({ ...account, password: newPassword }));
    setMessage('Đặt lại mật khẩu thành công. Đang chuyển đến trang đăng nhập...');
    setIsError(false);
    window.setTimeout(() => navigate('/login'), 1200);
  };

  const inputClass = 'w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all';
  const messageClass = isError
    ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800/50'
    : 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800/50';

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center p-4 transition-colors duration-300 relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-6 right-6 z-10 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md px-4 py-2 rounded-full shadow-sm">
        <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
      </div>
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 w-full max-w-md z-10">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-3xl shadow-lg mb-4">M</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quên mật khẩu</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Nhập tên đăng nhập để kiểm tra tài khoản của bạn.</p>
        </div>
        {message && <div className={`p-3 rounded-lg text-sm text-center font-medium border mb-5 ${messageClass}`}>{message}</div>}
        {!account ? (
          <form onSubmit={findAccount} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Tên đăng nhập</label>
              <input type="text" required autoFocus value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Nhập tên đăng nhập" className={inputClass} />
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-purple-500/30">Kiểm tra tài khoản</button>
          </form>
        ) : (
          <form onSubmit={resetPassword} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Mật khẩu mới</label>
              <input type="password" required minLength="6" autoFocus value={newPassword} onChange={(event) => setNewPassword(event.target.value)} placeholder="Tối thiểu 6 ký tự" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Xác nhận mật khẩu mới</label>
              <input type="password" required minLength="6" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Nhập lại mật khẩu mới" className={inputClass} />
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-purple-500/30">Đặt lại mật khẩu</button>
          </form>
        )}
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-8">Nhớ mật khẩu? <Link to="/login" className="font-semibold text-purple-600 dark:text-purple-400 hover:underline">Đăng nhập ngay</Link></p>
      </div>
    </div>
  );
};

export default ForgotPassword;

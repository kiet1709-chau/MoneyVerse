import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DarkModeToggle from '../components/DarkModeToggle';

const Register = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    const fields = e.currentTarget.querySelectorAll('input');
    const [name, username, email, phone, password, confirmPassword] = [...fields].map((field) => field.value);
    if (password !== confirmPassword) {
      alert('Mật khẩu xác nhận không khớp. Vui lòng kiểm tra lại.');
      return;
    }
    localStorage.setItem('moneyverse_user', JSON.stringify({ name, username, email, phone, password, address: '', dob: '', gender: 'Khác' }));
    alert('Đăng ký thành công! Hãy đăng nhập để tiếp tục.');
    navigate('/login');
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center p-4 transition-colors duration-300 relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-400/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="absolute top-6 right-6 flex items-center gap-3 z-10 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md px-4 py-2 rounded-full shadow-sm">
        <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
      </div>

      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 w-full max-w-md z-10 transition-all duration-300">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg mb-4">
            M
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tạo tài khoản mới</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Bắt đầu hành trình tài chính của bạn</p>
        </div>

        <form onSubmit={handleRegister} className="relative z-20 space-y-4 pointer-events-auto">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Họ </label>
            <input type="text" required placeholder="Nguyễn " className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Tên</label>
            <input type="text" required placeholder="Văn A" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Tên đăng nhập</label>
            <input type="text" required placeholder="Ví dụ: nva123" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
            <input type="email" required placeholder="you@example.com" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Số điện thoại</label>
            <input type="tel" required pattern="[0-9]{10,11}" placeholder="0987654321" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Mật khẩu</label>
            <input type="password" required placeholder="Tối thiểu 6 ký tự" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Xác nhận mật khẩu</label>
            <input type="password" required placeholder="Nhập lại mật khẩu" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all" />
          </div>
          <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-purple-500/30 mt-2 transform hover:-translate-y-0.5">
            Đăng ký tài khoản
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          Đã có tài khoản?{' '}
          <Link to="/login" className="font-semibold text-purple-600 dark:text-purple-400 hover:underline focus:outline-none">
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

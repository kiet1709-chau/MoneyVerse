import { useState, useEffect } from 'react';
import './App.css';
import './index.css';

function App() {
  // =========================================================================
  // 1. QUẢN LÝ TRẠNG THÁI CHUNG & ĐIỀU HƯỚNG
  // =========================================================================
  const [currentPage, setCurrentPage] = useState('login'); // 'login' | 'register' | 'dashboard'
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Logic Dark Mode
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

  // Nút Bật/Tắt Dark Mode dùng chung
  const DarkModeToggle = () => (
    <button onClick={() => setDarkMode(!darkMode)} className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none ${darkMode ? 'bg-purple-600' : 'bg-gray-300'}`}>
      <div className={`bg-white w-4 h-4 rounded-full shadow transition-transform duration-200 ease-in-out ${darkMode ? 'translate-x-6' : 'translate-x-0'}`} />
    </button>
  );

  // =========================================================================
  // 2. LOGIC XÁC THỰC (LOGIN / REGISTER)
  // =========================================================================
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Giả lập kiểm tra tài khoản tĩnh
    if (username === 'admin' && password === '123456') {
      setAuthError('');
      setCurrentPage('dashboard');
    } else {
      setAuthError('Tài khoản hoặc mật khẩu không đúng! (Gợi ý: admin / 123456)');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    alert('Đăng ký thành công! Hãy đăng nhập để tiếp tục.');
    setCurrentPage('login');
  };

  const handleLogout = () => {
    setSidebarOpen(false);
    setUsername('');
    setPassword('');
    setCurrentPage('login');
  };

  // =========================================================================
  // 3. LOGIC NGÂN HÀNG / VÍ ĐIỆN TỬ 
  // =========================================================================
  const [balance, setBalance] = useState(25000000);
  const [bills, setBills] = useState([
    { id: 1, name: 'Tiền học phí', amount: 2000000, dueDate: '15/07/2026', status: 'pending', provider: 'Đại học' },
    { id: 2, name: 'Tiền điện tháng 6', amount: 450000, dueDate: '20/07/2026', status: 'pending', provider: 'EVN' },
    { id: 3, name: 'Internet cáp quang', amount: 275000, dueDate: '22/07/2026', status: 'pending', provider: 'VNPT' },
  ]);

  const [isBillCenterOpen, setIsBillCenterOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const pendingBills = bills.filter(b => b.status === 'pending');
  const pendingCount = pendingBills.length;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handleConfirmPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setBalance(prev => prev - selectedBill.amount);
      setBills(prev => prev.map(bill => bill.id === selectedBill.id ? { ...bill, status: 'paid' } : bill));
      setToastMessage(`Đã thanh toán thành công ${formatCurrency(selectedBill.amount)} cho ${selectedBill.name}`);
      setSelectedBill(null);
      setIsProcessing(false);

      if (pendingCount - 1 === 0) {
        setIsBillCenterOpen(false);
      }
      setTimeout(() => setToastMessage(''), 3000);
    }, 1500);
  };

  const menuItems = [
    { name: 'Tổng quan ví', icon: '💳' },
    { name: 'Lịch sử giao dịch', icon: '📋' },
    { name: 'Thống kê chi tiêu', icon: '📊' },
    { name: 'Cài đặt bảo mật', icon: '🛡️' },
  ];

  // =========================================================================
  // GIAO DIỆN: ĐĂNG NHẬP
  // =========================================================================
  if (currentPage === 'login') {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center p-4 transition-colors duration-300 relative overflow-hidden font-sans">
        {/* Hình nền trang trí */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-400/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="absolute top-6 right-6 flex items-center gap-3 z-10 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md px-4 py-2 rounded-full shadow-sm">
          <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Chế độ tối</span>
          <DarkModeToggle />
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 w-full max-w-md z-10 transition-all duration-300">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-3xl shadow-lg mb-4">
              M
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
              MoneyVerse
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-medium">Quản lý tài chính thông minh</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {authError && (
              <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm text-center font-medium border border-red-200 dark:border-red-800/50">
                {authError}
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Tên đăng nhập</label>
              <input 
                type="text" 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nhập 'admin'"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Mật khẩu</label>
                <a href="#" className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline">Quên mật khẩu?</a>
              </div>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập '123456'"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
              />
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-purple-500/30 mt-4 transform hover:-translate-y-0.5">
              Đăng nhập
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-8">
            Chưa có tài khoản?{' '}
            <button onClick={() => { setCurrentPage('register'); setAuthError(''); }} className="font-semibold text-purple-600 dark:text-purple-400 hover:underline focus:outline-none transition-colors">
              Mở ví ngay
            </button>
          </p>
        </div>
      </div>
    );
  }

  // =========================================================================
  // GIAO DIỆN: ĐĂNG KÝ
  // =========================================================================
  if (currentPage === 'register') {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center p-4 transition-colors duration-300 relative overflow-hidden font-sans">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-400/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="absolute top-6 right-6 flex items-center gap-3 z-10 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md px-4 py-2 rounded-full shadow-sm">
          <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Chế độ tối</span>
          <DarkModeToggle />
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 w-full max-w-md z-10 transition-all duration-300">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg mb-4">
              M
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tạo tài khoản mới</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Bắt đầu hành trình tài chính của bạn</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Họ và tên</label>
              <input type="text" required placeholder="Nguyễn Văn A" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Tên đăng nhập</label>
              <input type="text" required placeholder="Ví dụ: nva123" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Mật khẩu</label>
              <input type="password" required placeholder="Tối thiểu 6 ký tự" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all" />
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-purple-500/30 mt-2 transform hover:-translate-y-0.5">
              Đăng ký tài khoản
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
            Đã có tài khoản?{' '}
            <button onClick={() => setCurrentPage('login')} className="font-semibold text-purple-600 dark:text-purple-400 hover:underline focus:outline-none">
              Đăng nhập ngay
            </button>
          </p>
        </div>
      </div>
    );
  }

  // =========================================================================
  // GIAO DIỆN: DASHBOARD CHÍNH (Từ code gốc của bạn)
  // =========================================================================
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-200 flex transition-colors duration-300 font-sans">
      
      {/* Toast Message (Góc trên bên phải) */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-[60] bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-bounce">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Lớp phủ cho Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 bg-white dark:bg-gray-800 w-64 h-screen shadow-md border-r border-gray-200 dark:border-gray-700 flex flex-col justify-between p-4 transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-64"} lg:translate-x-0`}>
        <div>
          <div className="flex items-center gap-3 mb-8 px-2 mt-2">
            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg">
              M
            </div>
            <span className="font-bold text-2xl dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">MoneyVerse</span>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button key={item.name} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-gray-600 dark:text-gray-300 font-medium hover:bg-purple-50 dark:hover:bg-gray-700 hover:text-purple-600 dark:hover:text-purple-400 transition-all text-left">
                <span className="text-xl">{item.icon}</span>
                <span>{item.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
          <div className="flex items-center justify-between px-2 py-2">
            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Chế độ tối</span>
            <DarkModeToggle />
          </div>
          {/* Nút Đăng xuất */}
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 font-semibold text-sm transition-all text-left">
            <span className="text-xl">🚪</span>
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-64 w-full min-h-screen">
        
        {/* Header */}
        <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 flex justify-between items-center p-4 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button className="p-2 text-xl font-bold lg:hidden text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg" onClick={() => setSidebarOpen(true)}>
              ≡
            </button>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white hidden sm:block">Trang chủ</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Nút Chuông Thông Báo */}
            <button 
              onClick={() => setIsBillCenterOpen(true)}
              className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
              </svg>
              {pendingCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] text-white justify-center items-center font-bold">
                    {pendingCount}
                  </span>
                </span>
              )}
            </button>

            {/* Avatar (Click để đăng xuất) */}
            <div title="Đăng xuất" onClick={handleLogout} className="bg-gradient-to-r from-blue-400 to-indigo-500 w-10 h-10 rounded-full cursor-pointer shadow-md border-2 border-white dark:border-gray-800 hover:opacity-80 transition-opacity flex items-center justify-center font-bold text-white text-sm">
              AD
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6 md:p-8 flex-1 max-w-6xl mx-auto w-full">
          
          {/* Card Số dư */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 shadow-xl text-white mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 rounded-full bg-white opacity-10"></div>
            <p className="text-purple-100 text-sm md:text-base font-medium mb-1">Số dư khả dụng</p>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">{formatCurrency(balance)}</h2>
            <div className="flex gap-4 relative z-10">
              <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                Nạp tiền
              </button>
              <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                Chuyển khoản
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Khối Thống kê chi tiêu */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-gray-800 dark:text-white">Thống kê chi tiêu (Tháng 7)</h3>
                <span className="text-sm text-purple-600 dark:text-purple-400 font-medium cursor-pointer">Xem chi tiết</span>
              </div>
              <div className="h-48 flex items-end gap-4 justify-between pt-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                <div className="w-full bg-blue-100 dark:bg-blue-900/30 rounded-t-md h-[40%] relative group hover:bg-blue-200 transition-colors"><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-gray-500">Ăn uống</span></div>
                <div className="w-full bg-purple-100 dark:bg-purple-900/30 rounded-t-md h-[75%] relative group hover:bg-purple-200 transition-colors"><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-gray-500">Giáo dục</span></div>
                <div className="w-full bg-green-100 dark:bg-green-900/30 rounded-t-md h-[30%] relative group hover:bg-green-200 transition-colors"><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-gray-500">Mua sắm</span></div>
                <div className="w-full bg-orange-100 dark:bg-orange-900/30 rounded-t-md h-[55%] relative group hover:bg-orange-200 transition-colors"><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-gray-500">Dịch vụ</span></div>
              </div>
            </div>

            {/* Lịch sử giao dịch gần đây */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-4">Giao dịch gần đây</h3>
              <div className="space-y-4">
                {bills.filter(b => b.status === 'paid').length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-8">Chưa có giao dịch nào</p>
                ) : (
                  bills.filter(b => b.status === 'paid').map(bill => (
                    <div key={bill.id} className="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors">
                      <div className="flex gap-3 items-center">
                        <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 text-red-500 flex items-center justify-center">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{bill.name}</p>
                          <p className="text-xs text-gray-500">{bill.provider}</p>
                        </div>
                      </div>
                      <span className="font-bold text-gray-800 dark:text-gray-200 text-sm">-{formatCurrency(bill.amount)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ========================================== */}
      {/* MODAL TRUNG TÂM THANH TOÁN HÓA ĐƠN         */}
      {/* ========================================== */}
      {isBillCenterOpen && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-gray-50 dark:bg-gray-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header Modal */}
            <div className="bg-white dark:bg-gray-800 p-5 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                🧾 Hóa đơn cần thanh toán
                <span className="bg-red-100 text-red-600 text-sm py-1 px-2 rounded-full">{pendingCount}</span>
              </h2>
              <button onClick={() => setIsBillCenterOpen(false)} className="text-gray-500 hover:text-gray-800 dark:hover:text-white bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full w-8 h-8 flex items-center justify-center transition-colors">
                ✕
              </button>
            </div>

            {/* Danh sách Hóa đơn */}
            <div className="p-5 overflow-y-auto flex-1 space-y-4">
              {pendingCount === 0 ? (
                <div className="text-center py-10 flex flex-col items-center">
                  <div className="text-5xl mb-4">🎉</div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Tuyệt vời!</h3>
                  <p className="text-gray-500 dark:text-gray-400">Bạn đã thanh toán tất cả hóa đơn.</p>
                </div>
              ) : (
                pendingBills.map(bill => (
                  <div key={bill.id} className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3">
                        <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-xl h-fit">
                           <span className="text-2xl">{bill.name.includes('học') ? '🎓' : bill.name.includes('điện') ? '⚡' : '🌐'}</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800 dark:text-white text-lg">{bill.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Nhà cung cấp: {bill.provider}</p>
                          <p className="text-xs text-red-500 mt-1 font-medium flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            Hạn nộp: {bill.dueDate}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                      <span className="font-bold text-xl text-purple-600 dark:text-purple-400">{formatCurrency(bill.amount)}</span>
                      <button 
                        onClick={() => setSelectedBill(bill)}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-xl transition-colors shadow-sm shadow-purple-200 dark:shadow-none"
                      >
                        Thanh toán ngay
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* POP-UP XÁC NHẬN THANH TOÁN                   */}
      {/* ========================================== */}
      {selectedBill && (
        <div className="fixed inset-0 bg-black/70 z-[70] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-sm p-6 text-center shadow-2xl scale-100 animate-[pulse_0.1s_ease-in-out]">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-purple-100 dark:bg-purple-900/30 mb-4">
              <svg className="h-8 w-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Xác nhận thanh toán</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Bạn có chắc chắn muốn thanh toán số tiền <br/>
              <strong className="text-purple-600 dark:text-purple-400 text-lg">{formatCurrency(selectedBill.amount)}</strong> <br/>
              cho <strong className="text-gray-900 dark:text-white">{selectedBill.name}</strong> không?
            </p>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setSelectedBill(null)}
                disabled={isProcessing}
                className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={handleConfirmPayment}
                disabled={isProcessing}
                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-70 flex items-center justify-center"
              >
                {isProcessing ? (
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : 'Đồng ý'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DarkModeToggle from '../components/DarkModeToggle';

const Dashboard = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
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

  const handleLogout = () => {
    navigate('/login');
  };

  // ĐÃ CẬP NHẬT: Thêm trường `path` để điều hướng
  const menuItems = [
    { name: 'Tổng quan ví', icon: '💳', path: '/dashboard' },
    { name: 'Lịch sử giao dịch', icon: '📋', path: '/transaction-history' },
    { name: 'Thống kê chi tiêu', icon: '📊', path: '#' },
    { name: 'Cài đặt bảo mật', icon: '🛡️', path: '#' },
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-200 flex transition-colors duration-300 font-sans">
      {/* Toast Message */}
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
            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg">M</div>
            <span className="font-bold text-2xl dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">MoneyVerse</span>
          </div>
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button 
                key={item.name} 
                // ĐÃ CẬP NHẬT: Thêm sự kiện onClick để chuyển trang
                onClick={() => {
                  if (item.path !== '#') {
                    navigate(item.path);
                  }
                }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-all text-left ${
                  item.path === '/dashboard' 
                    ? 'bg-purple-50 dark:bg-gray-700 text-purple-600 dark:text-purple-400' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-700 hover:text-purple-600 dark:hover:text-purple-400'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
          <div className="flex items-center justify-between px-2 py-2">
            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Chế độ tối</span>
            <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 font-semibold text-sm transition-all text-left">
            <span className="text-xl">🚪</span>
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-64 w-full min-h-screen">
        <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 flex justify-between items-center p-4 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button className="p-2 text-xl font-bold lg:hidden text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg" onClick={() => setSidebarOpen(true)}>≡</button>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white hidden sm:block">Trang chủ</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button onClick={() => setIsBillCenterOpen(true)} className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
              </svg>
              {pendingCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] text-white justify-center items-center font-bold">{pendingCount}</span>
                </span>
              )}
            </button>
            <div title="Đăng xuất" onClick={handleLogout} className="bg-gradient-to-r from-blue-400 to-indigo-500 w-10 h-10 rounded-full cursor-pointer shadow-md border-2 border-white dark:border-gray-800 hover:opacity-80 transition-opacity flex items-center justify-center font-bold text-white text-sm">
              AD
            </div>
          </div>
        </header>

        <main className="p-6 md:p-8 flex-1 max-w-6xl mx-auto w-full space-y-6">
          {/* Card Số dư */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 shadow-xl text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 rounded-full bg-white opacity-10"></div>
            <p className="text-purple-100 text-sm md:text-base font-medium mb-1">Số dư khả dụng</p>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">{formatCurrency(balance)}</h2>
            <div className="flex gap-4 relative z-10">
              <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg> Nạp tiền
              </button>
              <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg> Chuyển khoản
              </button>
            </div>
          </div>

          {/* Grid Thống Kê & Giao Dịch */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-gray-800 dark:text-white">Thống kê chi tiêu (Tháng 7)</h3>
                <span className="text-sm text-purple-600 dark:text-purple-400 font-medium cursor-pointer hover:underline">Xem chi tiết</span>
              </div>
              <div className="h-48 flex items-end gap-4 justify-between pt-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                <div className="w-full bg-blue-100 dark:bg-blue-900/30 rounded-t-md h-[40%] relative group hover:bg-blue-200 transition-colors"><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-gray-500">Ăn uống</span></div>
                <div className="w-full bg-purple-100 dark:bg-purple-900/30 rounded-t-md h-[75%] relative group hover:bg-purple-200 transition-colors"><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-gray-500">Giáo dục</span></div>
                <div className="w-full bg-green-100 dark:bg-green-900/30 rounded-t-md h-[30%] relative group hover:bg-green-200 transition-colors"><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-gray-500">Mua sắm</span></div>
                <div className="w-full bg-orange-100 dark:bg-orange-900/30 rounded-t-md h-[55%] relative group hover:bg-orange-200 transition-colors"><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-gray-500">Dịch vụ</span></div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              {/* ĐÃ CẬP NHẬT: Thêm nút Xem tất cả */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-gray-800 dark:text-white">Giao dịch gần đây</h3>
                <button 
                  onClick={() => navigate('/transactions')} 
                  className="text-sm text-purple-600 dark:text-purple-400 font-medium hover:underline"
                >
                  Xem tất cả
                </button>
              </div>
              
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg text-gray-800 dark:text-white flex items-center gap-2">🐖 Heo đất tiết kiệm</h3>
                  <span className="text-[10px] bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 font-semibold px-2 py-1 rounded-full">Đang thực hiện</span>
                </div>
                <p className="font-semibold text-gray-700 dark:text-gray-300 text-sm mb-2">Mục tiêu: Đổi Laptop Mới</p>
                <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                  <span>Tích lũy: {formatCurrency(12000000)}</span>
                  <span>Mục tiêu: {formatCurrency(30000000)}</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-700 h-3 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: '40%' }}></div>
                </div>
              </div>
              <button className="mt-5 w-full bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 font-bold py-2 rounded-xl text-sm hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors">
                + Bỏ ống thêm tiền
              </button>
            </div>

            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-2xl shadow-md text-white flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-white opacity-10"></div>
              <div>
                <span className="bg-amber-400 text-gray-900 text-[10px] font-extrabold px-2.5 py-1 rounded-full tracking-wider uppercase">Voucher HOT</span>
                <h4 className="font-bold text-lg mt-3 leading-snug">Khuyến mãi thanh toán hóa đơn</h4>
                <p className="text-xs text-indigo-100 mt-1 leading-relaxed">
                  Nhận ngay voucher hoàn tiền <strong>50.000đ</strong> cho giao dịch điện nước lần đầu tiên trên MoneyVerse!
                </p>
              </div>
              <button className="mt-4 w-full bg-white text-purple-700 font-bold py-2 rounded-xl text-sm hover:bg-gray-100 transition-colors shadow-sm">
                Nhận ưu đãi ngay
              </button>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-3 flex items-center gap-2">💡 Mẹo tài chính hôm nay</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 italic leading-relaxed">
                  "Hãy áp dụng quy tắc 50/30/20: Dành 50% thu nhập cho nhu cầu thiết yếu, 30% cho sở thích cá nhân và luôn ưu tiên trích ra 20% để tích lũy trước khi tiêu xài."
                </p>
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500 flex justify-between items-center mt-4">
                <span>Chuyên gia MoneyVerse</span>
                <a href="#" className="text-purple-600 dark:text-purple-400 font-semibold hover:underline">Xem thêm →</a>
              </div>
            </div>
          </div>

          <footer className="border-t border-gray-200 dark:border-gray-700 pt-6 text-center text-xs text-gray-400 dark:text-gray-500">
            <p>© 2026 MoneyVerse. Mọi quyền được bảo lưu. 🔒 An toàn & Bảo mật tuyệt đối.</p>
          </footer>
        </main>
      </div>

      {isBillCenterOpen && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-gray-50 dark:bg-gray-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-white dark:bg-gray-800 p-5 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                🧾 Hóa đơn cần thanh toán <span className="bg-red-100 text-red-600 text-sm py-1 px-2 rounded-full">{pendingCount}</span>
              </h2>
              <button onClick={() => setIsBillCenterOpen(false)} className="text-gray-500 hover:text-gray-800 dark:hover:text-white bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full w-8 h-8 flex items-center justify-center transition-colors">✕</button>
            </div>
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
                      <button onClick={() => setSelectedBill(bill)} className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-xl transition-colors shadow-sm shadow-purple-200 dark:shadow-none">Thanh toán ngay</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

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
              <button onClick={() => setSelectedBill(null)} disabled={isProcessing} className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50">Hủy bỏ</button>
              <button onClick={handleConfirmPayment} disabled={isProcessing} className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-70 flex items-center justify-center">
                {isProcessing ? 'Đang xử lý...' : 'Đồng ý'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
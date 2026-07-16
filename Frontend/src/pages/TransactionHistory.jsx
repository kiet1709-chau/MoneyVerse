import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DarkModeToggle from '../components/DarkModeToggle';

// ĐÃ SỬA: Nhận mảng `transactions` từ props (được truyền từ App.js xuống)
const TransactionHistory = ({ darkMode, setDarkMode, transactions }) => {
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'income' | 'expense'

  // Định dạng tiền tệ VND
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Tính toán thống kê nhanh từ danh sách hiển thị
  const totalIncome = (transactions || [])
    .filter(t => t.type === 'income')
    .reduce((sum, item) => sum + item.amount, 0);

  const totalExpense = (transactions || [])
    .filter(t => t.type === 'expense')
    .reduce((sum, item) => sum + item.amount, 0);

  // 👉 ĐÃ SỬA LỖI TÌM KIẾM: An toàn hơn với kiểu dữ liệu số (Number) và Undefined
  const filteredTransactions = (transactions || []).filter(t => {
    // Tối ưu: Đưa toLowerCase() ra ngoài để không phải tính lại ở mỗi điều kiện
    const searchLower = searchTerm.toLowerCase(); 
    
    const matchesSearch = 
      String(t.name || '').toLowerCase().includes(searchLower) || 
      String(t.id || '').toLowerCase().includes(searchLower) ||
      String(t.category || '').toLowerCase().includes(searchLower);
      
    const matchesType = filterType === 'all' ? true : t.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-200 transition-colors duration-300 font-sans">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 p-4 sticky top-0 z-30 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-1 font-medium"
          >
            ← <span className="hidden sm:inline">Quay lại Trang chủ</span>
          </button>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white border-l pl-3 border-gray-300 dark:border-gray-600">Lịch sử giao dịch</h1>
        </div>

        <div className="flex items-center gap-4">
          <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
          <div className="bg-gradient-to-r from-blue-400 to-indigo-500 w-10 h-10 rounded-full shadow-md border-2 border-white dark:border-gray-800 flex items-center justify-center font-bold text-white text-sm">
            AD
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
        
        {/* Thẻ thống kê thu chi nhanh */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500 uppercase font-bold tracking-wider">Tổng thu nhập</p>
              <h3 className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{formatCurrency(totalIncome)}</h3>
            </div>
            <div className="w-12 h-12 bg-green-50 dark:bg-green-950/30 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400 text-xl">📈</div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500 uppercase font-bold tracking-wider">Tổng chi tiêu</p>
              <h3 className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">{formatCurrency(totalExpense)}</h3>
            </div>
            <div className="w-12 h-12 bg-red-50 dark:bg-red-950/30 rounded-xl flex items-center justify-center text-red-600 dark:text-red-400 text-xl">📉</div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500 uppercase font-bold tracking-wider">Tổng số giao dịch</p>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{(transactions || []).length}</h3>
            </div>
            <div className="w-12 h-12 bg-purple-50 dark:bg-purple-950/30 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 text-xl">📋</div>
          </div>
        </div>

        {/* Thanh tìm kiếm & Bộ lọc */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Ô tìm kiếm */}
          <div className="relative w-full md:w-96">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              🔍
            </span>
            <input
              type="text"
              placeholder="Tìm theo tên, danh mục, mã GD..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-gray-800 dark:text-gray-200"
            />
          </div>

          {/* Các nút bấm bộ lọc */}
          <div className="flex gap-2 w-full md:w-auto">
            <button
              onClick={() => setFilterType('all')}
              className={`flex-1 md:flex-initial px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                filterType === 'all'
                  ? 'bg-purple-600 text-white shadow-sm shadow-purple-100 dark:shadow-none'
                  : 'bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilterType('income')}
              className={`flex-1 md:flex-initial px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                filterType === 'income'
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
              }`}
            >
              Thu nhập
            </button>
            <button
              onClick={() => setFilterType('expense')}
              className={`flex-1 md:flex-initial px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                filterType === 'expense'
                  ? 'bg-red-500 text-white shadow-sm'
                  : 'bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
              }`}
            >
              Chi tiêu
            </button>
          </div>
        </div>

        {/* Danh sách giao dịch */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-16">
              <span className="text-5xl">📁</span>
              <p className="text-gray-500 dark:text-gray-400 mt-4 font-medium">Không tìm thấy giao dịch nào phù hợp</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <th className="p-4 pl-6">Giao dịch</th>
                    <th className="p-4 hidden sm:table-cell">Mã GD</th>
                    <th className="p-4 hidden md:table-cell">Thời gian</th>
                    <th className="p-4">Danh mục</th>
                    <th className="p-4 text-right pr-6">Số tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                  {filteredTransactions.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      {/* Cột Tên giao dịch & Icon */}
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                            t.type === 'income' 
                              ? 'bg-green-100 dark:bg-green-950/30 text-green-600' 
                              : 'bg-red-100 dark:bg-red-950/30 text-red-500'
                          }`}>
                            {t.icon}
                          </div>
                          <div>
                            <p className="font-bold text-gray-800 dark:text-gray-200 text-sm md:text-base">{t.name}</p>
                            <p className="text-xs text-gray-400 md:hidden mt-1">{t.date}</p>
                          </div>
                        </div>
                      </td>
                      {/* Cột Mã Giao dịch */}
                      <td className="p-4 text-sm font-semibold text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                        {t.id}
                      </td>
                      {/* Cột Thời gian */}
                      <td className="p-4 text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
                        {t.date}
                      </td>
                      {/* Cột Danh mục */}
                      <td className="p-4">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                          {t.category}
                        </span>
                      </td>
                      {/* Cột Số tiền */}
                      <td className={`p-4 text-right pr-6 font-bold text-sm md:text-base ${
                        t.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-500'
                      }`}>
                        {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TransactionHistory;

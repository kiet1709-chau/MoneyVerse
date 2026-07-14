import React from 'react';
import { useNavigate } from 'react-router-dom';
import DarkModeToggle from '../components/DarkModeToggle';

const SpendingStatistics = ({ darkMode, setDarkMode, transactions = [], bills = [] }) => {
  const navigate = useNavigate();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const expenseTransactions = (transactions || []).filter((t) => t.type === 'expense');

  const categoryMap = expenseTransactions.reduce((acc, item) => {
    const category = item.category || 'Khác';
    acc[category] = (acc[category] || 0) + Number(item.amount || 0);
    return acc;
  }, {});

  const categoryStats = Object.entries(categoryMap).length > 0
    ? Object.entries(categoryMap).map(([name, amount]) => ({
        name,
        amount,
        color: name.includes('Ăn') || name.includes('Mua')
          ? 'from-blue-500 to-cyan-400'
          : name.includes('Giáo')
            ? 'from-purple-500 to-violet-500'
            : 'from-orange-500 to-amber-400',
        icon: name.includes('Ăn') ? '🍜' : name.includes('Giáo') ? '🎓' : name.includes('Mua') ? '🛍️' : '🧾',
      }))
    : [
        { name: 'Ăn uống', amount: 3200000, color: 'from-blue-500 to-cyan-400', icon: '🍜' },
        { name: 'Giáo dục', amount: 2000000, color: 'from-purple-500 to-violet-500', icon: '🎓' },
        { name: 'Mua sắm', amount: 1500000, color: 'from-emerald-500 to-green-400', icon: '🛍️' },
        { name: 'Dịch vụ', amount: 1100000, color: 'from-orange-500 to-amber-400', icon: '🧾' },
      ];

  const totalExpense = categoryStats.reduce((sum, item) => sum + item.amount, 0);
  const biggestCategory = [...categoryStats].sort((a, b) => b.amount - a.amount)[0];
  const pendingBills = (bills || []).filter((bill) => bill.status === 'pending');
  const pendingBillAmount = pendingBills.reduce((sum, bill) => sum + Number(bill.amount || 0), 0);
  const averageDaily = Math.round(totalExpense / 30);

  const weeklyTrend = [
    { label: 'Tuần 1', amount: 950000 },
    { label: 'Tuần 2', amount: 1300000 },
    { label: 'Tuần 3', amount: 810000 },
    { label: 'Tuần 4', amount: 1180000 },
  ];

  const recentExpenses = expenseTransactions.length > 0
    ? expenseTransactions.slice(0, 5)
    : [
        { id: 'demo-1', name: 'Coffee sáng', category: 'Ăn uống', amount: 85000, date: '10/07/2026', icon: '☕' },
        { id: 'demo-2', name: 'Mua sách', category: 'Giáo dục', amount: 320000, date: '11/07/2026', icon: '📚' },
        { id: 'demo-3', name: 'Dịch vụ mạng', category: 'Dịch vụ', amount: 275000, date: '12/07/2026', icon: '🌐' },
      ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300 font-sans">
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 p-4 sticky top-0 z-30 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-1 font-medium"
          >
            ← <span className="hidden sm:inline">Quay lại Dashboard</span>
          </button>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white border-l pl-3 border-gray-300 dark:border-gray-600">
            Thống kê chi tiêu
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
          <div className="bg-gradient-to-r from-blue-400 to-indigo-500 w-10 h-10 rounded-full shadow-md border-2 border-white dark:border-gray-800 flex items-center justify-center font-bold text-white text-sm">
            AD
          </div>
        </div>
      </header>

      <main className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
        <section className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/10 blur-2xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-purple-100">Tổng chi tiêu tháng 7</p>
              <h2 className="text-3xl md:text-4xl font-bold mt-2">{formatCurrency(totalExpense)}</h2>
              <p className="text-purple-100 mt-2">Danh mục chiếm nhiều nhất là <span className="font-semibold">{biggestCategory?.name}</span></p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/transaction-history')}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-xl font-semibold transition-colors"
              >
                Xem lịch sử
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-white text-purple-700 hover:bg-purple-50 px-4 py-2 rounded-xl font-semibold transition-colors"
              >
                Về Dashboard
              </button>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
            <p className="text-sm font-semibold text-gray-400 dark:text-gray-500">Chi tiêu trung bình/ngày</p>
            <h3 className="text-2xl font-bold mt-2">{formatCurrency(averageDaily)}</h3>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
            <p className="text-sm font-semibold text-gray-400 dark:text-gray-500">Hóa đơn chờ thanh toán</p>
            <h3 className="text-2xl font-bold mt-2">{pendingBills.length} mục</h3>
            <p className="text-sm text-gray-500 mt-1">{formatCurrency(pendingBillAmount)}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
            <p className="text-sm font-semibold text-gray-400 dark:text-gray-500">Mức chi lớn nhất</p>
            <h3 className="text-2xl font-bold mt-2">{biggestCategory?.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{formatCurrency(biggestCategory?.amount || 0)}</p>
          </div>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-lg text-gray-800 dark:text-white">Phân bố chi tiêu theo danh mục</h3>
                <p className="text-sm text-gray-500 mt-1">Biểu đồ cột thể hiện tổng chi tiêu trong tháng</p>
              </div>
            </div>

            <div className="space-y-5">
              {categoryStats.map((item) => {
                const percent = totalExpense > 0 ? Math.round((item.amount / totalExpense) * 100) : 0;
                return (
                  <div key={item.name}>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{item.icon}</span>
                        <span className="font-semibold text-gray-700 dark:text-gray-200">{item.name}</span>
                      </div>
                      <span className="text-sm text-gray-500">{percent}% • {formatCurrency(item.amount)}</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                      <div className={`h-full rounded-full bg-gradient-to-r ${item.color}`} style={{ width: `${percent}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-4">Xu hướng chi tiêu theo tuần</h3>
            <div className="space-y-3">
              {weeklyTrend.map((item) => {
                const width = Math.min(100, Math.round((item.amount / 1500000) * 100));
                return (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
                      <span>{item.label}</span>
                      <span>{formatCurrency(item.amount)}</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500" style={{ width: `${width}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <h3 className="font-bold text-lg text-gray-800 dark:text-white">Giao dịch chi tiêu gần đây</h3>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
            {recentExpenses.map((item) => (
              <div key={item.id} className="flex justify-between items-center px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-red-100 dark:bg-red-950/30 text-red-500 flex items-center justify-center text-xl">
                    {item.icon || '🧾'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.category} • {item.date}</p>
                  </div>
                </div>
                <span className="font-bold text-red-500">-{formatCurrency(item.amount)}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default SpendingStatistics;

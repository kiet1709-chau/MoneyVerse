import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DarkModeToggle from '../components/DarkModeToggle';

const formatNumberInput = (value) => new Intl.NumberFormat('vi-VN').format(Number(value) || 0);
const parseNumberInput = (value) => Number(String(value).replace(/\D/g, '')) || 0;

const SpendingStatistics = ({ darkMode, setDarkMode, balance = 0, transactions = [], bills = [] }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const limitSectionRef = useRef(null);
  
  const today = new Date();
  const todayDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const todayMonth = todayDate.slice(0, 7);
  
  const [spendingLimit, setSpendingLimit] = useState(() => Number(localStorage.getItem('moneyverse_spending_limit') || 20000000));
  const [limitInput, setLimitInput] = useState(() => formatNumberInput(spendingLimit));
  const [showLimitDetails, setShowLimitDetails] = useState(true);
  
  const [period, setPeriod] = useState('month');
  const [selectedDate, setSelectedDate] = useState(todayDate);
  const [selectedMonth, setSelectedMonth] = useState(todayMonth);
  const [selectedYear, setSelectedYear] = useState(String(today.getFullYear()));

  useEffect(() => {
    if (new URLSearchParams(location.search).get('focus') !== 'limit') return;
    window.setTimeout(() => {
      limitSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
  }, [location.search]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // --- LOGIC ĐỒNG BỘ: GỘP HÓA ĐƠN VÀO GIAO DỊCH CHI TIÊU ---
  let baseExpenseTransactions = (transactions || []).filter((t) => t.type === 'expense');
  const paidBills = (bills || []).filter(b => b.status === 'paid');
  
  paidBills.forEach(bill => {
    // Kiểm tra xem hóa đơn này đã được Bills.jsx thêm vào mảng transactions chưa (chống trùng lặp)
    const isAlreadyInTransactions = baseExpenseTransactions.some(t => 
      (t.id && String(t.id).includes(String(bill.id))) || 
      (t.name === `Thanh toán ${bill.name}` && t.amount === bill.amount)
    );
    
    if (!isAlreadyInTransactions) {
      baseExpenseTransactions.push({
        id: `BILL_MERGED_${bill.id || Date.now()}`,
        name: `Thanh toán ${bill.name}`,
        amount: Number(bill.amount || 0),
        type: 'expense',
        category: 'Hóa đơn',
        date: bill.date || new Date().toLocaleDateString('vi-VN'),
        icon: bill.name?.toLowerCase().includes('học') ? '🎓' : 
              bill.name?.toLowerCase().includes('điện') ? '⚡' : 
              bill.name?.toLowerCase().includes('nước') ? '💧' : 
              bill.name?.toLowerCase().includes('mạng') || bill.name?.toLowerCase().includes('internet') ? '🌐' : '🧾'
      });
    }
  });

  // Chuẩn hóa mọi giao dịch mang tính chất hóa đơn cũ về chung category 'Hóa đơn'
  const expenseTransactions = baseExpenseTransactions.map(t => {
    if (
      t.category === 'Hóa đơn' || 
      t.id?.toString().startsWith('BILL') || 
      ['EVN', 'VNPT', 'Viettel', 'FPT'].includes(t.category) || 
      String(t.name).toLowerCase().includes('thanh toán hóa đơn')
    ) {
      return { ...t, category: 'Hóa đơn', icon: t.icon || '🧾' };
    }
    return t;
  });

  const parseTransactionDate = (date) => {
    if (!date) return null;
    if (typeof date === 'string' && date.includes('T')) {
        const d = new Date(date);
        return { day: d.getDate(), month: d.getMonth() + 1, year: d.getFullYear(), timestamp: d.getTime() };
    }
    const datePart = String(date).trim().split(' ')[0].replace(/[,]/g, '');
    const parts = datePart.split(/[\\/-]/).map(Number);
    if (parts.length !== 3 || parts.some(Number.isNaN)) return null;
    let [p1, p2, p3] = parts;
    let day, month, year;
    if (p1 > 31) { 
        year = p1; month = p2; day = p3;
    } else { 
        day = p1; month = p2; year = p3;
    }
    return { day, month, year, timestamp: new Date(year, month - 1, day).getTime() };
  };

  const getDateKey = (date) => {
    const parsed = parseTransactionDate(date);
    return parsed ? `${parsed.year}-${String(parsed.month).padStart(2, '0')}-${String(parsed.day).padStart(2, '0')}` : '';
  };

  const periodTransactions = expenseTransactions.filter((item) => {
    const parsed = parseTransactionDate(item.date);
    if (!parsed) return false;
    if (period === 'day') return getDateKey(item.date) === selectedDate;
    if (period === 'month') return `${parsed.year}-${String(parsed.month).padStart(2, '0')}` === selectedMonth;
    return String(parsed.year) === selectedYear;
  });

  const periodTotal = periodTransactions.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  
  const sortedPeriodTransactions = [...periodTransactions].sort((a, b) => {
    const tA = parseTransactionDate(a.date)?.timestamp || 0;
    const tB = parseTransactionDate(b.date)?.timestamp || 0;
    return tB - tA; 
  });

  // --- LOGIC MAP CATEGORY VÀ MÀU SẮC BIỂU ĐỒ ---
  const categoryOrderMap = new Map();
  sortedPeriodTransactions.forEach((item) => {
    const category = item.category || 'Khác';
    if (!categoryOrderMap.has(category)) {
      let bgColor = 'bg-amber-500';
      let hexColor = '#f59e0b';
      let icon = '🏷️';
      
      if (category === 'Hóa đơn') {
        bgColor = 'bg-orange-500';
        hexColor = '#f97316'; // Trùng khớp với mã màu cam bg-orange-500
        icon = '🧾';
      } else if (category.includes('Ăn') || category.includes('Uống')) {
        bgColor = 'bg-sky-600';
        hexColor = '#0284c7';
        icon = '🍜';
      } else if (category.includes('Giáo') || category.includes('Học')) {
        bgColor = 'bg-blue-800';
        hexColor = '#1e40af';
        icon = '🎓';
      } else if (category.includes('Mua') || category.includes('Sắm')) {
        bgColor = 'bg-pink-500';
        hexColor = '#ec4899';
        icon = '🛍️';
      }

      categoryOrderMap.set(category, {
        name: category,
        amount: 0,
        color: bgColor,
        chartColor: hexColor, // Lưu trữ mã màu HEX để vẽ pie chart đồng nhất
        icon: item.icon || icon,
      });
    }
    categoryOrderMap.get(category).amount += Number(item.amount || 0);
  });

  const categoryStats = Array.from(categoryOrderMap.values());
  const chartData = categoryStats.map((item) => ({ 
    ...item, 
    chartColor: item.chartColor || '#9ca3af' 
  }));

  let currentRunningLimit = spendingLimit;
  const categoryLimitDetails = new Array(categoryStats.length);
  for (let i = categoryStats.length - 1; i >= 0; i--) {
    const item = categoryStats[i];
    const startingLimit = currentRunningLimit; 
    const remaining = startingLimit - item.amount; 
    
    currentRunningLimit = remaining;
    categoryLimitDetails[i] = { 
      ...item, 
      startingLimit, 
      remaining, 
      usedPercent: startingLimit > 0 ? Math.round((item.amount / startingLimit) * 100) : 100, 
      overAmount: startingLimit <= 0 || item.amount > startingLimit ? Math.max(0, item.amount - Math.max(0, startingLimit)) : 0, 
      isOverLimit: startingLimit <= 0 || item.amount > startingLimit, 
      isExactLimit: remaining === 0 
    };
  }

  const totalExpense = categoryStats.reduce((sum, item) => sum + item.amount, 0);
  const pieGradient = chartData.reduce((result, item) => {
    const angle = totalExpense > 0 ? (item.amount / totalExpense) * 360 : 0;
    const segment = `${item.chartColor} ${result.angle}deg ${result.angle + angle}deg`;
    result.segments.push(segment);
    return { angle: result.angle + angle, segments: result.segments };
  }, { angle: 0, segments: [] }).segments.join(', ');

  const biggestCategory = [...categoryStats].sort((a, b) => b.amount - a.amount)[0];
  const monthlyLimit = spendingLimit;
  const limitPercent = monthlyLimit > 0 ? Math.min(100, Math.round((periodTotal / monthlyLimit) * 100)) : 0;
  const limitStatus = monthlyLimit <= 0 ? 'Chưa đặt hạn mức' : periodTotal > monthlyLimit ? 'Đã vượt hạn mức' : periodTotal === monthlyLimit ? 'Đã hết hạn mức' : limitPercent >= 80 ? 'Sắp chạm hạn mức' : 'Trong hạn mức';

  const saveSpendingLimit = (e) => {
    e.preventDefault();
    const value = parseNumberInput(limitInput);
    setSpendingLimit(value);
    setLimitInput(formatNumberInput(value));
    localStorage.setItem('moneyverse_spending_limit', String(value));
  };

  // ... (Phần render JSX bên dưới hoàn toàn giữ nguyên, chỉ thay đổi mảng mapping chart)
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300 font-sans">
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 p-4 sticky top-0 z-30 flex justify-between items-center">
        <div className="flex items-center gap-3"><h1 className="text-xl font-bold text-gray-800 dark:text-white">Thống kê chi tiêu</h1></div>
        <div className="flex items-center gap-4">
          <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
          <button type="button" onClick={() => navigate('/profile')} className="bg-sky-700 w-10 h-10 rounded-full cursor-pointer shadow-md border-2 border-white dark:border-gray-800 hover:opacity-80 flex items-center justify-center font-bold text-white text-sm">AD</button>
        </div>
      </header>
      
      <main className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
        {/* Bộ lọc thời gian */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-gray-800 p-5 md:p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-md">
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-900 p-1.5 rounded-2xl">
            <button onClick={() => setPeriod('day')} className={`px-5 py-2.5 text-sm md:text-base font-bold rounded-xl transition-all ${period === 'day' ? 'bg-white dark:bg-gray-800 text-sky-700 shadow' : 'text-gray-500'}`}>Theo ngày</button>
            <button onClick={() => setPeriod('month')} className={`px-5 py-2.5 text-sm md:text-base font-bold rounded-xl transition-all ${period === 'month' ? 'bg-white dark:bg-gray-800 text-sky-700 shadow' : 'text-gray-500'}`}>Theo tháng</button>
            <button onClick={() => setPeriod('year')} className={`px-5 py-2.5 text-sm md:text-base font-bold rounded-xl transition-all ${period === 'year' ? 'bg-white dark:bg-gray-800 text-sky-700 shadow' : 'text-gray-500'}`}>Theo năm</button>
          </div>
          <div className="flex items-center gap-3">
            {period === 'day' && <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="px-4 py-2.5 text-base md:text-lg font-medium rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900" />}
            {period === 'month' && <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="px-4 py-2.5 text-base md:text-lg font-medium rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900" />}
            {period === 'year' && (
              <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="px-4 py-2.5 text-base md:text-lg font-medium rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                {Array.from({ length: 5 }, (_, i) => today.getFullYear() - i).map((y) => <option key={y} value={String(y)}>Năm {y}</option>)}
              </select>
            )}
          </div>
        </div>

        {/* Tổng quan */}
        <section className="bg-sky-800 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/10 blur-2xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-purple-100">Tổng chi tiêu {period === 'day' ? 'ngày' : period === 'month' ? 'tháng' : 'năm'}</p>
              <h2 className="text-3xl md:text-4xl font-bold mt-2">{formatCurrency(periodTotal)}</h2>
              {biggestCategory && <p className="text-purple-100 mt-2">Danh mục chiếm nhiều nhất là <span className="font-semibold">{biggestCategory.name}</span></p>}
            </div>
            <div className="flex gap-3">
              <button onClick={() => navigate('/transaction-history')} className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-xl font-semibold transition-colors">Xem lịch sử</button>
              <button onClick={() => navigate('/dashboard')} className="bg-white text-purple-700 hover:bg-purple-50 px-4 py-2 rounded-xl font-semibold transition-colors">Về Trang chủ</button>
            </div>
          </div>
        </section>

        {/* Sơ đồ hình tròn */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-8">Cơ cấu chi tiêu</h3>
          {categoryStats.length > 0 ? (
            <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20">
              <div 
                className="relative w-64 h-64 md:w-80 md:h-80 rounded-full flex items-center justify-center flex-shrink-0 shadow-inner transition-all duration-500"
                style={{ background: totalExpense > 0 ? `conic-gradient(${pieGradient})` : '#e5e7eb' }}
              >
                <div className="w-44 h-44 md:w-56 md:h-56 bg-white dark:bg-gray-800 rounded-full flex flex-col items-center justify-center text-center shadow-lg">
                  <span className="text-sm md:text-base text-gray-400 font-medium">Tổng chi</span>
                  <span className="text-lg md:text-xl font-bold text-gray-800 dark:text-white mt-1">{formatCurrency(totalExpense)}</span>
                </div>
              </div>
              
              <div className="w-full md:max-w-md lg:max-w-lg space-y-4">
                {chartData.map((item) => {
                  const percentage = totalExpense > 0 ? Math.round((item.amount / totalExpense) * 100) : 0;
                  return (
                    <div key={item.name} className="flex items-center justify-between gap-4 bg-gray-50 dark:bg-gray-900/60 p-4 rounded-xl border border-gray-100 dark:border-gray-700/50 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Legend color map được đồng bộ */}
                        <span className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: item.chartColor }}></span>
                        <span className="text-base md:text-lg font-semibold text-gray-700 dark:text-gray-200 truncate">{item.icon} {item.name}</span>
                      </div>
                      <div className="flex items-center gap-4 flex-shrink-0">
                        <span className="text-base md:text-lg font-bold text-gray-800 dark:text-gray-100">{formatCurrency(item.amount)}</span>
                        <span className="text-sm md:text-base font-bold text-gray-400 w-12 text-right">{percentage}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="py-12 text-center text-base text-gray-500">Chưa có dữ liệu chi tiêu để hiển thị biểu đồ.</p>
          )}
        </section>

        {/* Bảng hạn mức */}
        <section ref={limitSectionRef} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Hạn mức chi tiêu tháng</p>
                  <p className={`text-sm font-semibold mt-1 ${monthlyLimit <= 0 ? 'text-gray-500' : periodTotal >= monthlyLimit ? 'text-red-600' : limitPercent >= 80 ? 'text-amber-600' : 'text-teal-600'}`}>{limitStatus}</p>
                </div>
                <span className="font-bold text-gray-800 dark:text-white">{formatCurrency(periodTotal)} / {formatCurrency(monthlyLimit)}</span>
              </div>
              <div className="h-3 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${monthlyLimit <= 0 ? 'bg-gray-300' : periodTotal >= monthlyLimit ? 'bg-red-500' : limitPercent >= 80 ? 'bg-amber-500' : 'bg-sky-600'}`} style={{ width: `${limitPercent}%` }}></div>
              </div>
            </div>
            <form onSubmit={saveSpendingLimit} className="flex gap-2">
              <input type="text" inputMode="numeric" value={limitInput} onChange={(e) => setLimitInput(formatNumberInput(parseNumberInput(e.target.value)))} className="w-44 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:ring-2 focus:ring-sky-500" placeholder="Hạn mức (VNĐ)" />
              <button type="submit" className="px-4 py-2 rounded-lg bg-sky-700 hover:bg-sky-800 text-white font-semibold text-sm transition-colors">Lưu</button>
            </form>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-xs text-gray-500 dark:text-gray-400">Các khoản chi mới nhất ở trên. Hạn mức tự động tính gối đầu từ dưới (cũ nhất) lên trên.</p>
            <button type="button" onClick={() => setShowLimitDetails((show) => !show)} className="inline-flex items-center justify-center gap-2 rounded-lg border border-sky-200 dark:border-sky-800 px-4 py-2 text-sm font-semibold text-sky-700 dark:text-sky-300 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors">
              <span>{showLimitDetails ? 'Ẩn chi tiết' : 'Chi tiết'}</span>
              <span aria-hidden="true">{showLimitDetails ? '▲' : '▼'}</span>
            </button>
          </div>
          
          {showLimitDetails && (
            <div className="mt-4 overflow-hidden rounded-xl border border-gray-100 dark:border-gray-700">
              <div className="grid grid-cols-[minmax(120px,1fr)_minmax(105px,auto)_minmax(105px,auto)_minmax(105px,auto)_minmax(105px,auto)] gap-3 bg-gray-50 dark:bg-gray-900/50 px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                <span>Hạng mục</span>
                <span className="text-right">Hạn mức ban đầu</span>
                <span className="text-right">Đã chi</span>
                <span className="text-right">Hạn mức còn lại</span>
                <span className="text-right">Trạng thái</span>
              </div>
              {categoryLimitDetails.length > 0 && categoryLimitDetails.map((item) => (
                <div key={item.name} className="grid grid-cols-[minmax(120px,1fr)_minmax(105px,auto)_minmax(105px,auto)_minmax(105px,auto)_minmax(105px,auto)] gap-3 border-t border-gray-100 dark:border-gray-700/50 px-4 py-3 text-sm items-center hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <div className="flex items-center gap-2 font-medium text-gray-800 dark:text-gray-200">
                    <span>{item.icon}</span> <span className="truncate">{item.name}</span>
                  </div>
                  <div className="text-right text-gray-600 dark:text-gray-400">{formatCurrency(item.startingLimit)}</div>
                  <div className="text-right font-medium text-gray-800 dark:text-gray-200">{formatCurrency(item.amount)}</div>
                  <div className={`text-right font-semibold ${item.isOverLimit ? 'text-red-600' : 'text-emerald-600'}`}>{formatCurrency(Math.max(0, item.remaining))}</div>
                  <div className="text-right">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${item.isOverLimit ? 'bg-red-100 text-red-700' : item.isExactLimit ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {item.isOverLimit ? 'Vượt' : item.isExactLimit ? 'Hết' : 'Còn'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};
export default SpendingStatistics;
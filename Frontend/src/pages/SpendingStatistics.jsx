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
  
  // State bộ lọc thời gian
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

  const expenseTransactions = (transactions || []).filter((t) => t.type === 'expense');

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

    const timestamp = new Date(year, month - 1, day).getTime();
    return { day, month, year, timestamp };
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
  
  // 1. SẮP XẾP DANH MỤC: Giao dịch MỚI NHẤT lên đầu, CŨ NHẤT nằm ở đáy
  const sortedPeriodTransactions = [...periodTransactions].sort((a, b) => {
    const tA = parseTransactionDate(a.date)?.timestamp || 0;
    const tB = parseTransactionDate(b.date)?.timestamp || 0;
    return tB - tA; // Giảm dần theo thời gian
  });

  const categoryOrderMap = new Map();
  sortedPeriodTransactions.forEach((item) => {
    const category = item.category || 'Khác';
    if (!categoryOrderMap.has(category)) {
      categoryOrderMap.set(category, {
        name: category,
        amount: 0,
        color: category.includes('Ăn') || category.includes('Mua') ? 'bg-sky-600' : category.includes('Giáo') ? 'bg-blue-800' : 'bg-amber-500',
        icon: category.includes('Ăn') ? '🍜' : category.includes('Giáo') ? '🎓' : category.includes('Mua') ? '🛍️' : '🧾',
      });
    }
    categoryOrderMap.get(category).amount += Number(item.amount || 0);
  });

  const categoryStats = Array.from(categoryOrderMap.values());

  // 2. LOGIC TÍNH TOÁN HẠN MỨC TỪ DƯỚI LÊN TRÊN (Cũ tới Mới)
  let currentRunningLimit = spendingLimit;
  const categoryLimitDetails = new Array(categoryStats.length);

  for (let i = categoryStats.length - 1; i >= 0; i--) {
    const item = categoryStats[i];
    const startingLimit = currentRunningLimit; 
    const remaining = startingLimit - item.amount; 
    
    currentRunningLimit = remaining;

    const isOverLimit = startingLimit <= 0 || item.amount > startingLimit;
    const isExactLimit = remaining === 0;
    const overAmount = isOverLimit ? Math.max(0, item.amount - Math.max(0, startingLimit)) : 0;
    const usedPercent = startingLimit > 0 ? Math.round((item.amount / startingLimit) * 100) : 100;

    categoryLimitDetails[i] = { 
      ...item, 
      startingLimit, 
      remaining, 
      usedPercent, 
      overAmount, 
      isOverLimit, 
      isExactLimit 
    };
  }

  const totalExpense = categoryStats.reduce((sum, item) => sum + item.amount, 0);
  const monthlyLimit = spendingLimit;
  const chartColors = ['#0284c7', '#7c3aed', '#0f766e', '#d97706', '#dc2626', '#db2777'];
  const chartData = categoryStats.map((item, index) => ({ ...item, chartColor: chartColors[index % chartColors.length] }));
  
  // Dữ liệu tạo biểu đồ tròn (Pie/Donut chart)
  const pieGradient = chartData.reduce((result, item) => {
    const angle = totalExpense > 0 ? (item.amount / totalExpense) * 360 : 0;
    const segment = `${item.chartColor} ${result.angle}deg ${result.angle + angle}deg`;
    result.segments.push(segment);
    return { angle: result.angle + angle, segments: result.segments };
  }, { angle: 0, segments: [] }).segments.join(', ');

  const biggestCategory = [...categoryStats].sort((a, b) => b.amount - a.amount)[0];
  const pendingBills = (bills || []).filter((bill) => bill.status === 'pending');
  const pendingBillAmount = pendingBills.reduce((sum, bill) => sum + Number(bill.amount || 0), 0);
  const averageDaily = Math.round(totalExpense / 30);
  const limitPercent = monthlyLimit > 0 ? Math.min(100, Math.round((periodTotal / monthlyLimit) * 100)) : 0;
  const limitStatus = monthlyLimit <= 0 ? 'Chưa đặt hạn mức' : periodTotal > monthlyLimit ? 'Đã vượt hạn mức' : periodTotal === monthlyLimit ? 'Đã hết hạn mức' : limitPercent >= 80 ? 'Sắp chạm hạn mức' : 'Trong hạn mức';

  const saveSpendingLimit = (e) => {
    e.preventDefault();
    const value = parseNumberInput(limitInput);
    setSpendingLimit(value);
    setLimitInput(formatNumberInput(value));
    localStorage.setItem('moneyverse_spending_limit', String(value));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300 font-sans">
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 p-4 sticky top-0 z-30 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">Thống kê chi tiêu</h1>
        </div>

        <div className="flex items-center gap-4">
          <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
          <button type="button" aria-label="Mở trang cá nhân" onClick={() => navigate('/profile')} className="bg-sky-700 w-10 h-10 rounded-full cursor-pointer shadow-md border-2 border-white dark:border-gray-800 hover:opacity-80 transition-opacity flex items-center justify-center font-bold text-white text-sm">
            AD
          </button>
        </div>
      </header>

      <main className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
        
        {/* BỘ LỌC THỜI GIAN - ĐÃ TĂNG KÍCH THƯỚC TO RÕ RÀNG */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-gray-800 p-5 md:p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-md">
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-900 p-1.5 rounded-2xl">
            <button
              type="button"
              onClick={() => setPeriod('day')}
              className={`px-5 py-2.5 text-sm md:text-base font-bold rounded-xl transition-all ${period === 'day' ? 'bg-white dark:bg-gray-800 text-sky-700 dark:text-sky-300 shadow' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              Theo ngày
            </button>
            <button
              type="button"
              onClick={() => setPeriod('month')}
              className={`px-5 py-2.5 text-sm md:text-base font-bold rounded-xl transition-all ${period === 'month' ? 'bg-white dark:bg-gray-800 text-sky-700 dark:text-sky-300 shadow' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              Theo tháng
            </button>
            <button
              type="button"
              onClick={() => setPeriod('year')}
              className={`px-5 py-2.5 text-sm md:text-base font-bold rounded-xl transition-all ${period === 'year' ? 'bg-white dark:bg-gray-800 text-sky-700 dark:text-sky-300 shadow' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              Theo năm
            </button>
          </div>

          <div className="flex items-center gap-3">
            {period === 'day' && (
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2.5 text-base md:text-lg font-medium rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-sky-500 shadow-sm cursor-pointer"
              />
            )}
            {period === 'month' && (
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-4 py-2.5 text-base md:text-lg font-medium rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-sky-500 shadow-sm cursor-pointer"
              />
            )}
            {period === 'year' && (
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-4 py-2.5 text-base md:text-lg font-medium rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-sky-500 shadow-sm cursor-pointer"
              >
                {Array.from({ length: 5 }, (_, i) => today.getFullYear() - i).map((y) => (
                  <option key={y} value={String(y)}>Năm {y}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* TỔNG QUAN BANNER */}
        <section className="bg-sky-800 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/10 blur-2xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-purple-100">Tổng chi tiêu {period === 'day' ? 'ngày' : period === 'month' ? 'tháng' : 'năm'}</p>
              <h2 className="text-3xl md:text-4xl font-bold mt-2">{formatCurrency(periodTotal)}</h2>
              {biggestCategory && (
                <p className="text-purple-100 mt-2">Danh mục chiếm nhiều nhất là <span className="font-semibold">{biggestCategory.name}</span></p>
              )}
            </div>
            <div className="flex gap-3">
              <button onClick={() => navigate('/transaction-history')} className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-xl font-semibold transition-colors">
                Xem lịch sử
              </button>
              <button onClick={() => navigate('/dashboard')} className="bg-white text-purple-700 hover:bg-purple-50 px-4 py-2 rounded-xl font-semibold transition-colors">
                Về Trang chủ
              </button>
            </div>
          </div>
        </section>

        {/* SƠ ĐỒ HÌNH TRÒN PHÂN BỔ CHI TIÊU - ĐÃ CHỈNH LẠI CẤU TRÚC LỚN & ĐẶC HƠN */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-8">Cơ cấu chi tiêu</h3>
          
          {categoryStats.length > 0 ? (
            <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20">
              
              {/* Vòng tròn biểu đồ - Tăng kích thước (w-64/w-80) */}
              <div 
                className="relative w-64 h-64 md:w-80 md:h-80 rounded-full flex items-center justify-center flex-shrink-0 shadow-inner transition-all duration-500"
                style={{
                  background: totalExpense > 0 ? `conic-gradient(${pieGradient})` : '#e5e7eb'
                }}
              >
                <div className="w-44 h-44 md:w-56 md:h-56 bg-white dark:bg-gray-800 rounded-full flex flex-col items-center justify-center text-center shadow-lg">
                  <span className="text-sm md:text-base text-gray-400 font-medium">Tổng chi</span>
                  <span className="text-lg md:text-xl font-bold text-gray-800 dark:text-white mt-1">
                    {formatCurrency(totalExpense)}
                  </span>
                </div>
              </div>

              {/* Chú thích các hạng mục - Gom lại và làm dạng Card để lấp đầy khoảng trống */}
              <div className="w-full md:max-w-md lg:max-w-lg space-y-4">
                {chartData.map((item) => {
                  const percentage = totalExpense > 0 ? Math.round((item.amount / totalExpense) * 100) : 0;
                  return (
                    <div 
                      key={item.name} 
                      className="flex items-center justify-between gap-4 bg-gray-50 dark:bg-gray-900/60 p-4 rounded-xl border border-gray-100 dark:border-gray-700/50 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span 
                          className="w-4 h-4 rounded-full flex-shrink-0" 
                          style={{ backgroundColor: item.chartColor }}
                        ></span>
                        <span className="text-base md:text-lg font-semibold text-gray-700 dark:text-gray-200 truncate">
                          {item.icon} {item.name}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 flex-shrink-0">
                        <span className="text-base md:text-lg font-bold text-gray-800 dark:text-gray-100">
                          {formatCurrency(item.amount)}
                        </span>
                        <span className="text-sm md:text-base font-bold text-gray-400 w-12 text-right">
                          {percentage}%
                        </span>
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

        {/* HẠN MỨC CHI TIÊU (TÍNH TỪ DƯỚI LÊN TỪ CŨ TỚI MỚI) */}
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
              <input type="text" inputMode="numeric" value={limitInput} onChange={(e) => setLimitInput(formatNumberInput(parseNumberInput(e.target.value)))} className="w-44 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:ring-2 focus:ring-sky-500" placeholder="Hạn mức (VNĐ)" aria-label="Hạn mức chi tiêu tháng" />
              <button type="submit" className="px-4 py-2 rounded-lg bg-sky-700 hover:bg-sky-800 text-white font-semibold text-sm transition-colors">Lưu</button>
            </form>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-xs text-gray-500 dark:text-gray-400">Các khoản chi mới nhất ở trên. Hạn mức tự động tính gối đầu từ dưới (cũ nhất) lên trên.</p>
            <button type="button" onClick={() => setShowLimitDetails((show) => !show)} aria-expanded={showLimitDetails} className="inline-flex items-center justify-center gap-2 rounded-lg border border-sky-200 dark:border-sky-800 px-4 py-2 text-sm font-semibold text-sky-700 dark:text-sky-300 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors">
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
              
              {categoryLimitDetails.length > 0 ? categoryLimitDetails.map((item) => (
                <div key={item.name} className={`grid grid-cols-1 sm:grid-cols-[minmax(120px,1fr)_minmax(105px,auto)_minmax(105px,auto)_minmax(105px,auto)_minmax(105px,auto)] items-center gap-3 border-t border-gray-100 dark:border-gray-700 px-4 py-3 ${item.isOverLimit ? 'bg-red-50 dark:bg-red-950/20' : 'bg-white dark:bg-gray-800'}`}>
                  <div className="min-w-0">
                    <p className={`font-semibold ${item.isOverLimit ? 'text-red-700 dark:text-red-300' : 'text-gray-800 dark:text-gray-100'}`}>{item.icon} {item.name}</p>
                  </div>
                  
                  <span className="text-right text-sm font-semibold whitespace-nowrap text-gray-700 dark:text-gray-300">
                    {formatCurrency(item.startingLimit)}
                  </span>

                  <span className={`text-right text-sm font-semibold whitespace-nowrap ${item.isOverLimit ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}`}>
                    {formatCurrency(item.amount)}
                  </span>

                  <span className={`text-right text-sm font-semibold whitespace-nowrap ${item.isOverLimit ? 'text-red-600 dark:text-red-400' : 'text-emerald-700 dark:text-emerald-300'}`}>
                    {formatCurrency(item.remaining)}
                  </span>
                  
                  <div className="text-right">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${item.isOverLimit ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-200' : item.isExactLimit ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-200' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200'}`}>
                        {item.isOverLimit ? `Vượt ${formatCurrency(item.overAmount)}` : item.isExactLimit ? 'Hết hạn mức' : `Còn ${formatCurrency(item.remaining)}`}
                    </span>
                  </div>
                  
                  <div className="col-span-full h-1.5 flex overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                    {item.isOverLimit ? (
                      <>
                        <div className="h-full bg-emerald-500" style={{ width: `${item.startingLimit > 0 ? (item.startingLimit / item.amount) * 100 : 0}%` }} />
                        <div className="h-full bg-red-500" style={{ width: `${item.startingLimit > 0 ? (item.overAmount / item.amount) * 100 : 100}%` }} />
                      </>
                    ) : (
                      <div className="h-full bg-emerald-500" style={{ width: `${Math.min(100, item.usedPercent)}%` }} />
                    )}
                  </div>
                </div>
              )) : <p className="px-4 py-6 text-center text-sm text-gray-500">Chưa có khoản chi nào trong tháng này.</p>}
            </div>
          )}
        </section>

        {/* CÁC THỐNG KÊ PHỤ */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-sky-100 dark:border-sky-900/50">
            <p className="text-sm font-semibold text-sky-600 dark:text-sky-400">Số dư khả dụng</p>
            <h3 className="text-2xl font-bold mt-2 text-sky-700 dark:text-sky-300">{formatCurrency(balance)}</h3>
          </div>
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
            <h3 className="text-2xl font-bold mt-2">{biggestCategory?.name || 'Chưa có'}</h3>
            <p className="text-sm text-gray-500 mt-1">{formatCurrency(biggestCategory?.amount || 0)}</p>
          </div>
        </section>

      </main>
    </div>
  );
};

export default SpendingStatistics;

import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DarkModeToggle from '../components/DarkModeToggle';

const SpendingStatistics = ({ darkMode, setDarkMode, balance = 0, transactions = [], bills = [] }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const limitSectionRef = useRef(null);
  const limitInputRef = useRef(null);
  
  // Khởi tạo ngày hiện tại
  const today = new Date();
  const todayDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const todayMonth = todayDate.slice(0, 7);
  
  const [spendingLimit, setSpendingLimit] = useState(() => Number(localStorage.getItem('moneyverse_spending_limit') || 10000000));
  const [limitInput, setLimitInput] = useState(() => String(spendingLimit));
  const [period, setPeriod] = useState('month');
  const [selectedDate, setSelectedDate] = useState(todayDate);
  const [selectedMonth, setSelectedMonth] = useState(todayMonth);
  const [selectedYear, setSelectedYear] = useState(String(today.getFullYear()));

  useEffect(() => {
    if (new URLSearchParams(location.search).get('focus') !== 'limit') return;
    window.setTimeout(() => {
      limitSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      limitInputRef.current?.focus();
    }, 50);
  }, [location.search]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const expenseTransactions = (transactions || []).filter((t) => t.type === 'expense');

  // TỐI ƯU HÀM PARSE DATE: Ưu tiên xử lý chuẩn DD/MM/YYYY của Việt Nam
  const parseTransactionDate = (date) => {
    if (!date) return null;
    
    // Nếu data từ DB trả về là ISO string (có chữ T)
    if (typeof date === 'string' && date.includes('T')) {
        const d = new Date(date);
        return { day: d.getDate(), month: d.getMonth() + 1, year: d.getFullYear() };
    }

    const datePart = String(date).trim().split(' ')[0].replace(/[,]/g, '');
    const parts = datePart.split(/[\\/-]/).map(Number);
    if (parts.length !== 3 || parts.some(Number.isNaN)) return null;

    let [p1, p2, p3] = parts;
    let day, month, year;

    if (p1 > 31) { 
        // Dạng YYYY-MM-DD
        year = p1; month = p2; day = p3;
    } else { 
        // Dạng DD/MM/YYYY (Chuẩn Việt Nam)
        day = p1; month = p2; year = p3;
    }

    return { day, month, year };
  };

  const getDateKey = (date) => {
    const parsed = parseTransactionDate(date);
    return parsed ? `${parsed.year}-${String(parsed.month).padStart(2, '0')}-${String(parsed.day).padStart(2, '0')}` : '';
  };

  // Lọc giao dịch theo thời gian đã chọn
  const periodTransactions = expenseTransactions.filter((item) => {
    const parsed = parseTransactionDate(item.date);
    if (!parsed) return false;
    
    if (period === 'day') return getDateKey(item.date) === selectedDate;
    if (period === 'month') return `${parsed.year}-${String(parsed.month).padStart(2, '0')}` === selectedMonth;
    return String(parsed.year) === selectedYear;
  });

  const periodTotal = periodTransactions.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  
  // LOGIC BIỂU ĐỒ (Giống app Mía): Gom nhóm theo Danh mục thay vì từng khoản chi lẻ tẻ
  const chartMap = periodTransactions.reduce((acc, item) => {
    const parsed = parseTransactionDate(item.date);
    const label = period === 'day' ? (item.category || 'Khác') 
      : period === 'month' ? String(parsed.day).padStart(2, '0')
      : String(parsed.month).padStart(2, '0');
    
    acc[label] = (acc[label] || 0) + Number(item.amount || 0);
    return acc;
  }, {});

  const chartEntries = period === 'month'
    ? Array.from({ length: new Date(Number(selectedMonth.slice(0, 4)), Number(selectedMonth.slice(5, 7)), 0).getDate() }, (_, index) => {
        const label = String(index + 1).padStart(2, '0');
        return [label, chartMap[label] || 0];
      })
    : Object.entries(chartMap);

  const periodChart = chartEntries.sort((a, b) => period === 'day' ? b[1] - a[1] : Number(a[0]) - Number(b[0]));
  const chartMax = Math.max(...periodChart.map(([, amount]) => amount), 1);
  const periodLabel = period === 'day' ? `Ngày ${selectedDate.split('-').reverse().join('/')}` : period === 'month' ? `Tháng ${selectedMonth.split('-').reverse().join('/')}` : `Năm ${selectedYear}`;

  const categoryMap = periodTransactions.reduce((acc, item) => {
    const category = item.category || 'Khác';
    acc[category] = (acc[category] || 0) + Number(item.amount || 0);
    return acc;
  }, {});

  const categoryStats = Object.entries(categoryMap).length > 0
    ? Object.entries(categoryMap).map(([name, amount]) => ({
        name,
        amount,
        color: name.includes('Ăn') || name.includes('Mua') ? 'bg-sky-600' : name.includes('Giáo') ? 'bg-blue-800' : 'bg-amber-500',
        icon: name.includes('Ăn') ? '🍜' : name.includes('Giáo') ? '🎓' : name.includes('Mua') ? '🛍️' : '🧾',
      })).sort((a, b) => b.amount - a.amount)
    : [
        { name: 'Ăn uống', amount: 3200000, color: 'bg-sky-600', icon: '🍜' },
        { name: 'Giáo dục', amount: 2000000, color: 'bg-blue-800', icon: '🎓' },
        { name: 'Mua sắm', amount: 1500000, color: 'bg-teal-600', icon: '🛍️' },
        { name: 'Dịch vụ', amount: 1100000, color: 'bg-amber-500', icon: '🧾' },
      ];

  const totalExpense = categoryStats.reduce((sum, item) => sum + item.amount, 0);
  const chartColors = ['#0284c7', '#7c3aed', '#0f766e', '#d97706', '#dc2626', '#db2777'];
  const chartData = categoryStats.map((item, index) => ({ ...item, chartColor: chartColors[index % chartColors.length] }));
  
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
  const limitPercent = spendingLimit > 0 ? Math.min(100, Math.round((totalExpense / spendingLimit) * 100)) : 0;
  const limitStatus = totalExpense >= spendingLimit ? 'Đã vượt hạn mức' : limitPercent >= 80 ? 'Sắp chạm hạn mức' : 'Trong hạn mức';

  const saveSpendingLimit = (e) => {
    e.preventDefault();
    const value = Math.max(0, Number(limitInput) || 0);
    setSpendingLimit(value);
    localStorage.setItem('moneyverse_spending_limit', String(value));
  };

  const weeklyTrend = [
    { label: 'Tuần 1', amount: 950000 },
    { label: 'Tuần 2', amount: 1300000 },
    { label: 'Tuần 3', amount: 810000 },
    { label: 'Tuần 4', amount: 1180000 },
  ];

  const recentExpenses = periodTransactions.length > 0
    ? periodTransactions.sort((a, b) => new Date(getDateKey(b.date)) - new Date(getDateKey(a.date))).slice(0, 5)
    : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300 font-sans">
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 p-4 sticky top-0 z-30 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">
            Thống kê chi tiêu
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
          <button type="button" aria-label="Mở trang cá nhân" onClick={() => navigate('/profile')} className="bg-sky-700 w-10 h-10 rounded-full cursor-pointer shadow-md border-2 border-white dark:border-gray-800 hover:opacity-80 transition-opacity flex items-center justify-center font-bold text-white text-sm">
            AD
          </button>
        </div>
      </header>

      <main className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
        <section className="bg-sky-800 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/10 blur-2xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-purple-100">Tổng chi tiêu {periodLabel.toLowerCase()}</p>
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

        <section ref={limitSectionRef} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Hạn mức chi tiêu tháng</p>
                  <p className={`text-sm font-semibold mt-1 ${totalExpense >= spendingLimit ? 'text-red-600' : limitPercent >= 80 ? 'text-amber-600' : 'text-teal-600'}`}>{limitStatus}</p>
                </div>
                <span className="font-bold text-gray-800 dark:text-white">{formatCurrency(totalExpense)} / {formatCurrency(spendingLimit)}</span>
              </div>
              <div className="h-3 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${totalExpense >= spendingLimit ? 'bg-red-500' : limitPercent >= 80 ? 'bg-amber-500' : 'bg-sky-600'}`} style={{ width: `${limitPercent}%` }}></div>
              </div>
            </div>
            <form onSubmit={saveSpendingLimit} className="flex gap-2">
              <input ref={limitInputRef} type="number" min="0" value={limitInput} onChange={(e) => setLimitInput(e.target.value)} className="w-44 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:ring-2 focus:ring-sky-500" placeholder="Hạn mức (VNĐ)" />
              <button type="submit" className="px-4 py-2 rounded-lg bg-sky-700 hover:bg-sky-800 text-white font-semibold text-sm transition-colors">Lưu</button>
            </form>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-sky-100 dark:border-sky-900/50">
            <p className="text-sm font-semibold text-sky-600 dark:text-sky-400">Số dư khả dụng</p>
            <h3 className="text-2xl font-bold mt-2 text-sky-700 dark:text-sky-300">{formatCurrency(balance)}</h3>
            <p className="text-xs text-gray-500 mt-1">Cập nhật theo giao dịch</p>
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

        <section className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-lg text-gray-800 dark:text-white">Phân bố chi tiêu theo danh mục</h3>
                <p className="text-sm text-gray-500 mt-1">Tỷ lệ chi tiêu của từng hạng mục trong {periodLabel.toLowerCase()}</p>
              </div>
              <button type="button" onClick={() => navigate('/add-transaction?type=expense&returnTo=spending-statistics')} className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700">
                <span className="text-lg leading-none">+</span>
                <span className="hidden sm:inline">Thêm khoản chi</span>
              </button>
            </div>

            {totalExpense > 0 ? (
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative shrink-0 w-56 h-56 rounded-full shadow-inner transition-transform hover:scale-105 duration-300" style={{ background: `conic-gradient(${pieGradient})` }}>
                  <div className="absolute inset-7 rounded-full bg-white dark:bg-gray-800 flex flex-col items-center justify-center text-center shadow-sm">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Tổng chi</span>
                    <strong className="text-base text-gray-800 dark:text-white px-3">{formatCurrency(totalExpense)}</strong>
                  </div>
                </div>

                <div className="w-full space-y-3">
                {chartData.map((item) => {
                  const percent = totalExpense > 0 ? Math.round((item.amount / totalExpense) * 100) : 0;
                  return (
                    <div key={item.name} className="flex justify-between items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: item.chartColor }} />
                          <span className="text-xl">{item.icon}</span>
                          <span className="font-semibold text-gray-700 dark:text-gray-200">{item.name}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400 text-right whitespace-nowrap">{percent}% · {formatCurrency(item.amount)}</span>
                    </div>
                  );
                })}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                <span className="text-4xl mb-2">📊</span>
                <p>Chưa có dữ liệu phân bố danh mục</p>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-4">Xu hướng chi tiêu theo tuần</h3>
            <div className="space-y-4">
              {weeklyTrend.map((item) => {
                const width = Math.min(100, Math.round((item.amount / 1500000) * 100));
                return (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm font-medium text-gray-600 dark:text-gray-300 mb-1.5">
                      <span>{item.label}</span>
                      <span>{formatCurrency(item.amount)}</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                      <div className="h-full rounded-full bg-sky-600/80" style={{ width: `${width}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <h3 className="font-bold text-lg text-gray-800 dark:text-white">Giao dịch chi tiêu gần đây</h3>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
            {recentExpenses.length > 0 ? recentExpenses.map((item) => {
               // Parse lại ngày để hiển thị chuẩn DD/MM/YYYY cho người dùng
               const d = parseTransactionDate(item.date);
               const displayDate = d ? `${String(d.day).padStart(2, '0')}/${String(d.month).padStart(2, '0')}/${d.year}` : item.date;
               
               return (
                <div key={item.id} className="flex justify-between items-center px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/30 text-red-500 flex items-center justify-center text-2xl shadow-sm border border-red-100 dark:border-red-900/30">
                      {item.icon || '🧾'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-200 text-base">{item.name}</p>
                      <p className="text-sm text-gray-500 mt-0.5">{item.category} • {displayDate}</p>
                    </div>
                  </div>
                  <span className="font-bold text-red-500 text-lg">-{formatCurrency(item.amount)}</span>
                </div>
              );
            }) : (
              <div className="px-6 py-8 text-center text-gray-500">
                Không có giao dịch nào trong khoảng thời gian này.
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default SpendingStatistics;

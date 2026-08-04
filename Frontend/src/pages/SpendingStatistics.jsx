import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DarkModeToggle from '../components/DarkModeToggle';

const formatNumberInput = (value) => new Intl.NumberFormat('vi-VN').format(Number(value) || 0);
const parseNumberInput = (value) => Number(String(value).replace(/\D/g, '')) || 0;
const CATEGORY_BUDGETS_KEY = 'moneyverse_category_budgets';
const getCategoryBudgets = () => {
  try { return JSON.parse(localStorage.getItem(CATEGORY_BUDGETS_KEY) || '{}'); } catch { return {}; }
};

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

   // State b? l?c th?i gian
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

   // 1. S?P X?P DANH M?C: Giao d?ch M?I NH?T l�n d?u, CU NH?T n?m ? d�y
   const sortedPeriodTransactions = [...periodTransactions].sort((a, b) => {
      const tA = parseTransactionDate(a.date)?.timestamp || 0;
      const tB = parseTransactionDate(b.date)?.timestamp || 0;
      return tB - tA; // Gi?m d?n theo th?i gian
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

   // 2. LOGIC T�NH TO�N H?  N M?C T? DU?I L�N TR�N (Cu t?i M?i)
   const categoryBudgets = getCategoryBudgets();
  const categoryLimitDetails = categoryStats.map((item) => {
    const startingLimit = Number(categoryBudgets[item.name] || 0);
    const remaining = startingLimit - item.amount;
    const hasBudget = startingLimit > 0;
    const isOverLimit = hasBudget && remaining < 0;
    return {
      ...item,
      startingLimit,
      remaining,
      usedPercent: hasBudget ? Math.round((item.amount / startingLimit) * 100) : 0,
      overAmount: isOverLimit ? Math.abs(remaining) : 0,
      isOverLimit,
      isExactLimit: hasBudget && remaining === 0,
      hasBudget,
    };
  });

  const totalExpense = categoryStats.reduce((sum, item) => sum + item.amount, 0);
   const monthlyLimit = spendingLimit;
   const chartColors = ['#0284c7', '#7c3aed', '#0f766e', '#d97706', '#dc2626', '#db2777'];
   const chartData = categoryStats.map((item, index) => ({ ...item, chartColor: chartColors[index % chartColors.length] }));

   // D? li?u t?o bi?u d? tr�n (Pie/Donut chart)
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
         
            {/* B? L?C TH?I GIAN - �� TANG K�CH THU?C TO R� R�NG */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-gray-800 p-5 md:p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-md">
               <div className="grid w-full grid-cols-1 gap-1 bg-gray-100 p-1.5 dark:bg-gray-900 sm:w-auto sm:grid-cols-3 sm:gap-2 rounded-2xl">
                  <button
                     type="button"
                     onClick={() => setPeriod('day')}
                     className={`whitespace-normal px-3 py-2.5 text-sm md:text-base font-bold rounded-xl transition-all ${period === 'day' ? 'bg-white dark:bg-gray-800 text-sky-700 dark:text-sky-300 shadow' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                  >
                     Theo ngày
                  </button>
                  <button
                     type="button"
                     onClick={() => setPeriod('month')}
                     className={`whitespace-normal px-3 py-2.5 text-sm md:text-base font-bold rounded-xl transition-all ${period === 'month' ? 'bg-white dark:bg-gray-800 text-sky-700 dark:text-sky-300 shadow' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                  >
                     Theo tháng
                  </button>
                  <button
                     type="button"
                     onClick={() => setPeriod('year')}
                     className={`whitespace-normal px-3 py-2.5 text-sm md:text-base font-bold rounded-xl transition-all ${period === 'year' ? 'bg-white dark:bg-gray-800 text-sky-700 dark:text-sky-300 shadow' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
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

            {/* T?NG QUAN BANNER */}
            <section className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 shadow-xl text-white">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm text-purple-100">Tổng chi tiêu</p><h2 className="mt-2 break-words text-3xl font-bold">{formatCurrency(periodTotal)}</h2></div><button onClick={() => navigate('/budget-limits')} className="w-full rounded-xl bg-white px-4 py-2 font-semibold text-purple-700 sm:w-auto">Đặt hạn mức</button></div>
            </section>

            {/* S?   �? H�NH TR�N PH�N B? CHI TI�U - �� CH?NH L?  I C?U TR�C L?N & �?C H?  N */}
            <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="mb-5 text-lg font-bold text-gray-800 dark:text-white">Phân bổ chi tiêu</h2>
              {chartData.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
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

            {/* H?  N M?C CHI TI�U (T�NH T? DU?I L�N T? CU T?I M?I) */}
            <section ref={limitSectionRef} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
               <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
                  <div className="flex-1">
                     <div className="flex flex-col gap-1 mb-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                           <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Hạn mức chi tiêu tháng</p>
                           <p className={`text-sm font-semibold mt-1 ${monthlyLimit <= 0 ? 'text-gray-500' : periodTotal >= monthlyLimit ? 'text-red-600' : limitPercent >= 80 ? 'text-amber-600' : 'text-teal-600'}`}>{limitStatus}</p>
                        </div>
                        <span className="break-words font-bold text-gray-800 dark:text-white">{formatCurrency(periodTotal)} / {formatCurrency(monthlyLimit)}</span>
                     </div>
                     <div className="h-3 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-500 ${monthlyLimit <= 0 ? 'bg-gray-300' : periodTotal >= monthlyLimit ? 'bg-red-500' : limitPercent >= 80 ? 'bg-amber-500' : 'bg-sky-600'}`} style={{ width: `${limitPercent}%` }}></div>
                     </div>
                  </div>
                  <form onSubmit={saveSpendingLimit} className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                     <input type="text" inputMode="numeric" value={limitInput} onChange={(e) => setLimitInput(formatNumberInput(parseNumberInput(e.target.value)))} className="w-full min-w-0 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:ring-2 focus:ring-sky-500 sm:w-44" placeholder="Hạn mức (VNĐ)" aria-label="Hạn mức chi tiêu tháng" />
                     <button type="submit" className="px-4 py-2 rounded-lg bg-sky-700 hover:bg-sky-800 text-white font-semibold text-sm transition-colors">Lưu</button>
                  </form>
               </div>

               <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Chi tiết hạn mức theo từng hạng mục trong khoảng thời gian đang chọn.</p>
                  <button type="button" onClick={() => setShowLimitDetails((show) => !show)} aria-expanded={showLimitDetails} className="inline-flex items-center justify-center gap-2 rounded-lg border border-sky-200 dark:border-sky-800 px-4 py-2 text-sm font-semibold text-sky-700 dark:text-sky-300 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors">
                     <span>{showLimitDetails ? 'Ẩn chi tiết' : 'Chi tiết'}</span>
                     <span aria-hidden="true">{showLimitDetails ? '▲' : '▼'}</span>
                  </button>
               </div>

               {showLimitDetails && (
                  <div className="mt-4 overflow-hidden rounded-xl border border-gray-100 dark:border-gray-700">
                     <div className="hidden sm:grid sm:grid-cols-5 gap-3 bg-gray-50 dark:bg-gray-900/50 px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        <span>Hạng mục</span>
                        <span className="text-right">Hạn mức ban đầu</span>
                        <span className="text-right">Đã chi</span>
                        <span className="text-right">Hạn mức còn lại</span>
                        <span className="text-right">Trạng thái</span>
                     </div>
                  
                     {categoryLimitDetails.length > 0 ? categoryLimitDetails.map((item) => (
                        <div key={item.name} className={`grid grid-cols-1 sm:grid-cols-5 items-center gap-3 border-t border-gray-100 dark:border-gray-700 px-4 py-3 ${item.isOverLimit ? 'bg-red-50 dark:bg-red-950/20' : 'bg-white dark:bg-gray-800'}`}>
                           <div className="min-w-0">
                              <p className={`font-semibold ${item.isOverLimit ? 'text-red-700 dark:text-red-300' : 'text-gray-800 dark:text-gray-100'}`}>{item.icon} {item.name}</p>
                           </div>
                        
                           <span className="break-words text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
                              {formatCurrency(item.startingLimit)}
                           </span>

                           <span className={`break-words text-right text-sm font-semibold ${item.isOverLimit ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}`}>
                              {formatCurrency(item.amount)}
                           </span>

                           <span className={`break-words text-right text-sm font-semibold ${item.isOverLimit ? 'text-red-600 dark:text-red-400' : 'text-emerald-700 dark:text-emerald-300'}`}>
                              {formatCurrency(item.remaining)}
                           </span>
                        
                           <div className="text-right">
                              <span className={`inline-flex max-w-full break-words rounded-full px-2.5 py-1 text-left text-xs font-bold ${item.isOverLimit ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-200' : item.isExactLimit ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-200' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200'}`}>
                                    {!item.hasBudget ? 'Chưa đặt hạn mức' : item.isOverLimit ? `Vượt ${formatCurrency(item.overAmount)}` : item.isExactLimit ? 'Hết hạn mức' : `Còn ${formatCurrency(item.remaining)}`}
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
                     )) : <p className="px-4 py-6 text-center text-sm text-gray-500">Chưa có khoản chi nào trong khoảng thời gian này.</p>}
                  </div>
               )}
            </section>

            {/* C�C TH?NG K� PH? */}
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
                  <p className="text-sm font-semibold text-gray-400 dark:text-gray-500">Mục chi lớn nhất</p>
                  <h3 className="text-2xl font-bold mt-2">{biggestCategory?.name || 'Chưa có'}</h3>
                  <p className="text-sm text-gray-500 mt-1">{formatCurrency(biggestCategory?.amount || 0)}</p>
               </div>
            </section>

         </main>
      </div>
   );
};

export default SpendingStatistics;


import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DarkModeToggle from '../components/DarkModeToggle';


const Reports = ({ darkMode, setDarkMode, transactions = [] }) => {
  const navigate = useNavigate();
  const today = new Date();
  const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000);
  const [period, setPeriod] = useState('month');
  const [selectedMonth, setSelectedMonth] = useState(localDate.toISOString().slice(0, 7));
  const [selectedYear, setSelectedYear] = useState(String(today.getFullYear()));
  const [selectedChartLabel, setSelectedChartLabel] = useState(null);

  const parseDate = (value) => {
    if (!value) return null;
    if (String(value).includes('T')) return new Date(value);
    const parts = String(value).split(' ')[0].split(/[/-]/).map(Number);
    if (parts.length !== 3 || parts.some(Number.isNaN)) return null;
    return parts[0] > 31 ? new Date(parts[0], parts[1] - 1, parts[2]) : new Date(parts[2], parts[1] - 1, parts[0]);
  };
  const key = (date) => date ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` : '';
  const money = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

  const report = useMemo(() => {
    const filtered = transactions.filter((item) => {
      const date = parseDate(item.date);
      if (!date) return false;
      if (period === 'day') return key(date).slice(0, 7) === selectedMonth;
      if (period === 'month') return String(date.getFullYear()) === selectedYear;
      return true;
    });
    const expenseTransactions = filtered.filter((item) => item.type === 'expense');
    const totalExpense = expenseTransactions.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const totalIncome = filtered.filter((item) => item.type === 'income').reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const categoryTransactions = selectedChartLabel
      ? filtered.filter((item) => {
        const date = parseDate(item.date);
        const label = period === 'day' ? String(date.getDate()).padStart(2, '0') : period === 'month' ? String(date.getMonth() + 1).padStart(2, '0') : String(date.getFullYear());
        return label === selectedChartLabel;
      })
      : filtered;
    const categories = categoryTransactions.filter((item) => item.type === 'expense').reduce((result, item) => {
      const name = item.category || 'Khác';
      result[name] = (result[name] || 0) + Number(item.amount || 0);
      return result;
    }, {});
    const categoryIncome = categoryTransactions.filter((item) => item.type === 'income').reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const categoryExpense = categoryTransactions.filter((item) => item.type === 'expense').reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const ranking = Object.entries(categories).sort((a, b) => b[1] - a[1]);
    const average = expenseTransactions.length ? Math.round(totalExpense / expenseTransactions.length) : 0;
    const periodGrouped = filtered.reduce((result, item) => {
      const date = parseDate(item.date);
      const label = period === 'day' ? String(date.getDate()).padStart(2, '0') : period === 'month' ? String(date.getMonth() + 1).padStart(2, '0') : String(date.getFullYear());
      if (!result[label]) result[label] = { income: 0, expense: 0 };
      result[label][item.type === 'income' ? 'income' : 'expense'] += Number(item.amount || 0);
      return result;
    }, {});
    const chartKeys = period === 'day'
      ? Array.from({ length: new Date(Number(selectedMonth.slice(0, 4)), Number(selectedMonth.slice(5, 7)), 0).getDate() }, (_, index) => String(index + 1).padStart(2, '0'))
      : period === 'month'
        ? Array.from({ length: 12 }, (_, index) => String(index + 1).padStart(2, '0'))
        : Object.keys(periodGrouped).sort((a, b) => Number(a) - Number(b));
    const chartData = chartKeys.map((label) => [label, periodGrouped[label] || { income: 0, expense: 0 }]);
    return { filtered, total: totalExpense, totalExpense, totalIncome, categoryIncome, categoryExpense, ranking, average, chartData };
  }, [transactions, period, selectedMonth, selectedYear, selectedChartLabel]);

  const top = report.ranking[0];
  const analysis = report.totalExpense === 0 && report.totalIncome === 0
    ? 'Chưa có dữ liệu chi tiêu trong khoảng thời gian này. Hãy thêm giao dịch để hệ thống phân tích chính xác hơn.'
    : `Bạn đã chi ${money(report.total)} qua ${report.filtered.length} giao dịch. ${top ? `Nhóm “${top[0]}” chiếm nhiều nhất với ${money(top[1])}.` : ''} Mức chi trung bình mỗi giao dịch là ${money(report.average)}.`;

  return <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
    <header className="bg-white/80 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-gray-800 dark:text-white">Báo cáo chi tiêu</h1>
      <div className="flex items-center gap-4"><DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} /><button onClick={() => navigate('/profile')} className="bg-sky-700 w-10 h-10 rounded-full text-white font-bold">AD</button></div>
    </header>
    <main className="p-6 md:p-8 max-w-6xl mx-auto space-y-6 flex flex-col [&>section:nth-child(1)]:order-1 [&>section:nth-child(2)]:hidden [&>section:nth-child(3)]:order-4 [&>section:nth-child(4)]:order-2">
      <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex flex-wrap gap-2 mb-5">{[['day', 'Theo ngày'], ['month', 'Theo tháng'], ['year', 'Theo năm']].map(([value, label]) => <button key={value} onClick={() => setPeriod(value)} className={`px-4 py-2 rounded-xl font-semibold ${period === value ? 'bg-sky-700 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}>{label}</button>)}
          {period === 'day' && <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="px-3 rounded-xl border dark:bg-gray-900" />}
          {period === 'month' && <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="px-3 rounded-xl border dark:bg-gray-900" />}
          {period === 'year' && <input type="number" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="w-28 px-3 rounded-xl border dark:bg-gray-900" />}
        </div>
        <div className="grid md:grid-cols-3 gap-4"><div className="bg-sky-50 dark:bg-sky-900/20 p-5 rounded-xl"><p className="text-sm text-gray-500">Tổng chi tiêu</p><strong className="text-2xl text-sky-700">{money(report.total)}</strong></div><div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded-xl"><p className="text-sm text-gray-500">Số giao dịch</p><strong className="text-2xl">{report.filtered.length}</strong></div><div className="bg-amber-50 dark:bg-amber-900/20 p-5 rounded-xl"><p className="text-sm text-gray-500">Trung bình/giao dịch</p><strong className="text-2xl text-amber-700">{money(report.average)}</strong></div></div>
      </section>
      <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"><h2 className="text-lg font-bold mb-2">Phân tích</h2><p className="text-gray-600 dark:text-gray-300 leading-7">{analysis}</p></section>
      <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"><div className="flex items-center justify-between gap-3 mb-4"><h2 className="text-lg font-bold">Danh mục</h2><button onClick={() => navigate('/all-transactions-report')} className="px-4 py-2 rounded-xl font-semibold bg-sky-700 text-white">Tất cả</button></div><div className="grid md:grid-cols-3 gap-4"><div className="bg-emerald-50 dark:bg-emerald-900/20 p-5 rounded-xl"><p className="text-sm text-gray-500">Tổng tiền thu</p><strong className="text-2xl text-emerald-700">{money(report.categoryIncome)}</strong></div><div className="bg-rose-50 dark:bg-rose-900/20 p-5 rounded-xl"><p className="text-sm text-gray-500">Tổng tiền chi</p><strong className="text-2xl text-rose-700">{money(report.categoryExpense)}</strong></div><div className="bg-sky-50 dark:bg-sky-900/20 p-5 rounded-xl"><p className="text-sm text-gray-500">Còn lại trong tài khoản</p><strong className={`text-2xl ${report.categoryIncome - report.categoryExpense >= 0 ? 'text-sky-700' : 'text-rose-700'}`}>{money(report.categoryIncome - report.categoryExpense)}</strong></div></div></section>
      <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-lg font-bold mb-6">Biểu đồ cột</h2>
        {report.chartData.length ? <div className="flex"><div className="w-10 h-72 flex flex-col justify-between text-[10px] text-gray-500 pr-1 text-right"><span>Triệu</span>{(() => { const axisMax = Math.ceil(Math.max(...report.chartData.flatMap(([, value]) => [value.income, value.expense]), 1) / 1000000) * 1000000 || 1000000; return Array.from({ length: 6 }, (_, index) => Math.round(axisMax * (5 - index) / 5)).map((tick) => <span key={tick}>{Math.round(tick / 1000000)}</span>); })()}</div><div className="h-72 flex-1 flex items-end gap-2 overflow-x-auto border-l border-b border-gray-300 dark:border-gray-600 px-2">
          {report.chartData.map(([label, values]) => {
            const max = Math.ceil(Math.max(...report.chartData.flatMap(([, value]) => [value.income, value.expense]), 1) / 1000000) * 1000000 || 1000000;
            const incomeHeight = Math.max(values.income ? 8 : 0, (values.income / max) * 220);
            const expenseHeight = Math.max(values.expense ? 8 : 0, (values.expense / max) * 220);
            return <div key={label} onClick={() => setSelectedChartLabel(selectedChartLabel === label ? null : label)} className="min-w-[70px] flex-1 h-full flex flex-col justify-end items-center gap-2 cursor-pointer" title={`${label}: Thu ${money(values.income)} - Chi ${money(values.expense)}`}>
              <div className="flex items-end gap-1 h-[220px]"><div className="w-7 rounded-t-lg bg-emerald-600 hover:bg-emerald-500 transition-all" style={{ height: `${incomeHeight}px` }} /><div className="w-7 rounded-t-lg bg-rose-600 hover:bg-rose-500 transition-all" style={{ height: `${expenseHeight}px` }} /></div>
              <span className="text-xs text-gray-500 pb-2">{period === 'day' ? `Ngày ${Number(label)}` : period === 'month' ? `Tháng ${Number(label)}` : label}</span>
            </div>;
          })}
        </div></div> : <p className="text-gray-500">Không có dữ liệu để vẽ biểu đồ.</p>}
      </section>
    </main>
  </div>;
};

export default Reports;

import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const parseDate = (value) => {
  if (!value) return null;
  if (String(value).includes('T')) return new Date(value);
  const parts = String(value).split(' ')[0].split(/[/-]/).map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return null;
  return parts[0] > 31 ? new Date(parts[0], parts[1] - 1, parts[2]) : new Date(parts[2], parts[1] - 1, parts[0]);
};

const AllTransactionsReport = ({ transactions = [] }) => {
  const navigate = useNavigate();
  const now = new Date();
  const [tab, setTab] = useState('current');
  const [selectedDate, setSelectedDate] = useState(now.toISOString().slice(0, 10));
  const [selectedYear, setSelectedYear] = useState(String(now.getFullYear()));
  const money = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

  const years = useMemo(() => [...new Set(transactions.map((item) => parseDate(item.date)?.getFullYear()).filter(Boolean))].sort((a, b) => b - a), [transactions]);
  const summarize = (items) => {
    const income = items.filter((item) => item.type === 'income').reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const expense = items.filter((item) => item.type === 'expense').reduce((sum, item) => sum + Number(item.amount || 0), 0);
    return { income, expense, balance: income - expense };
  };
  const matching = (year, month, day) => transactions.filter((item) => {
    const date = parseDate(item.date);
    return date && date.getFullYear() === year && (month === undefined || date.getMonth() === month) && (day === undefined || date.getDate() === day);
  });
  const formatDate = (value) => new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(`${value}T00:00:00`));

  return <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
    <header className="bg-sky-100 dark:bg-gray-800 p-5 flex items-center gap-4"><button onClick={() => navigate(-1)} className="text-3xl">‹</button><h1 className="text-xl font-bold">Tình hình thu chi</h1></header>
    <div className="bg-sky-100 dark:bg-gray-800 flex overflow-x-auto border-b border-sky-200 dark:border-gray-700">{[['current', 'Hiện tại'], ['month', 'Theo tháng'], ['year', 'Theo năm']].map(([value, label]) => <button key={value} onClick={() => setTab(value)} className={`px-6 py-4 font-semibold whitespace-nowrap ${tab === value ? 'text-sky-700 border-b-2 border-sky-600' : ''}`}>{label}</button>)}</div>
    <main className="max-w-3xl mx-auto p-4 space-y-3">
      {tab === 'current' && <><div className="bg-white dark:bg-gray-800 rounded-xl p-4 flex items-center justify-between"><span className="font-semibold">Ngày đang xem</span><input type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} className="px-3 py-2 rounded-lg border dark:bg-gray-900" /></div><Summary label={formatDate(selectedDate)} data={summarize(matching(Number(selectedDate.slice(0, 4)), Number(selectedDate.slice(5, 7)) - 1, Number(selectedDate.slice(8, 10))))} money={money} /><Summary label={`Tháng ${now.getMonth() + 1}`} data={summarize(matching(now.getFullYear(), now.getMonth()))} money={money} /><Summary label={`Năm ${now.getFullYear()}`} data={summarize(matching(now.getFullYear()))} money={money} /></>}
      {tab === 'month' && <><div className="bg-white dark:bg-gray-800 rounded-xl p-4 flex items-center justify-between"><span className="font-semibold">Năm xem</span><select value={selectedYear} onChange={(event) => setSelectedYear(event.target.value)} className="px-3 py-2 rounded-lg border dark:bg-gray-900">{years.map((year) => <option key={year}>{year}</option>)}</select></div><BarChart data={Array.from({ length: 12 }, (_, month) => ({ label: month + 1, ...summarize(matching(Number(selectedYear), month)) }))} money={money} /><Summary label={`Tháng ${now.getMonth() + 1}`} data={summarize(matching(Number(selectedYear), now.getMonth()))} money={money} /></>}
      {tab === 'year' && (years.length ? <><BarChart data={years.slice().sort((a, b) => a - b).map((year) => ({ label: year, ...summarize(matching(year)) }))} money={money} /><Summary label={`Năm ${now.getFullYear()}`} data={summarize(matching(now.getFullYear()))} money={money} /></> : <p className="text-gray-500">Chưa có dữ liệu.</p>)}
    </main>
  </div>;
};

const Summary = ({ label, data, money }) => <section className="bg-white dark:bg-gray-800 rounded-xl p-5"><div className="flex justify-between text-lg font-semibold"><span>{label}</span><span className="text-emerald-600">{money(data.income)}</span></div><div className="text-right text-lg text-rose-600 mt-3">{money(data.expense)}</div><div className={`text-right text-lg font-semibold mt-2 ${data.balance >= 0 ? 'text-gray-800 dark:text-gray-200' : 'text-rose-700'}`}>{money(data.balance)}</div></section>;

const BarChart = ({ data, money }) => {
  const max = Math.max(...data.flatMap((item) => [item.income, item.expense]), 1);
  const axisMax = Math.ceil(max / 1000000) * 1000000 || 1000000;
  const ticks = Array.from({ length: 6 }, (_, index) => Math.round(axisMax * index / 5));
  return <section className="bg-white dark:bg-gray-800 rounded-xl p-5"><div className="flex"><div className="w-10 h-72 flex flex-col justify-between text-[10px] text-gray-500 pr-1 text-right"><span>Triệu</span>{ticks.slice().reverse().map((tick) => <span key={tick}>{Math.round(tick / 1000000)}</span>)}</div><div className="h-72 flex-1 flex items-end gap-2 overflow-x-auto border-l border-b border-gray-300 dark:border-gray-600">{data.map((item) => {
    const incomeHeight = item.income ? Math.max(8, item.income / axisMax * 220) : 0;
    const expenseHeight = item.expense ? Math.max(8, item.expense / axisMax * 220) : 0;
    return <div key={item.label} className="min-w-[58px] flex-1 h-full flex flex-col justify-end items-center gap-2" title={`${item.label}: Thu ${money(item.income)} - Chi ${money(item.expense)}`}><div className="flex items-end gap-1 h-[220px]"><div className="w-5 rounded-t-md bg-emerald-600" style={{ height: `${incomeHeight}px` }} /><div className="w-5 rounded-t-md bg-rose-600" style={{ height: `${expenseHeight}px` }} /></div><span className="text-xs text-gray-500 pb-2">{item.label}</span></div>;
  })}</div></div><div className="flex justify-center gap-6 mt-4 text-sm"><span className="text-emerald-600">■ Thu</span><span className="text-rose-600">■ Chi</span></div></section>;
};

export default AllTransactionsReport;

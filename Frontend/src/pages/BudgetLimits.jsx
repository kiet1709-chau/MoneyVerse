import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DarkModeToggle from "../components/DarkModeToggle";

const STORAGE_KEY = "moneyverse_category_budgets";
const DEFAULT_CATEGORIES = ["Ăn uống", "Mua sắm", "Di chuyển", "Hóa đơn"];
const formatAmount = (value) => new Intl.NumberFormat("vi-VN").format(Number(value) || 0);

const readBudgets = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); } catch { return {}; }
};

const BudgetLimits = ({ darkMode, setDarkMode, transactions = [] }) => {
  const navigate = useNavigate();
  const [budgets, setBudgets] = useState(readBudgets);
  const [saved, setSaved] = useState(false);
  const categories = useMemo(() => Array.from(new Set([...DEFAULT_CATEGORIES, ...transactions.filter((item) => item.type === "expense").map((item) => item.category).filter(Boolean)])), [transactions]);
  const updateBudget = (category, value) => {
    setBudgets((current) => ({ ...current, [category]: Number(String(value).replace(/\D/g, "")) || 0 }));
    setSaved(false);
  };
  const save = () => { localStorage.setItem(STORAGE_KEY, JSON.stringify(budgets)); setSaved(true); };

  return <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
    <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 p-4 sticky top-0 z-30 flex justify-between items-center">
      <div className="flex items-center gap-3"><button type="button" onClick={() => navigate("/spending-statistics")} className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium">← Quay lại thống kê</button><h1 className="text-xl font-bold border-l border-gray-300 dark:border-gray-600 pl-3">Đặt hạn mức</h1></div>
      <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
    </header>
    <main className="max-w-3xl mx-auto p-6 md:p-8 space-y-6">
      <section className="bg-sky-800 text-white rounded-3xl p-6 shadow-xl"><p className="text-sm uppercase tracking-[0.2em] text-sky-100">Ngân sách theo hạng mục</p><h2 className="text-2xl font-bold mt-2">Thiết lập hạn mức chi tiêu hàng tháng</h2><p className="mt-2 text-sky-100">Giao dịch vẫn được ghi nhận khi chưa đặt hoặc vượt hạn mức; trang thống kê sẽ hiển thị cảnh báo.</p></section>
      <section className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm"><div className="space-y-4">{categories.map((category) => <label key={category} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-xl bg-gray-50 dark:bg-gray-900/50 p-4"><span className="font-semibold">{category}</span><div className="flex items-center gap-2"><input type="text" inputMode="numeric" value={budgets[category] ? formatAmount(budgets[category]) : ""} onChange={(event) => updateBudget(category, event.target.value)} placeholder="Chưa đặt hạn mức" className="w-48 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-right" /><span className="text-sm text-gray-500">đ</span></div></label>)}</div>{saved && <p className="mt-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-300">Đã lưu hạn mức theo từng hạng mục.</p>}<button type="button" onClick={save} className="mt-6 w-full rounded-xl bg-sky-700 hover:bg-sky-800 py-3 font-bold text-white transition-colors">Lưu hạn mức</button></section>
    </main>
  </div>;
};

export default BudgetLimits;

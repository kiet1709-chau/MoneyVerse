import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DarkModeToggle from '../components/DarkModeToggle';

const AddTransaction = ({ darkMode, setDarkMode, balance, setBalance, setTransactions }) => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const presetCategories = { food: 'Ăn uống', shopping: 'Mua sắm' };
  const presetCategory = presetCategories[query.get('category')];
  const isExpense = query.get('type') === 'expense';
  const isPresetExpense = isExpense && Boolean(presetCategory);
  const [type, setType] = useState(isExpense ? 'expense' : 'income');
  const [category, setCategory] = useState(presetCategory || (isExpense ? 'Ăn uống' : 'Thu nhập'));
  const [customCategory, setCustomCategory] = useState('');
  const [note, setNote] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

  const handleSubmit = (event) => {
    event.preventDefault();
    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError('Vui lòng nhập số tiền lớn hơn 0.');
      return;
    }
    if (numericAmount >= 1000000000) {
      setError('Số tiền phải nhỏ hơn 1.000.000.000 VNĐ.');
      return;
    }
    if (type === 'expense' && numericAmount > balance) {
      setError('Số dư hiện tại không đủ cho khoản chi này.');
      return;
    }

    const transactionCategory = category === 'other' ? customCategory.trim() : category;
    if (!transactionCategory) {
      setError('Vui lòng nhập tên danh mục cho khoản chi này.');
      return;
    }

    const transaction = {
      id: `TX${Date.now()}`,
      name: note.trim(),
      category: transactionCategory,
      amount: numericAmount,
      type,
      date: new Date().toLocaleString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
      }).replace(',', ''),
      status: 'success',
      icon: type === 'income' ? '💰' : '🛍️',
    };

    setTransactions((current) => [transaction, ...(current || [])]);
    setBalance((current) => type === 'income' ? current + numericAmount : current - numericAmount);
    navigate(`/${query.get('returnTo') === 'spending-statistics' ? 'spending-statistics' : 'dashboard'}`);
  };

  const inputClass = 'w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all';

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-4 md:p-8 transition-colors duration-300 font-sans">
      <header className="max-w-2xl mx-auto flex items-center justify-between mb-8">
        <button type="button" onClick={() => navigate('/dashboard')} className="text-sm font-semibold text-purple-600 dark:text-purple-400 hover:underline">← Về trang chủ</button>
        <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
      </header>

      <main className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 sm:p-8">
        <div className="mb-7">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{isPresetExpense ? `Chi tiêu ${presetCategory.toLowerCase()}` : 'Thêm giao dịch'}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Ghi nhận khoản thu hoặc khoản chi để cập nhật số dư của bạn.</p>
        </div>

        <div className="rounded-2xl bg-purple-50 dark:bg-purple-900/20 p-4 mb-6 flex justify-between items-center">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Số dư hiện tại</span>
          <strong className="text-purple-700 dark:text-purple-300">{formatCurrency(balance)}</strong>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Loại giao dịch</label>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => { setType('income'); setCategory('Thu nhập'); setCustomCategory(''); setError(''); }} className={`p-4 rounded-xl border font-semibold transition-colors ${type === 'income' ? 'bg-green-50 border-green-500 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'}`}>+ Thu nhập</button>
              <button type="button" onClick={() => { setType('expense'); setCategory('Ăn uống'); setCustomCategory(''); setError(''); }} className={`p-4 rounded-xl border font-semibold transition-colors ${type === 'expense' ? 'bg-red-50 border-red-500 text-red-700 dark:bg-red-900/30 dark:text-red-300' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'}`}>− Chi tiêu</button>
            </div>
          </div>

          <div>
            <label htmlFor="transaction-category" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Hạng mục</label>
            <select id="transaction-category" value={category} onChange={(event) => { setCategory(event.target.value); setError(''); }} className={inputClass}>
              {type === 'income' ? (
                <>
                  <option value="Thu nhập">Thu nhập</option>
                  <option value="Lương">Lương</option>
                  <option value="Thưởng">Thưởng</option>
                  <option value="Khác">Khác</option>
                </>
              ) : (
                <>
                  <option value="Ăn uống">Ăn uống</option>
                  <option value="Mua sắm">Mua sắm</option>
                  <option value="Di chuyển">Di chuyển</option>
                  <option value="Hóa đơn">Hóa đơn</option>
                  <option value="other">Danh mục khác...</option>
                </>
              )}
            </select>
            {type === 'expense' && category === 'other' && (
              <input
                id="custom-transaction-category"
                type="text"
                required
                value={customCategory}
                onChange={(event) => { setCustomCategory(event.target.value); setError(''); }}
                placeholder="Ví dụ: Sức khỏe, Quà tặng..."
                className={`${inputClass} mt-3`}
              />
            )}
          </div>

          <div>
            <label htmlFor="transaction-note" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Ghi chú</label>
            <input id="transaction-note" type="text" required value={note} onChange={(event) => setNote(event.target.value)} placeholder={type === 'income' ? 'Ví dụ: Tiền lương tháng 7' : category === 'Ăn uống' ? 'Ví dụ: Ăn trưa' : 'Ví dụ: Mua quần áo'} className={inputClass} />
          </div>

          <div>
            <label htmlFor="transaction-amount" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Số tiền (VNĐ)</label>
            <input id="transaction-amount" type="number" required min="1" max="999999999" step="1" value={amount} onChange={(event) => { setAmount(event.target.value); setError(''); }} placeholder="Ví dụ: 5000000" className={inputClass} />
          </div>

          {error && <p className="rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800/50 p-3 text-sm text-red-600 dark:text-red-400">{error}</p>}

          <button type="submit" className={`w-full font-bold py-3.5 rounded-xl text-white transition-all shadow-lg ${type === 'income' ? 'bg-green-600 hover:bg-green-700 shadow-green-500/20' : 'bg-red-600 hover:bg-red-700 shadow-red-500/20'}`}>
            {type === 'income' ? 'Thêm khoản thu' : 'Thêm khoản chi'}
          </button>
        </form>
      </main>
    </div>
  );
};

export default AddTransaction;

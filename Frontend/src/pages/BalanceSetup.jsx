import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MAX_BALANCE = 1000000000;
const BalanceSetup = ({ setBalance }) => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const submit = (e) => {
    e.preventDefault(); const value = Number(amount);
    if (!Number.isFinite(value) || value < 0) return setError('Vui lòng nhập số tiền hợp lệ.');
    if (value > MAX_BALANCE) return setError('Số dư không được vượt quá 1.000.000.000 VNĐ.');
    localStorage.setItem('moneyverse_balance', String(value));
    setBalance(value);
    navigate('/dashboard');
  };
  return <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center p-4"><div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-3xl p-8 shadow-xl"><div className="w-14 h-14 rounded-2xl bg-sky-700 text-white flex items-center justify-center text-2xl font-bold mb-5">M</div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">Thiết lập số dư khả dụng</h1><p className="text-gray-500 dark:text-gray-400 mt-2 mb-6">Nhập số tiền hiện có để bắt đầu quản lý tài chính.</p><form onSubmit={submit} className="space-y-4"><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Số tiền ban đầu (VNĐ)<input type="number" min="0" max={MAX_BALANCE} required value={amount} onChange={(e) => { setAmount(e.target.value); setError(''); }} className="mt-2 w-full px-4 py-3 rounded-xl border bg-gray-50 dark:bg-gray-900" /></label><p className="text-xs text-gray-500">Tối đa 1.000.000.000 VNĐ</p>{error && <p className="text-sm text-red-600">{error}</p>}<button className="w-full py-3 rounded-xl bg-sky-700 text-white font-bold">Lưu số dư và tiếp tục</button></form></div></div>;
};
export default BalanceSetup;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DarkModeToggle from '../components/DarkModeToggle';

const Bills = ({ darkMode, setDarkMode, balance, setBalance, bills, setBills, transactions, setTransactions }) => {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'pending' | 'paid'
  const [selectedBill, setSelectedBill] = useState(null);
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  const filteredBills = (bills || []).filter((bill) => {
    if (filterStatus === 'all') return true;
    return bill.status === filterStatus;
  });

  const pendingBills = (bills || []).filter((b) => b.status === 'pending');
  const paidBills = (bills || []).filter((b) => b.status === 'paid');
  const totalPending = pendingBills.reduce((sum, b) => sum + Number(b.amount || 0), 0);
  const totalPaid = paidBills.reduce((sum, b) => sum + Number(b.amount || 0), 0);

  const handlePayBill = (bill) => {
    if (balance < bill.amount) {
      setMessage('Số dư không đủ để thanh toán hóa đơn này.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setBalance((prev) => prev - bill.amount);

      const currentDate = new Date().toLocaleDateString('vi-VN');
      setBills((prev) =>
        prev.map((b) =>
          b.id === bill.id ? { ...b, status: 'paid', date: currentDate } : b
        )
      );

      const newTx = {
        id: `BILL${Date.now().toString().slice(-4)}`,
        name: `Thanh toán ${bill.name}`,
        amount: bill.amount,
        type: 'expense',
        category: bill.provider || 'Hóa đơn',
        date: new Date()
          .toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })
          .replace(',', ''),
        status: 'success',
        icon: bill.name.includes('học') ? '🎓' : bill.name.includes('điện') ? '⚡' : '🌐',
      };

      setTransactions((prev) => [newTx, ...prev]);
      setMessage(`Đã thanh toán thành công ${formatCurrency(bill.amount)} cho ${bill.name}`);
      setSelectedBill(null);
      setIsProcessing(false);
      setTimeout(() => setMessage(''), 3000);
    }, 1500);
  };

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
            Hóa đơn
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
        <section className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-3xl p-6 md:p-8 text-white shadow-xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-white/80">Quản lý hóa đơn</p>
              <h2 className="text-2xl md:text-3xl font-bold mt-2">Theo dõi và thanh toán hóa đơn dễ dàng</h2>
              <p className="text-white/90 mt-3">Xem tất cả hóa đơn của bạn và thanh toán trực tiếp từ ví.</p>
            </div>
            <div className="hidden md:flex items-center justify-center w-16 h-16 rounded-2xl bg-white/15 text-3xl">🧾</div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Chờ thanh toán</p>
                <h3 className="text-2xl font-bold text-red-600 dark:text-red-400 mt-2">{pendingBills.length} mục</h3>
                <p className="text-sm text-gray-500 mt-1">{formatCurrency(totalPending)}</p>
              </div>
              <div className="w-12 h-12 bg-red-50 dark:bg-red-950/30 rounded-xl flex items-center justify-center text-red-600 dark:text-red-400 text-xl">⏳</div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Đã thanh toán</p>
                <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">{paidBills.length} mục</h3>
                <p className="text-sm text-gray-500 mt-1">{formatCurrency(totalPaid)}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-xl">✅</div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Số dư khả dụng</p>
                <h3 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">{formatCurrency(balance)}</h3>
                <p className="text-sm text-gray-500 mt-1">Để thanh toán</p>
              </div>
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-xl">💳</div>
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-lg text-gray-800 dark:text-white">Danh sách hóa đơn</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  filterStatus === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setFilterStatus('pending')}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  filterStatus === 'pending'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
                }`}
              >
                Chờ thanh toán
              </button>
              <button
                onClick={() => setFilterStatus('paid')}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  filterStatus === 'paid'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
                }`}
              >
                Đã thanh toán
              </button>
            </div>
          </div>

          {message && (
            <div className={`rounded-xl px-4 py-3 text-sm mb-4 ${message.includes('thành công') ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
              {message}
            </div>
          )}

          {filteredBills.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-5xl">📁</span>
              <p className="text-gray-500 dark:text-gray-400 mt-4 font-medium">Không có hóa đơn nào</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredBills.map((bill) => (
                <div
                  key={bill.id}
                  className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${bill.status === 'paid' ? 'bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600' : 'bg-orange-100 dark:bg-orange-950/30 text-orange-600'}`}>
                      {bill.name.includes('học') ? '🎓' : bill.name.includes('điện') ? '⚡' : '🌐'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-200">{bill.name}</p>
                      <p className="text-sm text-gray-500">
                        {bill.provider} • Hạn: {bill.dueDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-bold text-gray-800 dark:text-gray-200">{formatCurrency(bill.amount)}</p>
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          bill.status === 'paid'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}
                      >
                        {bill.status === 'paid' ? 'Đã thanh toán' : 'Chờ thanh toán'}
                      </span>
                    </div>

                    {bill.status === 'pending' && (
                      <button
                        onClick={() => setSelectedBill(bill)}
                        className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors"
                      >
                        Thanh toán
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {selectedBill && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-950/30 text-orange-600 flex items-center justify-center text-3xl mx-auto mb-4">
                {selectedBill.name.includes('học') ? '🎓' : selectedBill.name.includes('điện') ? '⚡' : '🌐'}
              </div>
              <h3 className="font-bold text-lg text-gray-800 dark:text-white">{selectedBill.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{selectedBill.provider}</p>
            </div>

            <div className="space-y-2 bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Số tiền</span>
                <span className="font-bold text-gray-800 dark:text-gray-200">{formatCurrency(selectedBill.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Hạn thanh toán</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">{selectedBill.dueDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Số dư</span>
                <span className={`font-bold ${balance >= selectedBill.amount ? 'text-emerald-600' : 'text-red-600'}`}>
                  {formatCurrency(balance)}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedBill(null)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => handlePayBill(selectedBill)}
                disabled={isProcessing || balance < selectedBill.amount}
                className="flex-1 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold transition-colors"
              >
                {isProcessing ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bills;

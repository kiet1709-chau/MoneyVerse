import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DarkModeToggle from '../components/DarkModeToggle';

const WalletTopUp = ({ darkMode, setDarkMode, balance, setBalance, transactions, setTransactions }) => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('100000');
  const [method, setMethod] = useState('bank');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const formatCurrency = (value) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

  const presetAmounts = [50000, 100000, 200000, 500000, 1000000];

  // Xóa message sau 5 giây
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleTopUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const numericAmount = Number(amount);

      if (!numericAmount || numericAmount < 10000) {
        setMessage('Vui lòng nhập số tiền tối thiểu 10.000 ₫.');
        setMessageType('error');
        setIsLoading(false);
        return;
      }

      if (numericAmount > 100000000) {
        setMessage('Số tiền nạp không được vượt quá 100.000.000 ₫.');
        setMessageType('error');
        setIsLoading(false);
        return;
      }

      // Giả lập xử lý (delay 1.5 giây)
      await new Promise(resolve => setTimeout(resolve, 1500));

      setBalance((prev) => prev + numericAmount);
      const newTx = {
        id: `WAL${Date.now().toString().slice(-4)}`,
        name: 'Nạp tiền vào ví',
        amount: numericAmount,
        type: 'income',
        category: 'Nạp ví',
        date: new Date().toLocaleString('vi-VN', { 
          day: '2-digit', 
          month: '2-digit', 
          year: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit' 
        }).replace(',', ''),
        status: 'success',
        icon: '💳',
      };

      setTransactions((prev) => [newTx, ...prev]);
      
      const methodName = method === 'bank' ? 'Chuyển khoản ngân hàng' : 
                         method === 'card' ? 'Thẻ tín dụng' : 'Ví điện tử';
      
      setMessage(`✓ Nạp tiền thành công ${formatCurrency(numericAmount)} bằng ${methodName}. Mã: ${newTx.id}`);
      setMessageType('success');
      setAmount('100000');
    } catch {
      setMessage('Nạp tiền thất bại. Vui lòng thử lại.');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
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
            Nạp tiền ví
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
          <div className="bg-gradient-to-r from-blue-400 to-indigo-500 w-10 h-10 rounded-full shadow-md border-2 border-white dark:border-gray-800 flex items-center justify-center font-bold text-white text-sm">
            AD
          </div>
        </div>
      </header>

      <main className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
        <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-6 md:p-8 text-white shadow-xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-white/80">Nạp tiền nhanh</p>
              <h2 className="text-2xl md:text-3xl font-bold mt-2">Bổ sung số dư vào ví MoneyVerse</h2>
              <p className="text-white/90 mt-3">Chọn phương thức thanh toán và nhập số tiền mong muốn.</p>
            </div>
            <div className="hidden md:flex items-center justify-center w-16 h-16 rounded-2xl bg-white/15 text-3xl">💸</div>
          </div>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] gap-6">
          <form onSubmit={handleTopUp} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Phương thức thanh toán</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { value: 'bank', label: 'Ngân hàng', icon: '🏦' },
                  { value: 'card', label: 'Thẻ', icon: '💳' },
                  { value: 'wallet', label: 'Ví điện tử', icon: '📲' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setMethod(option.value)}
                    className={`px-3 py-3 rounded-xl border text-sm font-semibold transition-colors ${method === option.value ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                  >
                    <span className="mr-2">{option.icon}</span>{option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Số tiền nạp</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {presetAmounts.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setAmount(String(value))}
                    className={`px-3 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${String(amount) === String(value) ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                  >
                    {formatCurrency(value)}
                  </button>
                ))}
              </div>
              <input
                type="number"
                min="10000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full mt-3 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Nhập số tiền khác"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang xử lý...</span>
                </>
              ) : (
                'Xác nhận nạp tiền'
              )}
            </button>

            {message && (
              <div className={`rounded-xl px-4 py-3 text-sm animate-fade-in ${
                messageType === 'success'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800'
              }`}>
                {message}
              </div>
            )}
          </form>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-4">Thông tin ví</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Số dư hiện tại</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{formatCurrency(balance)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Phương thức</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {method === 'bank' ? 'Ngân hàng' : method === 'card' ? 'Thẻ' : 'Ví điện tử'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Số tiền nạp</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{formatCurrency(Number(amount || 0))}</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl p-6 text-white shadow-sm">
              <h3 className="font-bold text-lg">Lưu ý</h3>
              <ul className="mt-3 space-y-2 text-sm text-white/90">
                <li>• Nạp tiền vào ví sẽ ngay lập tức tăng số dư.</li>
                <li>• Giao dịch sẽ xuất hiện trong lịch sử giao dịch.</li>
                <li>• Hỗ trợ nhiều phương thức thanh toán an toàn.</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default WalletTopUp;

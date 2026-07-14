import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DarkModeToggle from '../components/DarkModeToggle';

const TravelBooking = ({ darkMode, setDarkMode, balance, setBalance, transactions, setTransactions }) => {
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [numPeople, setNumPeople] = useState(1);
  const [message, setMessage] = useState('');

  const packages = [
    { id: 1, name: 'Du lịch Hà Nội 3 ngày', price: 5000000, duration: '3 ngày 2 đêm', destination: 'Hà Nội', people: 'Tối đa 20 người', icon: '🏯' },
    { id: 2, name: 'Đà Nẵng - Hội An 4 ngày', price: 8000000, duration: '4 ngày 3 đêm', destination: 'Đà Nẵng', people: 'Tối đa 25 người', icon: '🏖️' },
    { id: 3, name: 'Sa Pa - Fansipan 5 ngày', price: 6500000, duration: '5 ngày 4 đêm', destination: 'Sa Pa', people: 'Tối đa 15 người', icon: '⛰️' },
    { id: 4, name: 'Phú Quốc - Thiên Đường Biển', price: 9500000, duration: '4 ngày 3 đêm', destination: 'Phú Quốc', people: 'Tối đa 30 người', icon: '🏝️' },
  ];

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  const handleBooking = () => {
    if (!selectedPackage || numPeople < 1) {
      setMessage('Vui lòng chọn gói tour và số người.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    const totalPrice = selectedPackage.price * numPeople;
    if (balance < totalPrice) {
      setMessage('Số dư không đủ để đặt tour.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setBalance((prev) => prev - totalPrice);
    const newTx = {
      id: `TRAVEL${Date.now().toString().slice(-4)}`,
      name: `Tour du lịch: ${selectedPackage.name}`,
      amount: totalPrice,
      type: 'expense',
      category: 'Du lịch',
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
      icon: '✈️',
    };

    setTransactions((prev) => [newTx, ...prev]);
    setMessage(`Đặt tour thành công! ${numPeople} người cho ${selectedPackage.name} - ${formatCurrency(totalPrice)}`);
    setSelectedPackage(null);
    setNumPeople(1);
    setTimeout(() => setMessage(''), 3000);
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
            Du lịch
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
        <section className="bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 rounded-3xl p-6 md:p-8 text-white shadow-xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-white/80">Khám phá thế giới</p>
              <h2 className="text-2xl md:text-3xl font-bold mt-2">Gói tour du lịch hấp dẫn</h2>
              <p className="text-white/90 mt-3">Chọn gói tour yêu thích, quyết định số người, và đặt chuyến du lịch của bạn.</p>
            </div>
            <div className="hidden md:flex items-center justify-center w-16 h-16 rounded-2xl bg-white/15 text-3xl">✈️</div>
          </div>
        </section>

        {message && (
          <div className={`rounded-xl px-4 py-3 text-sm ${message.includes('thành công') ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
            {message}
          </div>
        )}

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {packages.map((pkg) => (
            <button
              key={pkg.id}
              onClick={() => setSelectedPackage(pkg)}
              className={`p-6 rounded-2xl border-2 transition-all text-left ${
                selectedPackage?.id === pkg.id
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/30'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="text-4xl">{pkg.icon}</div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">{pkg.duration}</span>
              </div>
              <h3 className="font-bold text-lg text-gray-800 dark:text-white">{pkg.name}</h3>
              <div className="space-y-2 mt-3 text-sm text-gray-600 dark:text-gray-300">
                <p>📍 {pkg.destination}</p>
                <p>👥 {pkg.people}</p>
              </div>
              <p className="font-bold text-blue-600 dark:text-blue-400 mt-4 text-lg">{formatCurrency(pkg.price)}/người</p>
            </button>
          ))}
        </section>

        {selectedPackage && (
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
            <div>
              <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-4">Chọn số người tham gia</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setNumPeople(Math.max(1, numPeople - 1))}
                  className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  −
                </button>
                <span className="text-3xl font-bold text-gray-800 dark:text-white min-w-16 text-center">{numPeople}</span>
                <button
                  onClick={() => setNumPeople(numPeople + 1)}
                  className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  +
                </button>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Tour</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">{selectedPackage.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Thời hạn</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">{selectedPackage.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Số người</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">{numPeople} người</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Giá/người</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">{formatCurrency(selectedPackage.price)}</span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2 flex justify-between">
                <span className="font-bold text-gray-800 dark:text-white">Tổng cộng</span>
                <span className="font-bold text-blue-600 dark:text-blue-400 text-xl">{formatCurrency(selectedPackage.price * numPeople)}</span>
              </div>
            </div>

            <button
              onClick={handleBooking}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
            >
              Đặt tour du lịch
            </button>
          </section>
        )}
      </main>
    </div>
  );
};

export default TravelBooking;

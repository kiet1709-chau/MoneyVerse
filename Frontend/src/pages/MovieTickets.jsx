import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DarkModeToggle from '../components/DarkModeToggle';

const MovieTickets = ({ darkMode, setDarkMode, balance, setBalance, transactions, setTransactions }) => {
  const navigate = useNavigate();
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [message, setMessage] = useState('');

  const movies = [
    { id: 1, title: 'Aquaman 3: Vương Quốc Dưới Đáy', price: 120000, time: '19:30', date: '15/07/2026', seats: 'Còn 45 chỗ', image: '🌊' },
    { id: 2, title: 'Inside Out 2', price: 110000, time: '14:00', date: '14/07/2026', seats: 'Còn 12 chỗ', image: '😊' },
    { id: 3, title: 'Deadpool & Wolverine', price: 130000, time: '21:00', date: '16/07/2026', seats: 'Còn 78 chỗ', image: '🔴' },
    { id: 4, title: 'Twisters', price: 115000, time: '17:15', date: '14/07/2026', seats: 'Còn 33 chỗ', image: '🌪️' },
  ];

  const seatOptions = Array.from({ length: 12 }, (_, i) => i + 1);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  const handleSelectSeat = (seat) => {
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  const handleBooking = () => {
    if (!selectedMovie || selectedSeats.length === 0) {
      setMessage('Vui lòng chọn phim và ghế ngồi.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    const totalPrice = selectedMovie.price * selectedSeats.length;
    if (balance < totalPrice) {
      setMessage('Số dư không đủ để đặt vé.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setBalance((prev) => prev - totalPrice);
    const newTx = {
      id: `MOVIE${Date.now().toString().slice(-4)}`,
      name: `Vé phim: ${selectedMovie.title}`,
      amount: totalPrice,
      type: 'expense',
      category: 'Giải trí',
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
      icon: '🎬',
    };

    setTransactions((prev) => [newTx, ...prev]);
    setMessage(`Đặt vé thành công! ${selectedSeats.length} vé cho ${selectedMovie.title} - ${formatCurrency(totalPrice)}`);
    setSelectedMovie(null);
    setSelectedSeats([]);
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
            Đặt vé phim
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
        <section className="bg-gradient-to-r from-red-500 via-purple-500 to-pink-500 rounded-3xl p-6 md:p-8 text-white shadow-xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-white/80">Giải trí tại nhà hát</p>
              <h2 className="text-2xl md:text-3xl font-bold mt-2">Đặt vé xem phim dễ dàng</h2>
              <p className="text-white/90 mt-3">Chọn phim yêu thích, chọn ghế và thanh toán nhanh chóng.</p>
            </div>
            <div className="hidden md:flex items-center justify-center w-16 h-16 rounded-2xl bg-white/15 text-3xl">🎬</div>
          </div>
        </section>

        {message && (
          <div className={`rounded-xl px-4 py-3 text-sm ${message.includes('thành công') ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
            {message}
          </div>
        )}

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {movies.map((movie) => (
            <button
              key={movie.id}
              onClick={() => setSelectedMovie(movie)}
              className={`p-4 rounded-2xl border-2 transition-all text-left ${
                selectedMovie?.id === movie.id
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/30'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-indigo-300'
              }`}
            >
              <div className="text-4xl mb-2">{movie.image}</div>
              <h3 className="font-bold text-sm text-gray-800 dark:text-white line-clamp-2">{movie.title}</h3>
              <p className="text-xs text-gray-500 mt-2">🕐 {movie.time} • {movie.date}</p>
              <p className="text-xs text-gray-500 mt-1">{movie.seats}</p>
              <p className="font-bold text-indigo-600 dark:text-indigo-400 mt-2">{formatCurrency(movie.price)}/vé</p>
            </button>
          ))}
        </section>

        {selectedMovie && (
          <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
            <div>
              <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-4">Chọn ghế ngồi</h3>
              <div className="grid grid-cols-6 gap-2">
                {seatOptions.map((seat) => (
                  <button
                    key={seat}
                    onClick={() => handleSelectSeat(seat)}
                    className={`p-3 rounded-lg font-semibold transition-colors ${
                      selectedSeats.includes(seat)
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {seat}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Phim</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">{selectedMovie.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Ghế</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">{selectedSeats.join(', ') || 'Chưa chọn'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Số lượng</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">{selectedSeats.length} vé</span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2 flex justify-between">
                <span className="font-bold text-gray-800 dark:text-white">Tổng cộng</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{formatCurrency(selectedMovie.price * selectedSeats.length)}</span>
              </div>
            </div>

            <button
              onClick={handleBooking}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors"
            >
              Thanh toán và đặt vé
            </button>
          </section>
        )}
      </main>
    </div>
  );
};

export default MovieTickets;

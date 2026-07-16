import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DarkModeToggle from '../components/DarkModeToggle';

const SavingsGoals = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [goals, setGoals] = useState([
    { id: 1, name: 'Du lịch Nhật Bản', target: 50000000, current: 15000000, icon: '✈️', color: 'bg-sky-600' },
    { id: 2, name: 'Mua laptop mới', target: 30000000, current: 8500000, icon: '💻', color: 'bg-blue-800' },
    { id: 3, name: 'Quỹ khẩn cấp', target: 20000000, current: 12000000, icon: '🆘', color: 'bg-red-600' },
  ]);

  const [newGoal, setNewGoal] = useState({
    name: '',
    target: '',
    current: '',
    icon: '🎯',
  });

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!newGoal.name || !newGoal.target) return;

    const goal = {
      id: Date.now(),
      name: newGoal.name,
      target: Number(newGoal.target),
      current: Number(newGoal.current || 0),
      icon: newGoal.icon,
      color: 'bg-sky-600',
    };

    setGoals((prev) => [goal, ...prev]);
    setNewGoal({ name: '', target: '', current: '', icon: '🎯' });
    setShowAddGoal(false);
  };

  const handleDeleteGoal = (id) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const handleUpdateGoal = (id, newCurrent) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, current: Math.min(newCurrent, g.target) } : g))
    );
  };

  const totalTarget = goals.reduce((sum, g) => sum + g.target, 0);
  const totalSaved = goals.reduce((sum, g) => sum + g.current, 0);
  const totalProgress = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300 font-sans">
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 p-4 sticky top-0 z-30 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-1 font-medium"
          >
            ← <span className="hidden sm:inline">Quay lại Trang chủ</span>
          </button>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white border-l pl-3 border-gray-300 dark:border-gray-600">
            Heo tiết kiệm
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
        <section className="bg-sky-700 rounded-3xl p-6 md:p-8 text-white shadow-xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-white/80">Quản lý mục tiêu tiết kiệm</p>
              <h2 className="text-2xl md:text-3xl font-bold mt-2">Heo tiết kiệm của bạn</h2>
              <p className="text-white/90 mt-3">Đặt mục tiêu tiết kiệm và theo dõi tiến độ từng ngày.</p>
            </div>
            <div className="hidden md:flex items-center justify-center w-16 h-16 rounded-2xl bg-white/15 text-3xl">🐷</div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Tổng mục tiêu</p>
                <h3 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">{formatCurrency(totalTarget)}</h3>
              </div>
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-xl">🎯</div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Đã tiết kiệm</p>
                <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">{formatCurrency(totalSaved)}</h3>
              </div>
              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-xl">💚</div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Tiến độ chung</p>
                <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">{totalProgress}%</h3>
                <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700 mt-2">
                  <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" style={{ width: `${totalProgress}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="flex justify-between items-center">
          <h2 className="font-bold text-lg text-gray-800 dark:text-white">Mục tiêu tiết kiệm</h2>
          <button
            onClick={() => setShowAddGoal(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors flex items-center gap-2"
          >
            + Thêm mục tiêu
          </button>
        </section>

        {goals.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center">
            <span className="text-5xl">🐷</span>
            <p className="text-gray-500 dark:text-gray-400 mt-4 font-medium">Chưa có mục tiêu tiết kiệm nào. Hãy thêm mục tiêu đầu tiên!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {goals.map((goal) => {
              const progress = Math.round((goal.current / goal.target) * 100);
              const remaining = goal.target - goal.current;

              return (
                <div key={goal.id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full ${goal.color} flex items-center justify-center text-2xl`}>
                        {goal.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-800 dark:text-white">{goal.name}</h3>
                        <p className="text-sm text-gray-500">{progress}% hoàn thành</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors font-bold text-xl"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">Đã tiết kiệm</span>
                      <span className="font-semibold text-gray-800 dark:text-gray-200">{formatCurrency(goal.current)}</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                      <div className={`h-full ${goal.color}`} style={{ width: `${progress}%` }}></div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">Mục tiêu: {formatCurrency(goal.target)}</span>
                      <span className="text-gray-600 dark:text-gray-300">Còn: {formatCurrency(remaining)}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="0"
                      max={goal.target}
                      value={goal.current}
                      onChange={(e) => handleUpdateGoal(goal.id, Number(e.target.value))}
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      onClick={() => handleUpdateGoal(goal.id, goal.current + 1000000)}
                      className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors"
                    >
                      +1M
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {showAddGoal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Thêm mục tiêu tiết kiệm</h2>

            <form onSubmit={handleAddGoal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Tên mục tiêu</label>
                <input
                  type="text"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="VD: Du lịch Thái Lan"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Mục tiêu (VND)</label>
                <input
                  type="number"
                  min="0"
                  value={newGoal.target}
                  onChange={(e) => setNewGoal((prev) => ({ ...prev, target: e.target.value }))}
                  placeholder="10000000"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Hiện tại có (VND)</label>
                <input
                  type="number"
                  min="0"
                  value={newGoal.current}
                  onChange={(e) => setNewGoal((prev) => ({ ...prev, current: e.target.value }))}
                  placeholder="0"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Biểu tượng</label>
                <div className="grid grid-cols-5 gap-2">
                  {['🎯', '✈️', '💻', '🏠', '📚', '🚗', '💍', '🎮'].map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setNewGoal((prev) => ({ ...prev, icon }))}
                      className={`py-2 rounded-lg text-2xl transition-colors ${newGoal.icon === icon ? 'bg-indigo-600' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddGoal(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors"
                >
                  Thêm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavingsGoals;

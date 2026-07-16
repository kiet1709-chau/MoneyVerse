import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';

const SidebarLayout = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Trang chủ', icon: '💳', path: '/dashboard' },
    { name: 'Lịch sử giao dịch', icon: '📋', path: '/transaction-history' },
    { name: 'Thống kê chi tiêu', icon: '📊', path: '/spending-statistics' },
    { name: 'Heo tiết kiệm', icon: '🐷', path: '/savings-goals' },
    { name: 'Cài đặt bảo mật', icon: '🛡️', path: '/security-settings' },
  ];

  const sidebarLinkClass = ({ isActive }) =>
    `w-full flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-all text-left ${
      isActive
        ? 'bg-purple-50 dark:bg-gray-700 text-purple-600 dark:text-purple-400'
        : 'text-gray-600 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-700 hover:text-purple-600 dark:hover:text-purple-400'
    }`;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-200 flex transition-colors duration-300 font-sans">
      <aside className="fixed top-0 left-0 z-50 bg-white dark:bg-gray-800 w-64 h-screen shadow-md border-r border-gray-200 dark:border-gray-700 flex flex-col justify-between p-4 lg:translate-x-0">
        <div>
          <div className="flex items-center gap-3 mb-8 px-2 mt-2">
            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg">
              M
            </div>
            <span className="font-bold text-2xl dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
              MoneyVerse
            </span>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <NavLink key={item.name} to={item.path} className={sidebarLinkClass}>
                <span className="text-xl">{item.icon}</span>
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
          <div className="hidden flex items-center justify-between px-2 py-2">
            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Chế độ tối</span>
            <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
          </div>
          <button
            onClick={() => navigate('/profile')}
            className="hidden w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 font-semibold text-sm transition-all text-left"
          >
            <span className="text-xl">👤</span>
            <span>Tài khoản cá nhân</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 lg:ml-64 w-full min-h-screen">
        <main className="min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SidebarLayout;

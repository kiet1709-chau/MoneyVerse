import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DarkModeToggle from '../components/DarkModeToggle';

const Settings = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('moneyverse_settings');
    return saved ? JSON.parse(saved) : {
      language: 'vi',
      fontSize: 'normal',
      notifications: {
        email: true,
        push: false,
        sms: false,
        transactionAlerts: true,
        billReminders: true,
        promotions: false,
      },
      privacy: {
        profileVisibility: 'private',
        showBalance: true,
        showTransactionHistory: false,
      },
      security: {
        autoLockout: 15,
        sessionTimeout: 30,
        loginAlerts: true,
      },
    };
  });

  const [saveMessage, setSaveMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Lưu settings vào localStorage
  const saveSettings = () => {
    localStorage.setItem('moneyverse_settings', JSON.stringify(settings));
    setSaveMessage('✓ Cài đặt đã được lưu thành công');
    setMessageType('success');
    setTimeout(() => {
      navigate('/profile');
    }, 1500);
  };

  const updateSetting = (path, value) => {
    setSettings(prev => {
      const updated = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let current = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300 font-sans">
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 p-4 sticky top-0 z-30 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/profile')}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-1 font-medium"
          >
            ← <span className="hidden sm:inline">Quay lại Trang cá nhân</span>
          </button>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white border-l pl-3 border-gray-300 dark:border-gray-600">
            Cài đặt
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
          <div className="bg-gradient-to-r from-blue-400 to-indigo-500 w-10 h-10 rounded-full shadow-md border-2 border-white dark:border-gray-800 flex items-center justify-center font-bold text-white text-sm">
            AD
          </div>
        </div>
      </header>

      <main className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
        {/* Thông báo lưu */}
        {saveMessage && (
          <div className={`rounded-xl px-4 py-3 text-sm animate-fade-in border ${
            messageType === 'success'
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
              : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800'
          }`}>
            {saveMessage}
          </div>
        )}

        {/* Cài đặt hiển thị */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎨</span>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Giao diện</h2>
            </div>
          </div>

          {/* Chế độ tối */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-200">Chế độ tối</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Bảo vệ mắt trong môi trường ánh sáng yếu</p>
            </div>
            <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
          </div>

          {/* Kích thước chữ */}
          <div>
            <p className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Kích thước chữ</p>
            <div className="flex gap-2">
              {['small', 'normal', 'large'].map((size) => (
                <button
                  key={size}
                  onClick={() => updateSetting('fontSize', size)}
                  className={`px-4 py-2 rounded-lg border font-medium transition-colors ${
                    settings.fontSize === size
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {size === 'small' ? 'A' : size === 'normal' ? 'AA' : 'AAA'}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Hiện tại: {settings.fontSize === 'small' ? 'Nhỏ' : settings.fontSize === 'normal' ? 'Bình thường' : 'Lớn'}
            </p>
          </div>

          {/* Ngôn ngữ */}
          <div>
            <p className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Ngôn ngữ</p>
            <select
              value={settings.language}
              onChange={(e) => updateSetting('language', e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="vi">Tiếng Việt 🇻🇳</option>
              <option value="en">English 🇬🇧</option>
              <option value="ja">日本語 🇯🇵</option>
              <option value="zh">中文 🇨🇳</option>
            </select>
          </div>
        </section>

        {/* Cài đặt thông báo */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔔</span>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Thông báo</h2>
            </div>
          </div>

          {/* Email thông báo */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-200">Thông báo qua Email</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Nhận cập nhật qua email của bạn</p>
            </div>
            <button
              onClick={() => updateSetting('notifications.email', !settings.notifications.email)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                settings.notifications.email ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  settings.notifications.email ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Push thông báo */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-200">Thông báo Push</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Nhận thông báo trên trình duyệt</p>
            </div>
            <button
              onClick={() => updateSetting('notifications.push', !settings.notifications.push)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                settings.notifications.push ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  settings.notifications.push ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* SMS thông báo */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-200">Thông báo SMS</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Nhận tin nhắn SMS quan trọng</p>
            </div>
            <button
              onClick={() => updateSetting('notifications.sms', !settings.notifications.sms)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                settings.notifications.sms ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  settings.notifications.sms ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Cảnh báo giao dịch */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-200">Cảnh báo giao dịch</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Thông báo cho mọi giao dịch</p>
            </div>
            <button
              onClick={() => updateSetting('notifications.transactionAlerts', !settings.notifications.transactionAlerts)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                settings.notifications.transactionAlerts ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  settings.notifications.transactionAlerts ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Nhắc nhở hóa đơn */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-200">Nhắc nhở hóa đơn</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Thông báo trước khi hóa đơn đến hạn</p>
            </div>
            <button
              onClick={() => updateSetting('notifications.billReminders', !settings.notifications.billReminders)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                settings.notifications.billReminders ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  settings.notifications.billReminders ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Khuyến mãi và ưu đãi */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-200">Khuyến mãi và ưu đãi</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Nhận thông tin về chương trình khuyến mãi</p>
            </div>
            <button
              onClick={() => updateSetting('notifications.promotions', !settings.notifications.promotions)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                settings.notifications.promotions ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  settings.notifications.promotions ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </section>

        {/* Cài đặt riêng tư */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔒</span>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Riêng tư</h2>
            </div>
          </div>

          {/* Hiển thị hồ sơ */}
          <div>
            <p className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Hiển thị hồ sơ</p>
            <select
              value={settings.privacy.profileVisibility}
              onChange={(e) => updateSetting('privacy.profileVisibility', e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="private">🔒 Riêng tư (Chỉ bạn)</option>
              <option value="friends">👥 Bạn bè</option>
              <option value="public">🌐 Công khai</option>
            </select>
          </div>

          {/* Hiển thị số dư */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-200">Hiển thị số dư</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Cho phép người khác xem số dư ví</p>
            </div>
            <button
              onClick={() => updateSetting('privacy.showBalance', !settings.privacy.showBalance)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                settings.privacy.showBalance ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  settings.privacy.showBalance ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Hiển thị lịch sử giao dịch */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-200">Hiển thị lịch sử giao dịch</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Cho phép người khác xem giao dịch của bạn</p>
            </div>
            <button
              onClick={() => updateSetting('privacy.showTransactionHistory', !settings.privacy.showTransactionHistory)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                settings.privacy.showTransactionHistory ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  settings.privacy.showTransactionHistory ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </section>

        {/* Cài đặt bảo mật */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🛡️</span>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Bảo mật</h2>
            </div>
          </div>

          {/* Tự động khóa */}
          <div>
            <p className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Tự động khóa (phút)</p>
            <input
              type="number"
              min="5"
              max="60"
              step="5"
              value={settings.security.autoLockout}
              onChange={(e) => updateSetting('security.autoLockout', parseInt(e.target.value))}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Tự động khóa tài khoản sau {settings.security.autoLockout} phút không hoạt động
            </p>
          </div>

          {/* Timeout phiên */}
          <div>
            <p className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Timeout phiên (phút)</p>
            <input
              type="number"
              min="15"
              max="120"
              step="15"
              value={settings.security.sessionTimeout}
              onChange={(e) => updateSetting('security.sessionTimeout', parseInt(e.target.value))}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Đăng xuất tự động sau {settings.security.sessionTimeout} phút không hoạt động
            </p>
          </div>

          {/* Cảnh báo đăng nhập */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-200">Cảnh báo đăng nhập</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Thông báo khi có đăng nhập từ thiết bị mới</p>
            </div>
            <button
              onClick={() => updateSetting('security.loginAlerts', !settings.security.loginAlerts)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                settings.security.loginAlerts ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  settings.security.loginAlerts ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </section>

        {/* Nút lưu */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/profile')}
            className="flex-1 px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={saveSettings}
            className="flex-1 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors"
          >
            💾 Lưu cài đặt
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
          © 2026 MoneyVerse. Mọi quyền được bảo lưu. 🔒 An toàn & Bảo mật tuyệt đối.
        </p>
      </main>
    </div>
  );
};

export default Settings;

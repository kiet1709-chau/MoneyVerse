import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DarkModeToggle from '../components/DarkModeToggle';

const SecuritySettings = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactor, setTwoFactor] = useState(true);
  const [biometric, setBiometric] = useState(false);
  const [notifications, setNotifications] = useState(true);

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
            Cài đặt bảo mật
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
        <section className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 rounded-3xl p-6 md:p-8 text-white shadow-xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-slate-300">Tầng bảo vệ tài khoản</p>
              <h2 className="text-2xl md:text-3xl font-bold mt-2">Bảo vệ ví của bạn bằng nhiều lớp xác thực</h2>
              <p className="text-slate-300 mt-3 max-w-2xl">Quản lý mật khẩu, xác thực hai bước và các tùy chọn bảo mật khác một cách dễ dàng.</p>
            </div>
            <div className="hidden md:flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 text-3xl">🔐</div>
          </div>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-800 dark:text-white">Đổi mật khẩu</h3>
                  <p className="text-sm text-gray-500 mt-1">Cập nhật mật khẩu để tăng độ an toàn cho tài khoản.</p>
                </div>
                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Đã bảo vệ</span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Mật khẩu hiện tại</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Nhập mật khẩu hiện tại"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-indigo-500 font-medium"
                    >
                      {showPassword ? 'Ẩn' : 'Hiện'}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Mật khẩu mới</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Tối thiểu 8 ký tự"
                  />
                </div>

                <button className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors">
                  Cập nhật mật khẩu
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-4">Tùy chọn bảo mật</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-xl border border-gray-100 dark:border-gray-700 p-4">
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">Xác thực hai bước</p>
                    <p className="text-sm text-gray-500">Yêu cầu mã OTP mỗi lần đăng nhập quan trọng.</p>
                  </div>
                  <button
                    onClick={() => setTwoFactor(!twoFactor)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${twoFactor ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                  >
                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${twoFactor ? 'translate-x-5' : 'translate-x-1'}`} />
                  </button>
                </div>

                <div className="hidden flex items-center justify-between rounded-xl border border-gray-100 dark:border-gray-700 p-4">
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">Sinh trắc học</p>
                    <p className="text-sm text-gray-500">Dùng vân tay hoặc Face ID để mở khóa nhanh.</p>
                  </div>
                  <button
                    onClick={() => setBiometric(!biometric)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${biometric ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                  >
                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${biometric ? 'translate-x-5' : 'translate-x-1'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-gray-100 dark:border-gray-700 p-4">
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">Thông báo bảo mật</p>
                    <p className="text-sm text-gray-500">Nhận cảnh báo khi có giao dịch bất thường.</p>
                  </div>
                  <button
                    onClick={() => setNotifications(!notifications)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                  >
                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${notifications ? 'translate-x-5' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-4">Danh sách hoạt động gần đây</h3>
              <div className="space-y-3">
                {[
                  { title: 'Đăng nhập thành công', time: '5 phút trước', badge: 'success' },
                  { title: 'Đổi mật khẩu', time: '2 giờ trước', badge: 'info' },
                  { title: 'Kích hoạt xác thực 2 bước', time: '1 ngày trước', badge: 'success' },
                ].map((item) => (
                  <div key={item.title} className="flex items-center justify-between rounded-xl bg-gray-50 dark:bg-gray-900/60 p-3">
                    <div>
                      <p className="font-medium text-sm text-gray-800 dark:text-gray-200">{item.title}</p>
                      <p className="text-xs text-gray-500">{item.time}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${item.badge === 'success' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'}`}>
                      {item.badge === 'success' ? 'An toàn' : 'Cập nhật'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-amber-600 rounded-2xl p-6 text-white shadow-sm">
              <h3 className="font-bold text-lg">Mẹo bảo mật</h3>
              <ul className="mt-3 space-y-2 text-sm text-white/90">
                <li>• Không chia sẻ mã OTP với bất kỳ ai.</li>
                <li>• Đổi mật khẩu định kỳ mỗi 3 tháng.</li>
                <li>• Bật thông báo để phát hiện giao dịch lạ.</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default SecuritySettings;

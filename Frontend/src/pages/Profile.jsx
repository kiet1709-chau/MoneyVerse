import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DarkModeToggle from '../components/DarkModeToggle';

const Profile = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const defaultUser = {
    name: 'Nguyễn Văn A',
    email: 'user@example.com',
    phone: '0987654321',
    address: 'Hà Nội, Việt Nam',
    dob: '01/01/2000',
    gender: 'Nam',
  };
  const [userInfo, setUserInfo] = useState(() => ({ ...defaultUser, ...JSON.parse(localStorage.getItem('moneyverse_user') || 'null') }));

  const [formData, setFormData] = useState(userInfo);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = () => {
    setUserInfo(formData);
    localStorage.setItem('moneyverse_user', JSON.stringify(formData));
    setIsEditing(false);
  };

  const handleLogout = () => {
    if (window.confirm('Bạn chắc chắn muốn đăng xuất?')) {
      navigate('/login');
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
            ← <span className="hidden sm:inline">Quay lại Trang chủ</span>
          </button>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white border-l pl-3 border-gray-300 dark:border-gray-600">
            Trang cá nhân
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
          <button type="button" aria-label="Mở trang cá nhân" onClick={() => navigate('/profile')} className="bg-gradient-to-r from-blue-400 to-indigo-500 w-10 h-10 rounded-full cursor-pointer shadow-md border-2 border-white dark:border-gray-800 hover:opacity-80 transition-opacity flex items-center justify-center font-bold text-white text-sm">
            AD
          </button>
        </div>
      </header>

      <main className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
        <section className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 rounded-full bg-white opacity-10"></div>
          <div className="relative z-10">
            <div className="flex items-end gap-4">
              <div className="w-20 h-20 rounded-full bg-white/20 border-4 border-white flex items-center justify-center text-4xl">👤</div>
              <div>
                <h2 className="text-3xl font-bold">{userInfo.name}</h2>
                <p className="text-white/80 mt-1">{userInfo.email}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-gray-800 dark:text-white">Thông tin cá nhân</h3>
              <button
                onClick={() => {
                  if (isEditing) {
                    handleSaveChanges();
                  } else {
                    setIsEditing(true);
                  }
                }}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors"
              >
                {isEditing ? 'Lưu thay đổi' : 'Chỉnh sửa'}
              </button>
            </div>

            {isEditing && (
              <button
                onClick={() => {
                  setFormData(userInfo);
                  setIsEditing(false);
                }}
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Hủy
              </button>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Họ và tên</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 ${isEditing ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-900'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 ${isEditing ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-900'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Số điện thoại</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 ${isEditing ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-900'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Ngày sinh</label>
                <input
                  type="text"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 ${isEditing ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-900'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Giới tính</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 ${isEditing ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-900'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                >
                  <option>Nam</option>
                  <option>Nữ</option>
                  <option>Khác</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Địa chỉ</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 ${isEditing ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-900'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-4">Tài khoản</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/security-settings')}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  🔐 Bảo mật
                </button>
                <button
                  onClick={() => navigate('/settings')}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  ⚙️ Cài đặt
                </button>
              </div>
            </div>

            <div className="bg-red-600 rounded-2xl p-6 text-white shadow-sm">
              <h3 className="font-bold text-lg mb-3">Đăng xuất</h3>
              <p className="text-sm text-white/80 mb-4">Bạn muốn thoát khỏi tài khoản này?</p>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2.5 rounded-xl bg-white text-red-600 font-semibold hover:bg-red-50 transition-colors"
              >
                🚪 Đăng xuất
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Profile;

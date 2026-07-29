import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DarkModeToggle from "../components/DarkModeToggle";

const API_BASE_URL = "http://localhost:5001/api";

// Hàm tính thời gian hiển thị (VD: Vừa xong, 5 phút trước, 1 ngày trước)
const formatTimeAgo = (dateString) => {
  if (!dateString) return "Vừa xong";
  const now = new Date();
  const past = new Date(dateString);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) return "Vừa xong";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} giờ trước`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} ngày trước`;
};

const SecuritySettings = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // States quản lý form Đổi mật khẩu
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  // State danh sách hoạt động gần đây
  const [activities, setActivities] = useState([]);

  // Hàm tải danh sách hoạt động từ Database
  const fetchActivities = useCallback(async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      const res = await axios.get(`${API_BASE_URL}/users/me/activities`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setActivities(res.data);
    } catch (error) {
      console.error("Lỗi khi tải lịch sử hoạt động:", error);
    }
  }, []);

  // Load danh sách khi mới vào trang
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        const res = await axios.get(`${API_BASE_URL}/users/me/activities`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (isMounted) {
          setActivities(res.data);
        }
      } catch (error) {
        console.error("Lỗi khi tải lịch sử hoạt động:", error);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Xử lý gửi API đổi mật khẩu
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const token = localStorage.getItem("accessToken");

      const response = await axios.post(
        `${API_BASE_URL}/users/me/password`,
        { currentPassword, newPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        },
      );

      setMessage(response.data.message);
      setIsError(false);
      setCurrentPassword("");
      setNewPassword("");

      fetchActivities();
    } catch (error) {
      if (error.response?.status === 401) {
        alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
        localStorage.removeItem("accessToken");
        navigate("/login");
        return;
      }

      setMessage(
        error.response?.data?.message ||
          "Đổi mật khẩu thất bại. Vui lòng thử lại.",
      );
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300 font-sans">
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 p-4 sticky top-0 z-30 flex justify-between items-center">
        <div className="flex items-center gap-3">
          {/* NÚT QUAY LẠI DASHBOARD */}
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
            title="Quay lại Dashboard"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>

          <h1 className="text-xl font-bold text-gray-800 dark:text-white">
            Cài đặt bảo mật
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
          <button
            type="button"
            aria-label="Mở trang cá nhân"
            onClick={() => navigate("/profile")}
            className="bg-gradient-to-r from-blue-400 to-indigo-500 w-10 h-10 rounded-full cursor-pointer shadow-md border-2 border-white dark:border-gray-800 hover:opacity-80 transition-opacity flex items-center justify-center font-bold text-white text-sm"
          >
            AD
          </button>
        </div>
      </header>

      <main className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
        <section className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 rounded-3xl p-6 md:p-8 text-white shadow-xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-slate-300">
                Tầng bảo vệ tài khoản
              </p>
              <h2 className="text-2xl md:text-3xl font-bold mt-2">
                Bảo vệ ví của bạn bằng nhiều lớp xác thực
              </h2>
              <p className="text-slate-300 mt-3 max-w-2xl">
                Quản lý mật khẩu, xác thực hai bước và các tùy chọn bảo mật khác
                một cách dễ dàng.
              </p>
            </div>
            <div className="hidden md:flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 text-3xl">
              🔐
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">
          {/* CỘT TRÁI: FORM ĐỔI MẬT KHẨU */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-800 dark:text-white">
                    Đổi mật khẩu
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Cập nhật mật khẩu để tăng độ an toàn cho tài khoản.
                  </p>
                </div>
                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  Đã bảo vệ
                </span>
              </div>

              {/* Thông báo kết quả */}
              {message && (
                <div
                  className={`p-3 rounded-xl text-sm font-medium border mb-4 ${
                    isError
                      ? "bg-red-50 dark:bg-red-900/30 text-red-600 border-red-200 dark:border-red-800/50"
                      : "bg-green-50 dark:bg-green-900/30 text-green-700 border-green-200 dark:border-green-800/50"
                  }`}
                >
                  {message}
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                    Mật khẩu hiện tại
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Nhập mật khẩu hiện tại"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-indigo-500 font-medium"
                    >
                      {showPassword ? "Ẩn" : "Hiện"}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                    Mật khẩu mới
                  </label>
                  <input
                    type="password"
                    required
                    minLength="6"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Tối thiểu 6 ký tự"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors disabled:opacity-50"
                >
                  {loading ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
                </button>
              </form>
            </div>
          </div>

          {/* CỘT PHẢI: HOẠT ĐỘNG GẦN ĐÂY */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-4">
                Danh sách hoạt động gần đây
              </h3>
              <div className="space-y-3">
                {activities.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Chưa có hoạt động nào được ghi nhận.
                  </p>
                ) : (
                  activities.map((item) => (
                    <div
                      key={item._id || item.id}
                      className="flex items-center justify-between rounded-xl bg-gray-50 dark:bg-gray-900/60 p-3"
                    >
                      <div>
                        <p className="font-medium text-sm text-gray-800 dark:text-gray-200">
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatTimeAgo(item.createdAt)}
                        </p>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          item.badge === "success"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"
                        }`}
                      >
                        {item.badge === "success" ? "An toàn" : "Cập nhật"}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default SecuritySettings;

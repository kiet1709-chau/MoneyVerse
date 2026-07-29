import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import "./index.css";
import i18n from "./i18n";

// Import các trang
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import AddTransaction from "./pages/AddTransaction";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import TransactionHistory from "./pages/TransactionHistory";
import SpendingStatistics from "./pages/SpendingStatistics";
import Reports from "./pages/Report";
import AllTransactionsReport from "./pages/AllTransactionsReport";
import SecuritySettings from "./pages/SecuritySettings";
import Bills from "./pages/Bills";
import Profile from "./pages/Profile";
import SavingsGoals from "./pages/SavingsGoals";
import Settings from "./pages/Settings";
import BalanceSetup from "./pages/BalanceSetup";
import SidebarLayout from "./components/SidebarLayout";

// Helper lấy key lưu trữ số dư theo username
const getBalanceStorageKey = (username) =>
  username ? `moneyverse_balance_${username}` : "moneyverse_balance";

// Interceptor xử lý triệt để khi Token hết hạn (401 / 403)
const AxiosInterceptor = ({ setCurrentUser }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error.response?.status;
        const msg = error.response?.data?.message;

        // Nếu Token hết hạn hoặc không hợp lệ -> Xóa bộ nhớ và bắt đăng nhập lại
        if (status === 401 || status === 403 || msg === "jwt expired") {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("moneyverse_currentUser");
          if (setCurrentUser) setCurrentUser(null);

          // Chuyển về trang login nếu chưa ở trang login
          if (!window.location.hash.includes("#/login")) {
            navigate("/login", { replace: true });
          }
        }
        return Promise.reject(error);
      },
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, [navigate, setCurrentUser]);

  return null;
};

function App() {
  // Quản lý trạng thái Dark Mode
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark";
  });

  // Quản lý User hiện tại
  const [currentUser, setCurrentUser] = useState(
    () => localStorage.getItem("moneyverse_currentUser") || null,
  );

  // Khởi tạo Số dư
  const [balance, setBalance] = useState(() => {
    const user = localStorage.getItem("moneyverse_currentUser");
    const key = getBalanceStorageKey(user);
    const savedBalance = localStorage.getItem(key);
    return savedBalance !== null ? parseFloat(savedBalance) : 25000000;
  });

  // Effect cập nhật Class HTML theo Dark Mode
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Effect ĐỒNG BỘ GOOGLE TRANSLATE TOÀN CỤC (Khắc phục lỗi Reload quay về Tiếng Việt)
  useEffect(() => {
    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          { pageLanguage: "vi", autoDisplay: false },
          "google_translate_global_element",
        );
      }
    };

    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.type = "text/javascript";
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  // Effect đồng bộ Ngôn ngữ i18n
  useEffect(() => {
    const savedLang = localStorage.getItem("language") || "vi";
    document.documentElement.lang = savedLang;
    i18n.changeLanguage(savedLang);

    const onStorage = (event) => {
      if (event.key === "language" && event.newValue) {
        document.documentElement.lang = event.newValue;
        i18n.changeLanguage(event.newValue);
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Effect đồng bộ Font-size
  useEffect(() => {
    const applyFontSizeClass = (size) => {
      const root = window.document.documentElement;
      root.classList.remove(
        "font-size-small",
        "font-size-normal",
        "font-size-large",
      );
      if (size) root.classList.add(`font-size-${size}`);
    };

    const saved = localStorage.getItem("moneyverse_settings");
    const settings = saved ? JSON.parse(saved) : null;
    applyFontSizeClass(settings?.fontSize || "normal");

    const onStorage = (e) => {
      if (e.key === "moneyverse_settings") {
        const s = e.newValue ? JSON.parse(e.newValue) : null;
        applyFontSizeClass(s?.fontSize || "normal");
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // State Hóa đơn
  const [bills, setBills] = useState(() => {
    const savedBills = localStorage.getItem("moneyverse_bills");
    return savedBills
      ? JSON.parse(savedBills)
      : [
          {
            id: 1,
            name: "Tiền học phí",
            amount: 2000000,
            dueDate: "15/07/2026",
            status: "pending",
            provider: "Đại học",
            date: "",
          },
          {
            id: 2,
            name: "Tiền điện tháng 6",
            amount: 450000,
            dueDate: "20/07/2026",
            status: "pending",
            provider: "EVN",
            date: "",
          },
          {
            id: 3,
            name: "Internet cáp quang",
            amount: 275000,
            dueDate: "22/07/2026",
            status: "pending",
            provider: "VNPT",
            date: "",
          },
        ];
  });

  // State Giao dịch
  const [transactions, setTransactions] = useState(() => {
    const savedTransactions = localStorage.getItem("moneyverse_transactions");
    return savedTransactions
      ? JSON.parse(savedTransactions)
      : [
          {
            id: "sample-1",
            name: "Nhận lương tháng",
            category: "Thu nhập",
            amount: 30000000,
            type: "income",
            date: "01/07/2026",
            icon: "💰",
          },
          {
            id: "sample-2",
            name: "Thanh toán tiền điện",
            category: "Dịch vụ",
            amount: 450000,
            type: "expense",
            date: "05/07/2026",
            icon: "🧾",
          },
          {
            id: "sample-3",
            name: "Mua sắm siêu thị",
            category: "Mua sắm",
            amount: 1250000,
            type: "expense",
            date: "08/07/2026",
            icon: "🛍️",
          },
          {
            id: "sample-4",
            name: "Ăn trưa",
            category: "Ăn uống",
            amount: 85000,
            type: "expense",
            date: "10/07/2026",
            icon: "🍜",
          },
        ];
  });

  // State Vouchers
  const [vouchers, setVouchers] = useState(() => {
    const savedVouchers = localStorage.getItem("moneyverse_vouchers");
    return savedVouchers ? JSON.parse(savedVouchers) : [];
  });

  // Sync LocalStorage
  useEffect(() => {
    const key = getBalanceStorageKey(currentUser);
    localStorage.setItem(key, balance.toString());
  }, [balance, currentUser]);

  useEffect(() => {
    localStorage.setItem("moneyverse_bills", JSON.stringify(bills));
  }, [bills]);

  useEffect(() => {
    localStorage.setItem(
      "moneyverse_transactions",
      JSON.stringify(transactions),
    );
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("moneyverse_vouchers", JSON.stringify(vouchers));
  }, [vouchers]);

  return (
    <Router>
      <AxiosInterceptor setCurrentUser={setCurrentUser} />

      {/* Element ẩn cho Google Translate toàn cục */}
      <div id="google_translate_global_element" style={{ display: "none" }} />

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route
          path="/login"
          element={
            <Login
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              setCurrentUser={setCurrentUser}
              setBalance={setBalance}
            />
          }
        />
        <Route
          path="/register"
          element={<Register darkMode={darkMode} setDarkMode={setDarkMode} />}
        />
        <Route
          path="/forgot-password"
          element={
            <ForgotPassword darkMode={darkMode} setDarkMode={setDarkMode} />
          }
        />
        <Route
          path="/add-transaction"
          element={
            <AddTransaction
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              balance={balance}
              setBalance={setBalance}
              setTransactions={setTransactions}
            />
          }
        />
        <Route
          path="/setup-balance"
          element={<BalanceSetup setBalance={setBalance} />}
        />
        <Route
          path="security-settings"
          element={
            <SecuritySettings darkMode={darkMode} setDarkMode={setDarkMode} />
          }
        />

        {/* Các route nằm trong SidebarLayout */}
        <Route
          element={
            <SidebarLayout darkMode={darkMode} setDarkMode={setDarkMode} />
          }
        >
          <Route
            index
            element={
              <Dashboard
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                balance={balance}
                setBalance={setBalance}
                bills={bills}
                setBills={setBills}
                transactions={transactions}
                setTransactions={setTransactions}
                vouchers={vouchers}
                setVouchers={setVouchers}
              />
            }
          />
          <Route
            path="dashboard"
            element={
              <Dashboard
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                balance={balance}
                setBalance={setBalance}
                bills={bills}
                setBills={setBills}
                transactions={transactions}
                setTransactions={setTransactions}
                vouchers={vouchers}
                setVouchers={setVouchers}
              />
            }
          />
          <Route
            path="transaction-history"
            element={
              <TransactionHistory
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                transactions={transactions}
                bills={bills}
              />
            }
          />
          <Route
            path="spending-statistics"
            element={
              <SpendingStatistics
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                balance={balance}
                transactions={transactions}
                bills={bills}
              />
            }
          />
          <Route
            path="reports"
            element={
              <Reports
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                transactions={transactions}
              />
            }
          />
          <Route
            path="all-transactions-report"
            element={<AllTransactionsReport transactions={transactions} />}
          />
          <Route
            path="savings-goals"
            element={
              <SavingsGoals darkMode={darkMode} setDarkMode={setDarkMode} />
            }
          />
          <Route
            path="settings"
            element={<Settings darkMode={darkMode} setDarkMode={setDarkMode} />}
          />
        </Route>

        <Route
          path="/bills"
          element={
            <Bills
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              balance={balance}
              setBalance={setBalance}
              bills={bills}
              setBills={setBills}
              transactions={transactions}
              setTransactions={setTransactions}
            />
          }
        />
        <Route
          path="/profile"
          element={<Profile darkMode={darkMode} setDarkMode={setDarkMode} />}
        />
        <Route
          path="*"
          element={<NotFound darkMode={darkMode} setDarkMode={setDarkMode} />}
        />
      </Routes>
    </Router>
  );
}

export default App;

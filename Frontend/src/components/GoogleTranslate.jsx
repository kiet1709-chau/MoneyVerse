import React, { useState, useEffect } from "react";

const languages = [
  { code: "vi", label: "🇻🇳 Tiếng Việt" },
  { code: "en", label: "🇺🇸 English" },
  { code: "ja", label: "🇯🇵 日本語 (Tiếng Nhật)" },
  { code: "ko", label: "🇰🇷 한국어 (Tiếng Hàn)" },
  { code: "zh-CN", label: "🇨🇳 中文 (Tiếng Trung)" },
  { code: "fr", label: "🇫🇷 Français (Tiếng Pháp)" },
  { code: "de", label: "🇩🇪 Deutsch (Tiếng Đức)" },
];

// Hàm ghi cookie googtrans chuẩn cho cả localhost và production
const setTranslateCookie = (langCode) => {
  if (langCode === "vi") {
    document.cookie =
      "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
  } else {
    const cookieVal = `/vi/${langCode}`;
    document.cookie = `googtrans=${cookieVal}; path=/;`;
    document.cookie = `googtrans=${cookieVal}; path=/; domain=${window.location.hostname}`;
  }
};

const GoogleTranslate = () => {
  // Ưu tiên lấy ngôn ngữ từ localStorage, nếu chưa có thì đọc Cookie
  const [currentLang, setCurrentLang] = useState(() => {
    const saved = localStorage.getItem("moneyverse_lang");
    if (saved) return saved;

    const cookies = document.cookie.split("; ");
    const googtrans = cookies.find((r) => r.startsWith("googtrans="));
    if (googtrans) {
      const parts = googtrans.split("/");
      return parts[parts.length - 1] || "vi";
    }
    return "vi";
  });

  useEffect(() => {
    // Luôn đảm bảo Cookie khớp với state hiện tại mỗi khi component nạp
    setTranslateCookie(currentLang);

    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "vi",
            autoDisplay: false,
          },
          "google_translate_hidden_element",
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
  }, [currentLang]);

  const handleLanguageChange = (langCode) => {
    setCurrentLang(langCode);
    localStorage.setItem("moneyverse_lang", langCode);
    setTranslateCookie(langCode);

    // Refresh nhẹ để Google Translate áp dụng ngôn ngữ mới
    window.location.reload();
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-gray-100 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3">
        <span className="text-2xl">🌐</span>
        <div>
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
            Ngôn ngữ hiển thị
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Chọn ngôn ngữ để dịch nhanh nội dung trang
          </p>
        </div>
      </div>

      <div className="relative">
        <select
          value={currentLang}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="w-full sm:w-auto bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 font-medium text-sm px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-sm transition-all"
        >
          {languages.map((lang) => (
            <option
              key={lang.code}
              value={lang.code}
              className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 py-1"
            >
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      <div id="google_translate_hidden_element" className="hidden" />
    </div>
  );
};

export default GoogleTranslate;

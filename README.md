# 🌌 MoneyVerse - Vũ Trụ Quản Lý Tài Chính Cá Nhân

**MoneyVerse** là một ứng dụng web giúp người dùng theo dõi, quản lý và tối ưu hóa tài chính cá nhân một cách trực quan và thông minh. Dự án được xây dựng trong khuôn khổ môn học **Chuyên đề React và Node.js**.

> **Slogan:** "Kiểm soát chi tiêu, làm chủ tài chính trong tầm tay."

---

## 🚀 Tính năng chính

*   **Quản lý Thu/Chi:** Cho phép người dùng nhập và phân loại các khoản thu, chi theo từng hạng mục rõ ràng (Ăn uống, Đi lại, Lương, Thưởng...).
*   **Thống kê & Trực quan hóa dữ liệu:** Tích hợp biểu đồ tròn (Pie chart) và biểu đồ cột (Bar chart) giúp người dùng dễ dàng hình dung xu hướng và tỷ lệ chi tiêu theo tháng.
*   **Hạn mức chi tiêu (Budgeting):** Đặt giới hạn chi tiêu cho từng hạng mục. Hệ thống sẽ tự động tính toán và đưa ra cảnh báo nếu chi phí vượt quá ngân sách định trước.
*   **Bảo mật tài khoản:** Đăng ký, đăng nhập và xác thực người dùng an toàn bằng JWT (JSON Web Token) và băm mật khẩu bằng Bcrypt.

---

## 🛠️ Công nghệ sử dụng

### Frontend
*   **Framework:** React.js (Vite)
*   **Styling:** Tailwind CSS
*   **Biểu đồ:** Chart.js (react-chartjs-2)
*   **Quản lý State:** React Context API / Redux Toolkit
*   **HTTP Client:** Axios

### Backend
*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Database:** MongoDB
*   **ODM:** Mongoose
*   **Authentication:** JWT, Bcrypt

---

## 👥 Thành viên thực hiện (Nhóm 2 người)

| STT | Họ và Tên | MSSV | Vai trò | Nhiệm vụ đảm nhiệm |
|---|---|---|---|---|
| 1 | [Tên Thành Viên A] | [MSSV A] | **Backend Developer** | Thiết kế DB, Viết API (Auth, CRUD Transactions, Aggregation Thống kê, Logic Hạn mức) |
| 2 | [Tên Thành Viên B] | [MSSV B] | **Frontend Developer** | Dựng UI/UX, Quản lý State, Tích hợp Chart.js, Kết nối API Backend |

---

## 📦 Hướng dẫn cài đặt và chạy ứng dụng

### Điều kiện tiên quyết
*   Đã cài đặt [Node.js](https://nodejs.org/) (Khuyến nghị phiên bản LTS).
*   Có tài khoản [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) hoặc MongoDB Local.

### 1. Cài đặt Backend
```bash
# Di chuyển vào thư mục backend
cd backend

# Cài đặt các thư viện cần thiết
npm install

# Tạo file .env và cấu hình các biến môi trường sau:
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

# Chạy server ở chế độ phát triển
npm run dev

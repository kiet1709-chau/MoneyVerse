import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Authorization - xác minh user là ai
export const protectedRoute = async (req, res, next) => {
  try {
    // 1. Lấy token từ header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    // Kiểm tra nếu không có token hoặc chuỗi token bị biến thành "null"/"undefined"
    if (!token || token === "null" || token === "undefined") {
      return res.status(401).json({ message: "Không tìm thấy access token." });
    }

    // 2. Xác minh token
    const decodedUser = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // 3. Tìm user trong database
    const user = await User.findById(decodedUser.userId).select(
      "-hashedPassword",
    );

    if (!user) {
      return res
        .status(401)
        .json({ message: "User không tồn tại hoặc đã bị xóa." });
    }

    // 4. Trả user về req và đi tiếp
    req.user = user;
    next();
  } catch (error) {
    // Không log error tràn ngập console nếu chỉ là token hết hạn thông thường
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "jwt expired", expiredAt: error.expiredAt });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Access token không hợp lệ." });
    }

    console.error("Lỗi xác minh JWT khác:", error.message);
    return res.status(500).json({ message: "Lỗi hệ thống." });
  }
};

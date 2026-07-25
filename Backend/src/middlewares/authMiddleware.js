import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Authorization - xác minh user là ai
export const protectedRoute = async (req, res, next) => {
  try {
    // Lấy token từ header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Không tìm thấy access token." });
    }
    // Xác minh token hợp lệ
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, decodedUser) => {
        if (err) {
          console.error(err);
          return res
            .status(403)
            .json({ message: "Access token không hết hạn hoặc không đúng." });
        }
        // Tìm user
        const user = await User.findById(decodedUser.userId).select(
          "-hashedPassword",
        ); // loại bỏ hashedPassword khỏi user object
        if (!user) {
          return res.status(404).json({ message: "User không tồn tại." });
        }
        // Trả user về req
        req.user = user;
        next();
      },
    );
  } catch (error) {
    console.error("Lỗi khi xác minh jwt trong authMiddleware", error);
    return res.status(500).json({ message: "Lỗi hệ thống." });
  }
};

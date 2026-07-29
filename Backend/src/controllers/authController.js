import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Session from "../models/Session.js";
import ActivityLog from "../models/ActivityLog.js"; // 🟢 Import thêm ActivityLog

const ACCESS_TOKEN_TTL = "40m";
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000;

export const signUp = async (req, res) => {
  try {
    const {
      username,
      password,
      email,
      firstName,
      lastName,
      phone,
      address,
      dob,
      gender,
    } = req.body;

    if (!username || !password || !email || !firstName || !lastName) {
      return res.status(400).json({
        message:
          "Không thể thiếu username, password, email, firstName hoặc lastName",
      });
    }

    const duplicate = await User.findOne({ username });
    if (duplicate) {
      return res.status(409).json({ message: "Username đã tồn tại" });
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(409).json({ message: "Email đã tồn tại" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUserData = {
      username,
      hashedPassword,
      email,
      displayName: `${firstName} ${lastName}`,
      phone: phone || "",
      address: address || "",
      dob: dob || "",
      gender: gender || "Khác",
      balance: null,
    };

    const newUser = await User.create(newUserData);

    // 🟢 Ghi log Đăng ký tài khoản
    await ActivityLog.create({
      userId: newUser._id,
      title: "Đăng ký tài khoản thành công",
      badge: "success",
    });

    return res.sendStatus(204);
  } catch (error) {
    console.error("Lỗi khi gọi signUp:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const logIn = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Thiếu username hoặc password." });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(401)
        .json({ message: "username hoặc password không đúng." });
    }

    const passwordCorrect = await bcrypt.compare(password, user.hashedPassword);
    if (!passwordCorrect) {
      return res
        .status(401)
        .json({ message: "username hoặc password không đúng." });
    }

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL },
    );

    const refreshToken = crypto.randomBytes(64).toString("hex");

    await Session.create({
      userId: user._id,
      refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: REFRESH_TOKEN_TTL,
    });

    // 🟢 GHI LOG ĐĂNG NHẬP THÀNH CÔNG VÀO DATABASE
    await ActivityLog.create({
      userId: user._id,
      title: "Đăng nhập thành công",
      badge: "success",
    });

    return res.status(200).json({
      message: `User ${user.displayName} đã logged in.`,
      accessToken,
      user: {
        username: user.username,
        displayName: user.displayName,
        email: user.email,
        balance: user.balance,
      },
    });
  } catch (error) {
    console.error("Lỗi khi gọi logIn:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const signOut = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (token) {
      await Session.deleteOne({ refreshToken: token });
      res.clearCookie("refreshToken");
    }
    return res.sendStatus(204);
  } catch (error) {
    console.error("Lỗi khi gọi signOut:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ message: "Vui lòng nhập tên đăng nhập." });
    }

    const user = await User.findOne({
      username: username.trim().toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        message: "Không tìm thấy tài khoản đã đăng ký với tên đăng nhập này.",
      });
    }

    return res.status(200).json({
      message: "Đã tìm thấy tài khoản. Hãy đặt mật khẩu mới.",
      userId: user._id,
      username: user.username,
    });
  } catch (error) {
    console.error("Lỗi khi gọi forgotPassword:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { userId, newPassword } = req.body;

    if (!userId || !newPassword) {
      return res
        .status(400)
        .json({ message: "Thiếu thông tin người dùng hoặc mật khẩu mới." });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Mật khẩu mới phải có ít nhất 6 ký tự." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(userId, { hashedPassword });

    // 🟢 Ghi log Quên/Đặt lại mật khẩu
    await ActivityLog.create({
      userId,
      title: "Đặt lại mật khẩu qua Quên mật khẩu",
      badge: "info",
    });

    return res.status(200).json({ message: "Đặt lại mật khẩu thành công!" });
  } catch (error) {
    console.error("Lỗi khi gọi resetPassword:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

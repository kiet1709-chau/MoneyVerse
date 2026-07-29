import SavingGoal from "../models/SavingGoal.js";

// @desc    Lấy danh sách tất cả mục tiêu tiết kiệm của User
// @route   GET /api/saving-goals
// @access  Private (Cần authMiddleware)
export const getGoals = async (req, res) => {
  try {
    const goals = await SavingGoal.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, data: goals });
  } catch (error) {
    console.error("Lỗi khi lấy mục tiêu tiết kiệm:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy dữ liệu mục tiêu",
    });
  }
};

// @desc    Thêm mục tiêu tiết kiệm mới
// @route   POST /api/saving-goals
// @access  Private
export const createGoal = async (req, res) => {
  try {
    const { name, target, current, icon, color } = req.body;

    if (!name || target === undefined || target === null || target === "") {
      return res.status(400).json({
        success: false,
        message: "Vui lòng điền tên và số tiền mục tiêu",
      });
    }

    const newGoal = await SavingGoal.create({
      userId: req.user._id,
      name,
      target: Number(target),
      current: Number(current || 0),
      icon: icon || "🎯",
      color: color || "bg-sky-600",
    });

    res.status(201).json({ success: true, data: newGoal });
  } catch (error) {
    console.error("Lỗi khi tạo mục tiêu tiết kiệm:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi server khi tạo mục tiêu" });
  }
};

// @desc    Cập nhật số tiền tiết kiệm hiện tại (bao gồm cả logic +1M)
// @route   PUT /api/saving-goals/:id
// @access  Private
export const updateGoalAmount = async (req, res) => {
  try {
    const { id } = req.params;
    const { current } = req.body;

    if (current === undefined || current === null || current === "") {
      return res.status(400).json({
        success: false,
        message: "Thiếu giá trị số tiền hiện tại",
      });
    }

    const goal = await SavingGoal.findOne({ _id: id, userId: req.user._id });

    if (!goal) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy mục tiêu" });
    }

    // Đảm bảo số tiền hiện tại không vượt quá số tiền mục tiêu
    const updatedCurrent = Math.min(Number(current), goal.target);
    goal.current = updatedCurrent;

    await goal.save();

    res.status(200).json({ success: true, data: goal });
  } catch (error) {
    console.error("Lỗi khi cập nhật mục tiêu tiết kiệm:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi server khi cập nhật tiến độ" });
  }
};

// @desc    Xóa mục tiêu tiết kiệm
// @route   DELETE /api/saving-goals/:id
// @access  Private
export const deleteGoal = async (req, res) => {
  try {
    const { id } = req.params;

    const goal = await SavingGoal.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });

    if (!goal) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy mục tiêu để xóa" });
    }

    res.status(200).json({ success: true, message: "Xóa mục tiêu thành công" });
  } catch (error) {
    console.error("Lỗi khi xóa mục tiêu tiết kiệm:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi server khi xóa mục tiêu" });
  }
};

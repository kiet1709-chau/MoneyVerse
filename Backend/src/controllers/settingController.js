import Setting from "../models/Setting.js";

// [GET] /api/users/settings
export const getSettings = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    let settings = await Setting.findOne({ userId });

    if (!settings) {
      settings = await Setting.create({ userId });
    }

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Không thể tải cài đặt",
      error: error.message,
    });
  }
};

// [PUT] /api/users/settings
export const updateSettings = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { fontSize, language, notifications, pushSubscription } = req.body;

    const updateData = {
      fontSize,
      language,
      notifications,
    };

    if (pushSubscription !== undefined) {
      updateData.pushSubscription = pushSubscription;
    }

    const updatedSettings = await Setting.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { returnDocument: "after", upsert: true, runValidators: true },
    );

    res.status(200).json({
      success: true,
      message: "Cài đặt đã được lưu thành công!",
      data: updatedSettings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Cập nhật cài đặt thất bại",
      error: error.message,
    });
  }
};

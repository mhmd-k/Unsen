import bcrypt from "bcrypt";
import crypto from "crypto";
import { User } from "../../models/associations.js";
import { sendResetPasswordEmail } from "../../services/emailService.js";
import { Op } from "sequelize";

class PasswordController {
  changePassword = async (req, res) => {
    const { currentPassword, newPassword, userId } = req.body;

    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Verify current password
      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password,
      );
      if (!isPasswordValid) {
        return res
          .status(401)
          .json({ message: "Current password is incorrect" });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password
      await user.update({ password: hashedPassword });

      res.status(200).json({ message: "Password changed successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message || "Internal server error" });
    }
  };

  forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const resetToken = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

      await user.update({
        resetPasswordToken: resetToken,
        resetPasswordExpires: expiresAt,
      });

      await sendResetPasswordEmail(user.email, resetToken);

      res
        .status(200)
        .json({ message: "Password reset email sent successfully" });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: error.message || "Internal server error" });
    }
  };

  resetPassword = async (req, res) => {
    const { newPassword, token } = req.body;

    try {
      const user = await User.findOne({
        where: {
          resetPasswordToken: token,
          resetPasswordExpires: { [Op.gt]: new Date() },
        },
      });

      if (!user) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await user.update({
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      });

      res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: error.message || "Internal server error" });
    }
  };

  // Future methods can be added here:
  // - resetPassword
  // - validatePasswordStrength
}

export default new PasswordController();

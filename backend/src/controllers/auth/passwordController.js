import bcrypt from "bcrypt";
import { User } from "../../models/associations.js";

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
        user.password
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

  // Future methods can be added here:
  // - forgotPassword
  // - resetPassword
  // - validatePasswordStrength
}

export default new PasswordController();

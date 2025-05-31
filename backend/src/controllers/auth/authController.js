import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../../models/associations.js";
import {
  generateAccessToken,
  storeRefreshTokenInCookie,
  generateRefreshToken,
} from "../../utils/jwtTokens.js";

class AuthController {
  login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ where: { email } });
      if (!user)
        return res.status(401).json({ message: "Invalid credentials" });

      if (!user.isVerified) {
        return res
          .status(401)
          .json({ message: "Please verify your email first" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid)
        return res.status(401).json({ message: "Invalid credentials" });

      // Generate tokens
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      storeRefreshTokenInCookie(res, refreshToken);

      const userData = user.get({ plain: true });
      res.json({ user: { ...userData, password: undefined, accessToken } });
    } catch (err) {
      console.log(err);

      res.status(500).json({ message: "Internal server error" });
    }
  };

  refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    console.log("refresh token: ", refreshToken)

    if (!refreshToken)
      return res.status(401).json({ message: "Refresh token required" });

    try {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_SECRET,
        async (err, decoded) => {
          if (err)
            return res.status(403).json({ message: "Invalid refresh token" });

          const user = await User.findByPk(decoded.userId);
          if (!user) return res.status(404).json({ message: "User not found" });

          const userData = user.get({ plain: true });
          const newAccessToken = generateAccessToken(userData);
          const newRefreshToken = generateRefreshToken(userData);

          storeRefreshTokenInCookie(res, newRefreshToken);

          res.status(200).json({
            user: {
              ...userData,
              password: undefined,
              accessToken: newAccessToken,
            },
          });
        }
      );
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  };

  logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(204).send();

    try {
      res.clearCookie("refreshToken");
      res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  };
}

export default new AuthController();

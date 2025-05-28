import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendVerificationEmail } from "../services/emailService.js";
import { User, SellerBankAccount, EmailLog } from "../models/associations.js";
import { Op } from "sequelize";
import {
  generateAccessToken,
  storeRefreshTokenInCookie,
  generateRefreshToken,
} from "../utils/jwtTokens.js";

class AuthController {
  signup = async (req, res) => {
    const {
      username,
      email,
      password,
      role,
      bankName,
      fullName,
      accountNumber,
      routingNumber,
    } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Invalid request, missing fields" });
    }

    // Validate seller bank account fields if role is SELLER
    if (role === "SELLER") {
      if (!bankName || !fullName || !accountNumber || !routingNumber) {
        return res.status(400).json({
          message: "Bank account information is required for sellers",
        });
      }
    }

    try {
      const existingUser = await User.findOne({ where: { email } });

      if (existingUser && existingUser.dataValues.isVerified)
        return res.status(409).json({ message: "User already exists" });

      if (existingUser && !existingUser.dataValues.isVerified)
        return res.status(409).json({
          message: "A verification link has been sent to this email before",
          resendEmailOption: true,
        });

      const hashedPassword = await bcrypt.hash(password, 10);

      // Generate verification token
      const verificationToken = crypto.randomBytes(32).toString("hex");
      const verificationTokenExpires = new Date(
        Date.now() + 24 * 60 * 60 * 1000
      ); // 24 hours

      // Send verification email
      await sendVerificationEmail(email, verificationToken);

      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        role: role || "CUSTOMER",
        verificationToken,
        verificationTokenExpires,
      });

      await EmailLog.create({
        userId: newUser.id,
        type: "VERIFICATION",
        email: email,
      });

      // If user is a seller, create their bank account
      if (role === "SELLER") {
        await SellerBankAccount.create({
          userId: newUser.id,
          bankName,
          fullName,
          accountNumber,
          routingNumber,
        });
      }

      res.status(201).json({
        message: "Please check your email to verify your account",
        userId: newUser.id,
        email: newUser.email,
      });
    } catch (err) {
      res.status(500).json({ message: err.message || "Internal server error" });
    }
  };

  verifyEmail = async (req, res) => {
    const { token } = req.body;

    try {
      console.log("Verification attempt with token:", token);
      console.log("Current time:", new Date());

      // First find the user without the expiration check
      const user = await User.findOne({
        where: {
          verificationToken: token,
        },
      });

      console.log("Found user:", user ? "Yes" : "No");
      if (user) {
        console.log("Token expiration:", user.verificationTokenExpires);
        console.log(
          "Is token expired?",
          new Date() > user.verificationTokenExpires
        );
      }

      if (!user) {
        return res.status(400).json({ message: "Invalid verification token" });
      }

      if (new Date() > user.verificationTokenExpires) {
        return res
          .status(400)
          .json({ message: "Verification token has expired" });
      }

      await user.update({
        isVerified: true,
        verificationToken: null,
        verificationTokenExpires: null,
      });

      // Generate tokens after successful verification
      const userData = user.get({ plain: true });
      const accessToken = generateAccessToken(userData);
      const refreshToken = generateRefreshToken(userData);

      storeRefreshTokenInCookie(res, refreshToken);

      res.json({
        message: "Email verified successfully",
        user: {
          ...userData,
          password: undefined,
          accessToken,
        },
      });
    } catch (err) {
      console.error("Verification error:", err);
      res
        .status(err.status || 500)
        .json({ message: err.message || "Internal server error" });
    }
  };

  resendVerificationEmail = async (req, res) => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    try {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.isVerified) {
        return res.status(400).json({ message: "Email is already verified" });
      }

      // Check if user has exceeded daily limit
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const emailCount = await EmailLog.count({
        where: {
          userId: user.id,
          type: "VERIFICATION",
          createdAt: {
            [Op.gte]: today,
          },
        },
      });

      if (emailCount >= 10) {
        return res.status(429).json({
          message: "Daily limit reached. Please try again tomorrow.",
          limit: 10,
          remaining: 0,
        });
      }

      // Generate new verification token
      const verificationToken = crypto.randomBytes(32).toString("hex");
      const verificationTokenExpires = new Date(
        Date.now() + 24 * 60 * 60 * 1000
      ); // 24 hours

      // Update user with new token
      await user.update({
        verificationToken,
        verificationTokenExpires,
      });

      // Log the email send
      await EmailLog.create({
        userId: user.id,
        type: "VERIFICATION",
        email: user.email,
      });

      // Send new verification email
      await sendVerificationEmail(email, verificationToken);

      res.status(200).json({
        message: "Verification email has been resent",
        email: user.email,
        remaining: 10 - (emailCount + 1),
      });
    } catch (err) {
      res.status(500).json({ message: err.message || "Internal server error" });
    }
  };

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
      res.status(500).json({ message: "Internal server error" });
    }
  };

  refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
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

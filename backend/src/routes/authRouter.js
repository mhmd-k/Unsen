import express from "express";
import authController from "../controllers/auth/authController.js";
import registrationController from "../controllers/auth/registrationController.js";
import passwordController from "../controllers/auth/passwordController.js";
import verifyJWTMiddleware from "../middleware/auth.js";
import validateRequest from "../middleware/validateRequest.js";
import { loginValidation } from "../validations/authValidations.js";
import {
  signupValidation,
  verifyEmailValidation,
  resendVerificationValidation,
} from "../validations/registrationValidations.js";
import { changePasswordValidation } from "../validations/passwordValidations.js";

const router = express.Router();

// Registration routes
router.post(
  "/signup",
  signupValidation,
  validateRequest,
  registrationController.signup
);
router.post(
  "/verify-email",
  verifyEmailValidation,
  validateRequest,
  registrationController.verifyEmail
);
router.post(
  "/resend-verification",
  resendVerificationValidation,
  validateRequest,
  registrationController.resendVerificationEmail
);

// Authentication routes
router.post("/login", loginValidation, validateRequest, authController.login);
router.get("/refresh", validateRequest, authController.refreshToken);
router.post(
  "/logout",
  verifyJWTMiddleware,
  validateRequest,
  authController.logout
);

// Password routes
router.post(
  "/change-password",
  verifyJWTMiddleware,
  changePasswordValidation,
  validateRequest,
  passwordController.changePassword
);

export default router;

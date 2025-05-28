import express from "express";
import authController from "../controllers/authController.js";
import verifyJWT from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/verify-email", authController.verifyEmail);
router.post("/resend-verification", authController.resendVerificationEmail);
router.get("/refresh", authController.refreshToken);
router.post("/logout", verifyJWT, authController.logout);

export default router;

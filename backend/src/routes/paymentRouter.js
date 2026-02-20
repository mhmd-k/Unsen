import express from "express";
import verifyJWTMiddleware from "../middleware/auth.js";
import paymentController from "../controllers/paymentController.js";

const router = express.Router();

router.post("/", verifyJWTMiddleware, paymentController.pay);

export default router;

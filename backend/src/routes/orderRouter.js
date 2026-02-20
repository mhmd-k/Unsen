import express from "express";
import orderController from "../controllers/orderController.js";
import { placeOrderValidation } from "../validations/orderValidations.js";
import validateRequest from "../middleware/validateRequest.js";
import verifyJWTMiddleware from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/place",
  verifyJWTMiddleware,
  placeOrderValidation,
  validateRequest,
  orderController.placeOrder,
);

router.get("/", verifyJWTMiddleware, orderController.getUserOrders);

router.put(
  "/cancel/:orderId",
  verifyJWTMiddleware,
  orderController.cancelOrder,
);

router.get("/:orderId", verifyJWTMiddleware, orderController.getOrderById);

// Future routes can be added here:
// router.get("/:id", verifyJWTMiddleware, orderController.getOrderById);
// router.put("/:id/cancel", verifyJWTMiddleware, orderController.cancelOrder);

export default router;

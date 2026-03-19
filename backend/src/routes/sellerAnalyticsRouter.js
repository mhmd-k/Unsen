import { Router } from "express";
import sellerAnalyticsController from "../controllers/sellerAnalyticsController.js";
import verifyJWTMiddleware from "../middleware/auth.js";
import requireRoleMiddleware from "../middleware/requireRole.js";
import { ROLES } from "../constants/roles.js";

const router = new Router();

router.get(
  "/analytics",
  verifyJWTMiddleware,
  requireRoleMiddleware(ROLES.SELLER),
  sellerAnalyticsController.getSellerAnalytics,
);

export default router;

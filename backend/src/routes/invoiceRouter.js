import express from "express";
import invoiceController from "../controllers/invoiceController.js";
import verifyJWTMiddleware from "../middleware/auth.js";
import { ROLES } from "../constants/roles.js";
import requireRoleMiddleware from "../middleware/requireRole.js";

const router = express.Router();

// get seller invoices
router.get(
  "/",
  verifyJWTMiddleware,
  requireRoleMiddleware(ROLES.SELLER),
  invoiceController.getSellerInvoices,
);

// get invoice details
router.get(
  "/:id",
  verifyJWTMiddleware,
  requireRoleMiddleware(ROLES.SELLER),
  invoiceController.getInvoiceDetails,
);

export default router;

import express from "express";
import productController from "../controllers/productController.js";
import { createProductValidation } from "../validations/productValidations.js";
import validateRequest from "../middleware/validateRequest.js";
import multer from "multer";
import verifyJWTMiddleware from "../middleware/auth.js";
import paginationMiddleware from "../middleware/pagination.js";
import { Product } from "../models/associations.js";
import requireRoleMiddleware from "../middleware/requireRole.js";
import { ROLES } from "../constants/roles.js";

const router = express.Router();

const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files allowed"), false);
  }
  cb(null, true);
};

// Configure multer for file upload
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
    files: 5,
  },
});

router.post(
  "/create",
  verifyJWTMiddleware,
  requireRoleMiddleware(ROLES.SELLER),
  upload.array("images[]", 5),
  createProductValidation,
  validateRequest,
  productController.createProduct,
);

router.patch(
  "/:productId",
  verifyJWTMiddleware,
  requireRoleMiddleware(ROLES.SELLER),
  productController.updateProduct,
);

// Upload new images
router.post(
  "/:productId/images",
  verifyJWTMiddleware,
  requireRoleMiddleware(ROLES.SELLER),
  upload.array("images[]", 5),
  productController.uploadProductImages,
);

// Delete an image
router.delete(
  "/:productId/images/:imageIndex",
  verifyJWTMiddleware,
  requireRoleMiddleware(ROLES.SELLER),
  productController.deleteProductImage,
);

// Change primary image
router.patch(
  "/:productId/images/primary",
  verifyJWTMiddleware,
  requireRoleMiddleware(ROLES.SELLER),
  productController.changePrimaryImage,
);

// --- Get all products (paginated) ---
router.get(
  "/",
  paginationMiddleware(Product),
  productController.listPaginatedProducts,
);

// --- Get products by category (paginated) ---
router.get(
  "/category/:category",
  paginationMiddleware(Product, (req) => ({ category: req.params.category })),
  productController.listPaginatedProducts,
);

// --- Get seller products (paginated) ---
router.get(
  "/seller/products",
  verifyJWTMiddleware,
  requireRoleMiddleware(ROLES.SELLER),
  paginationMiddleware(Product, (req) => ({ sellerId: req.user.userId })),
  productController.listPaginatedProducts,
);

router.get("/:id", productController.getProductById);

router.get("/:id/related", productController.getRelatedProducts);

// Future routes can be added here:
// router.get("/:id", productController.getProductById);
// router.put("/:id", authenticateToken, productController.updateProduct);
// router.get("/seller/products", authenticateToken, productController.getSellerProducts);

export default router;

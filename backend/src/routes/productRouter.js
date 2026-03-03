import express from "express";
import productController from "../controllers/productController.js";
import { createProductValidation } from "../validations/productValidations.js";
import validateRequest from "../middleware/validateRequest.js";
import multer from "multer";
import path from "path";
import verifyJWTMiddleware from "../middleware/auth.js";
import paginationMiddleware from "../middleware/pagination.js";
import { Product } from "../models/associations.js";
import requireRoleMiddleware from "../middleware/requireRole.js";
import { ROLES } from "../constants/roles.js";

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/products/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      req.body.name.replaceAll(" ", "-") +
        "-" +
        uniqueSuffix +
        path.extname(file.originalname),
    );
  },
});

const fileFilter = (req, file, cb) => {
  // Accept images only
  if (
    !file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF|WEBP|webp)$/)
  ) {
    req.fileValidationError = "Only image files are allowed!";
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB max file size
    files: 5, // max 5 files
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
  upload.array("images", 5),
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

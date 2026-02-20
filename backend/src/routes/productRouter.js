import express from "express";
import productController from "../controllers/productController.js";
import { createProductValidation } from "../validations/productValidations.js";
import validateRequest from "../middleware/validateRequest.js";
import multer from "multer";
import path from "path";
import verifyJWTMiddleware from "../middleware/auth.js";
import paginationMiddleware from "../middleware/pagination.js";
import { Product } from "../models/associations.js";

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
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    req.fileValidationError = "Only image files are allowed!";
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
    files: 5, // max 5 files
  },
});

// Create product route (protected, seller only)
router.post(
  "/create",
  verifyJWTMiddleware,
  upload.array("images[]", 5), // Handle up to 5 images
  createProductValidation,
  validateRequest,
  productController.createProduct,
);

router.get("/", paginationMiddleware(Product), productController.getProducts);

router.get(
  "/category/:category",
  paginationMiddleware(Product),
  productController.getProductsByCategory,
);

router.get("/:id", productController.getProductById);

router.get("/:id/related", productController.getRelatedProducts);

// Future routes can be added here:
// router.get("/:id", productController.getProductById);
// router.put("/:id", authenticateToken, productController.updateProduct);
// router.delete("/:id", authenticateToken, productController.deleteProduct);
// router.get("/seller/products", authenticateToken, productController.getSellerProducts);

export default router;

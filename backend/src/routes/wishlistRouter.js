import express from "express";
import wishlistController from "../controllers/wishlistController.js";
import verifyJWTMiddleware from "../middleware/auth.js";

const router = express.Router();

router.get("/", verifyJWTMiddleware, wishlistController.getUserWishlist);

router.post("/add", verifyJWTMiddleware, wishlistController.addToWishlist);

router.delete(
  "/remove/:productId",
  verifyJWTMiddleware,
  wishlistController.removeFromWishlist,
);

export default router;

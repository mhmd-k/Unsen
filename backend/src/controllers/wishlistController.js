import { Product, Wishlist } from "../models/associations.js";

class WishlistController {
  addToWishlist = async (req, res) => {
    const { productId } = req.body;
    const userId = req.user.userId;

    try {
      // Validate product existence
      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      // Prevent duplicates
      const existing = await Wishlist.findOne({
        where: { userId, productId },
      });

      if (existing) {
        return res.status(400).json({
          message: "Product already in wishlist",
        });
      }

      await Wishlist.create({
        userId,
        productId,
      });

      return res.status(201).json({
        message: "Product added to wishlist successfully",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Failed to add product to wishlist",
      });
    }
  };

  removeFromWishlist = async (req, res) => {
    const { productId } = req.params;
    const userId = req.user.userId;

    try {
      const deleted = await Wishlist.destroy({
        where: { userId, productId },
      });

      if (!deleted) {
        return res.status(404).json({
          message: "Product not found in wishlist",
        });
      }

      return res.status(200).json({
        message: "Product removed from wishlist",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Failed to remove product from wishlist",
      });
    }
  };

  getUserWishlist = async (req, res) => {
    const userId = req.user.userId;

    try {
      const wishlistItems = await Wishlist.findAll({
        where: { userId },
        include: [
          {
            model: Product,
            as: "product", // must match association alias
          },
        ],
      });

      return res.status(200).json({
        message: "Wishlist retrieved successfully",
        data: wishlistItems.map((e) => ({
          ...e.product.dataValues,
          images: JSON.parse(e.product.dataValues.images),
        })),
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Failed to retrieve wishlist",
      });
    }
  };
}

export default new WishlistController();

import { Product, User } from "../../models/associations.js";
import jwt from "jsonwebtoken";

class ProductController {
  createProduct = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    try {
      // Validate seller role
      jwt.verify(
        refreshToken,
        process.env.REFRESH_SECRET,
        async (err, decoded) => {
          if (err)
            return res.status(403).json({ message: "Invalid refresh token" });

          const user = await User.findByPk(decoded.userId);
          if (!user) return res.status(404).json({ message: "User not found" });

          const userData = user.get({ plain: true });

          if (userData.role !== "SELLER") {
            return res.status(403).json({
              message: "Only sellers can create products",
            });
          }
        }
      );

      // Get form data fields
      const {
        name,
        description,
        price,
        category,
        brand,
        stock,
        sellerId,
        images,
      } = req.body;

      console.log("req.body: ", req.body);
      console.log("req.files: ", req.files);

      // Create new product
      const product = await Product.create({
        sellerId: sellerId,
        name,
        description,
        images: JSON.stringify(req.files.map((file) => file.filename)),
        price: parseFloat(price),
        category,
        brand,
        stock,
      });

      res.status(201).json({
        message: "Product created successfully",
        product,
      });
    } catch (err) {
      res.status(500).json({
        message: err.message || "Error creating product",
      });
    }
  };

  // Future methods can be added here:
  // - getProducts
  // - getProductById
  // - updateProduct
  // - deleteProduct
  // - getSellerProducts
}

export default new ProductController();

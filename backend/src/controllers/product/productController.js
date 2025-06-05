import { Product } from "../../models/associations.js";

class ProductController {
  createProduct = async (req, res) => {
    try {
      // Validate seller role
      if (req.user.role !== "SELLER") {
        return res.status(403).json({
          message: "Only sellers can create products",
        });
      }

      // Get form data fields
      const { name, description, price, category, brand } = req.body;

      // Handle image files
      const images = req.files ? req.files.map((file) => file.filename) : [];

      // Create new product
      const product = await Product.create({
        sellerId: req.user.id,
        name,
        description,
        images,
        price: parseFloat(price),
        category,
        brand,
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

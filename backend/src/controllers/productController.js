import { Op } from "sequelize";
import { Product, User } from "../models/associations.js";
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
        },
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
        primaryImageIndex,
      } = req.body;

      // Create new product
      const product = await Product.create({
        sellerId: sellerId,
        name,
        description,
        images: JSON.stringify(
          req.files.map(
            (file) => `http://localhost:5000/uploads/products/${file.filename}`,
          ),
        ),
        price: parseFloat(price),
        category,
        brand,
        stock,
        primaryImageIndex,
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

  getProducts = async (req, res) => {
    try {
      res.status(200).json({
        ...res.paginatedResults,
        data: res.paginatedResults.data.map((e) => ({
          ...e,
          images: JSON.parse(e.images),
        })),
        message: "fetched products successfully",
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Error fetching products" });
    }
  };

  getProductsByCategory = async (req, res) => {
    try {
      res.status(200).json({
        ...res.paginatedResults,
        data: res.paginatedResults.data.map((e) => ({
          ...e,
          images: JSON.parse(e.images),
        })),
        message: "fetched products successfully",
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Error fetching products" });
    }
  };

  getProductById = async (req, res) => {
    const { id } = req.params;
    try {
      const product = await Product.findByPk(id);

      const owner = await User.findByPk(product.sellerId);

      res.status(200).json({
        product: { ...product.dataValues, images: JSON.parse(product.images) },
        owner,
        message: "fetched product by id successfully",
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Error fetching products" });
    }
  };

  getRelatedProducts = async (req, res) => {
    const { id } = req.params;
    try {
      const currentProduct = await Product.findByPk(id);

      if (!currentProduct) {
        return res.status(404).json({ message: "Product not found" });
      }

      const relatedProducts = await Product.findAll({
        where: {
          category: currentProduct.category,
          id: { [Op.ne]: id }, // Exclude the current product
        },
        limit: 10,
      });

      const formatted = relatedProducts.map((p) => ({
        ...p.dataValues,
        images: JSON.parse(p.images),
      }));

      res.status(200).json({
        data: formatted,
        message: "Fetched related products successfully",
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Error fetching related products" });
    }
  };

  // Future methods can be added here:
  // - updateProduct
  // - deleteProduct
  // - getSellerProducts
}

export default new ProductController();

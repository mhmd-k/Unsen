import { Op } from "sequelize";
import { OrderItem, Product, User } from "../models/associations.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
import { sequelize } from "../config/db.js";

class ProductController {
  listPaginatedProducts = async (req, res) => {
    try {
      const formattedData = res.paginatedResults.data.map((p) => ({
        ...p,
        images: JSON.parse(p.images || "[]"),
      }));

      res.status(200).json({
        ...res.paginatedResults,
        data: formattedData,
        message: "Products fetched successfully",
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: error.message || "Error fetching products" });
    }
  };

  getSellerProducts = async (req, res) => {
    const sellerId = req.user.userId;

    try {
      const products = await Product.findAll({
        where: { sellerId },
        include: [
          {
            model: OrderItem,
            as: "orderItems",
            attributes: [],
            required: false,
          },
        ],
        attributes: {
          include: [
            [
              sequelize.fn("SUM", sequelize.col("orderItems.quantity")),
              "quantity",
            ],
          ],
        },
        group: ["Product.id"],
      });

      const formattedProducts = products.map((p) => ({
        ...p.dataValues,
        images: JSON.parse(p.images || "[]"),
        soldQuantity: Number(p.dataValues.quantity) || 0,
      }));

      res.status(200).json({
        data: formattedProducts,
        message: "Seller products fetched successfully",
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: error.message || "Error fetching seller products" });
    }
  };

  createProduct = async (req, res) => {
    const sellerId = req.user.userId;

    const {
      name,
      description,
      price,
      category,
      brand,
      stock,
      primaryImageIndex,
      discount,
    } = req.body;

    try {
      const productCount = await Product.count({
        where: {
          sellerId,
        },
      });

      if (productCount >= 5) {
        return res.status(403).json({
          message: "You've reached the limit of uploaded products (max 5).",
        });
      }

      const uploadToCloudinary = (file) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "products" },
            (error, result) => {
              if (error) return reject(error);

              resolve({
                url: result.secure_url,
                public_id: result.public_id,
              });
            },
          );

          streamifier.createReadStream(file.buffer).pipe(stream);
        });
      };

      const uploadedImages = await Promise.all(
        req.files.map(uploadToCloudinary),
      );

      if (
        primaryImageIndex !== undefined &&
        (primaryImageIndex < 0 || primaryImageIndex >= uploadedImages.length)
      ) {
        return res.status(400).json({
          message: "Invalid primary image index",
        });
      }

      // Create new product
      const product = await Product.create({
        sellerId,
        name,
        description,
        images: JSON.stringify(uploadedImages),
        price: parseFloat(price),
        category,
        brand,
        stock,
        primaryImageIndex,
        discount: parseFloat(discount) || 0,
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

  updateProduct = async (req, res) => {
    const productId = req.params.productId;
    const sellerId = req.user.userId;

    // Only allow these fields to be updated
    const {
      name,
      description,
      price,
      category,
      brand,
      stock,
      primaryImageIndex,
      discount,
    } = req.body;

    try {
      // Find product by ID + sellerId to ensure the seller owns it
      const product = await Product.findOne({
        where: {
          id: productId,
          sellerId,
        },
      });

      if (!product)
        return res.status(404).json({ message: "Product not found!" });

      // Update only fields that exist in the request
      if (name !== undefined) product.name = name;
      if (description !== undefined) product.description = description;
      if (price !== undefined) product.price = parseFloat(price);
      if (category !== undefined) product.category = category;
      if (brand !== undefined) product.brand = brand;
      if (stock !== undefined) product.stock = stock;
      if (primaryImageIndex !== undefined)
        product.primaryImageIndex = primaryImageIndex;
      if (discount !== undefined) product.discount = parseFloat(discount);

      await product.save();

      res.status(200).json({
        message: "Product updated successfully",
        product,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: error.message || "Error updating product" });
    }
  };

  // Upload new images
  uploadProductImages = async (req, res) => {
    const productId = req.params.productId;
    const sellerId = req.user.userId;

    try {
      const product = await Product.findOne({
        where: { id: productId, sellerId },
      });
      if (!product)
        return res.status(404).json({ message: "Product not found" });

      const existingImages = JSON.parse(product.images || "[]");
      const newFiles = req.files;

      if (!newFiles || newFiles.length === 0) {
        return res.status(400).json({ message: "No images uploaded" });
      }

      if (existingImages.length + newFiles.length > 5) {
        return res
          .status(400)
          .json({ message: "You can upload at most 5 images per product" });
      }

      const uploadedImages = await Promise.all(
        newFiles.map(uploadToCloudinary),
      );

      const updatedImages = [...existingImages, ...uploadedImages];

      if (product.primaryImageIndex >= updatedImages.length) {
        return res.status(400).json({
          message: "Primary image index is now invalid",
        });
      }

      product.images = JSON.stringify(updatedImages);

      // If there is no primary image, set the first one as primary
      if (
        product.primaryImageIndex === null ||
        product.primaryImageIndex === undefined
      ) {
        product.primaryImageIndex = 0;
      }

      await product.save();

      res.status(200).json({
        message: "Images uploaded successfully",
        images: updatedImages,
        primaryImageIndex: product.primaryImageIndex,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: error.message || "Error uploading images" });
    }
  };

  // Delete an image
  deleteProductImage = async (req, res) => {
    const productId = req.params.productId;
    const sellerId = req.user.userId;
    const imageIndex = parseInt(req.params.imageIndex);

    try {
      const product = await Product.findOne({
        where: { id: productId, sellerId },
      });
      if (!product)
        return res.status(404).json({ message: "Product not found" });

      const images = JSON.parse(product.images || "[]");

      if (images.length === 1) {
        return res.status(400).json({
          message:
            "Cannot delete the only image. At least one image is required",
        });
      }

      if (imageIndex < 0 || imageIndex >= images.length) {
        return res.status(400).json({ message: "Invalid image index" });
      }

      if (product.primaryImageIndex === imageIndex) {
        return res.status(400).json({
          message: "Cannot delete primary image. Change primary image first",
        });
      }

      // Delete the image file from cloudinary
      const imageToDelete = images[imageIndex];
      await cloudinary.uploader.destroy(imageToDelete.public_id);

      // Remove image from array
      images.splice(imageIndex, 1);

      // Adjust primaryImageIndex if needed
      if (product.primaryImageIndex > imageIndex) {
        product.primaryImageIndex -= 1;
      }

      product.images = JSON.stringify(images);
      await product.save();

      res.status(200).json({
        message: "Image deleted successfully",
        images,
        primaryImageIndex: product.primaryImageIndex,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: error.message || "Error deleting image" });
    }
  };

  // Change primary image
  changePrimaryImage = async (req, res) => {
    const productId = req.params.productId;
    const sellerId = req.user.userId;
    const { newPrimaryIndex } = req.body;

    try {
      const product = await Product.findOne({
        where: { id: productId, sellerId },
      });
      if (!product)
        return res.status(404).json({ message: "Product not found" });

      const images = JSON.parse(product.images || "[]");

      if (newPrimaryIndex < 0 || newPrimaryIndex >= images.length) {
        return res.status(400).json({ message: "Invalid image index" });
      }

      product.primaryImageIndex = newPrimaryIndex;
      await product.save();

      res.status(200).json({
        message: "Primary image updated successfully",
        primaryImageIndex: newPrimaryIndex,
        images,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: error.message || "Error updating primary image" });
    }
  };
}

export default new ProductController();

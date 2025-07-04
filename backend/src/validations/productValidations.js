import { body } from "express-validator";

export const createProductValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Product name must be between 3 and 100 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ min: 10, max: 2000 })
    .withMessage("Product description must be between 10 and 2000 characters"),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0.01, max: 999999.99 })
    .withMessage("Price must be between 0.01 and 999999.99"),

  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Category must be between 2 and 50 characters"),

  body("brand")
    .trim()
    .notEmpty()
    .withMessage("Brand is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Brand must be between 2 and 50 characters"),

  body("stock")
    .notEmpty()
    .withMessage("Stock is required")
    .isInt({ min: 1 })
    .withMessage("Stock must be a positive integer"),
];

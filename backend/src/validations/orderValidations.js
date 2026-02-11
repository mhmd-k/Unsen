import { body } from "express-validator";

export const placeOrderValidation = [
  body("userId")
    .notEmpty()
    .withMessage("User ID is required")
    .isInt({ min: 1 })
    .withMessage("User ID must be a positive integer"),

  body("items")
    .isArray({ min: 1 })
    .withMessage("Order must contain at least one item"),

  body("items.*.productId")
    .notEmpty()
    .withMessage("Each item must have a productId")
    .isInt({ min: 1 })
    .withMessage("Product ID must be a positive integer"),

  body("items.*.quantity")
    .notEmpty()
    .withMessage("Each item must specify quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer"),

  body("contact")
    .notEmpty()
    .withMessage("Contact is required")
    .isString({ min: 3 })
    .withMessage("Contact must be of type string (number or email)"),

  body("address")
    .notEmpty()
    .withMessage("Address is required")
    .isString({ min: 3 })
    .withMessage("Address must be of type string"),

  body("apartment")
    .notEmpty()
    .withMessage("Apartment is required")
    .isString({ min: 3 })
    .withMessage("Apartment must be of type string"),

  body("city")
    .notEmpty()
    .withMessage("City is required")
    .isString({ min: 3 })
    .withMessage("City must be of type string"),

  body("state").optional().isString().withMessage("state must be of type string"),

  body("zipCode")
    .notEmpty()
    .withMessage("ZIP code is required")
    .isString({ min: 5 })
    .withMessage("ZIP code must be of type string"),
];

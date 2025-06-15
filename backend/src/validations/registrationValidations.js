import { body } from "express-validator";

export const signupValidation = [
  body("username")
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters"),

  body("email")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),

  body("role")
    .optional()
    .isIn(["CUSTOMER", "SELLER"])
    .withMessage("Role must be either CUSTOMER or SELLER"),

  // Seller-specific validations
  body("bankName")
    .if(body("role").equals("SELLER"))
    .notEmpty()
    .withMessage("Bank name is required for sellers"),

  body("fullName")
    .if(body("role").equals("SELLER"))
    .notEmpty()
    .withMessage("Full name is required for sellers"),

  body("accountNumber")
    .if(body("role").equals("SELLER"))
    .isNumeric()
    .withMessage("Account number must be numeric")
    .isLength({ min: 8, max: 17 })
    .withMessage("Account number must be between 8 and 17 digits"),

  body("routingNumber")
    .if(body("role").equals("SELLER"))
    .isNumeric()
    .withMessage("Routing number must be numeric")
    .isLength({ min: 9, max: 9 })
    .withMessage("Routing number must be exactly 9 digits"),
];

export const verifyEmailValidation = [
  body("token").notEmpty().withMessage("Verification token is required"),
];

export const resendVerificationValidation = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),
];

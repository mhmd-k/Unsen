import User from "./userModel.js";
import SellerBankAccount from "./sellerBankAccountModel.js";
import EmailLog from "./EmailLog.js";
import Product from "./productModel.js";

// Define the one-to-one relationship between User and SellerBankAccount
User.hasOne(SellerBankAccount, {
  foreignKey: "userId",
  as: "bankAccount",
});
SellerBankAccount.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

// Define the one-to-many relationship between User and EmailLog
User.hasMany(EmailLog, { foreignKey: "userId" });
EmailLog.belongsTo(User, { foreignKey: "userId" });

// Define the one-to-many relationship between User and Product
User.hasMany(Product, {
  foreignKey: "sellerId",
  as: "products",
});
Product.belongsTo(User, {
  foreignKey: "sellerId",
  as: "seller",
});

export { User, SellerBankAccount, EmailLog, Product };

import User from "./user.js";
import SellerBankAccount from "./sellerBankAccount.js";
import EmailLog from "./emailLog.js";
import Product from "./product.js";
import OrderItem from "./orderItem.js";
import Order from "./order.js";
import Invoice from "./invoice.js";

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

// Define the many-to-many relationship between Product and Order
Product.belongsToMany(Order, {
  through: OrderItem,
  foreignKey: "productId",
  otherKey: "orderId",
});

Order.belongsToMany(Product, {
  through: OrderItem,
  foreignKey: "orderId",
  otherKey: "productId",
});
OrderItem.belongsTo(Order, {
  foreignKey: "orderId",
});
OrderItem.belongsTo(Product, {
  foreignKey: "productId",
});

// One-to-One relationship between Order and Invoice
Order.hasOne(Invoice, {
  foreignKey: "orderId",
  as: "invoice",
});
Invoice.belongsTo(Order, {
  foreignKey: "orderId",
  as: "order",
});

export {
  User,
  SellerBankAccount,
  EmailLog,
  Product,
  Invoice,
  Order,
  OrderItem,
};

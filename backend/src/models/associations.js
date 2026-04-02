import User from "./user.js";
import SellerBankAccount from "./sellerBankAccount.js";
import EmailLog from "./emailLog.js";
import Product from "./product.js";
import OrderItem from "./orderItem.js";
import Order from "./order.js";
import CustomerInvoice from "./customerInvoice.js";
import SellerInvoice from "./sellerInvoice.js";
import Payment from "./payment.js";
import Wishlist from "./wishlist.js";

// one-to-one relationship between User and SellerBankAccount
User.hasOne(SellerBankAccount, {
  foreignKey: "userId",
  as: "bankAccount",
});
SellerBankAccount.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

// one-to-many relationship between User and EmailLog
User.hasMany(EmailLog, { foreignKey: "userId" });
EmailLog.belongsTo(User, { foreignKey: "userId" });

// one-to-many relationship between User and Product
User.hasMany(Product, {
  foreignKey: "sellerId",
  as: "products",
});
Product.belongsTo(User, {
  foreignKey: "sellerId",
  as: "seller",
});

// one-to-many relationship between User and Order
Order.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});
User.hasMany(Order, {
  foreignKey: "userId",
  as: "orders",
});

// many-to-many relationship between Product and Order through OrderItem
OrderItem.belongsTo(Order, {
  foreignKey: "orderId",
  as: "order",
  onDelete: "CASCADE",
});
OrderItem.belongsTo(Product, {
  foreignKey: "productId",
  as: "product",
  onDelete: "CASCADE",
});
Order.hasMany(OrderItem, {
  foreignKey: "orderId",
  as: "orderItems",
});
Product.hasMany(OrderItem, {
  foreignKey: "productId",
  as: "orderItems",
});

// One-to-One relationship between Order and CustomerInvoice
Order.hasOne(CustomerInvoice, {
  foreignKey: "orderId",
  as: "customerInvoice",
});
CustomerInvoice.belongsTo(Order, {
  foreignKey: "orderId",
  as: "order",
});

// One-to-Many relationship between Order and SellerInvoice
Order.hasMany(SellerInvoice, {
  foreignKey: "orderId",
  as: "sellerInvoices",
});
SellerInvoice.belongsTo(Order, {
  foreignKey: "orderId",
  as: "order",
});

// One-to-Many relationship between Order and Payment
Order.hasMany(Payment, {
  foreignKey: "orderId",
  as: "payments",
});
Payment.belongsTo(Order, {
  foreignKey: "orderId",
  as: "order",
});

// many-to-many relationship between Product and User (Wishlist)
Product.belongsToMany(User, {
  through: Wishlist,
  foreignKey: "productId",
  otherKey: "userId",
});
User.belongsToMany(Product, {
  through: Wishlist,
  foreignKey: "userId",
  otherKey: "productId",
});
Wishlist.belongsTo(User, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  as: "user",
});
Wishlist.belongsTo(Product, {
  foreignKey: "productId",
  onDelete: "CASCADE",
  as: "product",
});

export {
  User,
  SellerBankAccount,
  EmailLog,
  Product,
  CustomerInvoice,
  SellerInvoice,
  Order,
  OrderItem,
  Payment,
  Wishlist,
};

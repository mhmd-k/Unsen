import User from "./userModel.js";
import SellerBankAccount from "./sellerBankAccountModel.js";
import EmailLog from "./EmailLog.js";

// Define the one-to-one relationship between User and SellerBankAccount
User.hasOne(SellerBankAccount, {
  foreignKey: "userId",
  as: "bankAccount",
});
SellerBankAccount.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

// Add EmailLog associations
User.hasMany(EmailLog, { foreignKey: "userId" });
EmailLog.belongsTo(User, { foreignKey: "userId" });

export { User, SellerBankAccount, EmailLog };

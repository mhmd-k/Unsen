import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Payment = sequelize.define(
  "Payment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    // Relation to Order (1 Order → Many Payments)
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Orders",
        key: "id",
      },
      onDelete: "CASCADE",
    },

    // Payment attempt tracking
    attemptNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    // Financial snapshot
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    currency: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "USD",
    },

    // Payment method type (even if fake now)
    paymentMethod: {
      type: DataTypes.ENUM("CREDIT_CARD", "PAYPAL", "BANK_TRANSFER"),
      allowNull: false,
      defaultValue: "CREDIT_CARD",
    },

    // Card snapshot (DO NOT store real full card in real apps)
    cardLast4: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // Payment lifecycle
    status: {
      type: DataTypes.ENUM("PENDING", "SUCCESS", "FAILED"),
      allowNull: false,
      defaultValue: "PENDING",
    },

    processedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  },
);

export default Payment;

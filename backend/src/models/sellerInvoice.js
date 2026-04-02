import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const SellerInvoice = sequelize.define(
  "SellerInvoice",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    // Relation to Order (1-to-many)
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Orders",
        key: "id",
      },
      onDelete: "CASCADE",
    },

    // Professional invoice identifier (NOT DB id)
    invoiceNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    // Invoice lifecycle status
    status: {
      type: DataTypes.ENUM("ISSUED", "VOID", "REFUNDED"),
      allowNull: false,
      defaultValue: "ISSUED",
    },

    issuedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    refundedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  },
);

export default SellerInvoice;

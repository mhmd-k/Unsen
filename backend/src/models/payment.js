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

    // Financial snapshot
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    // Card snapshot
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

import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const EmailLog = sequelize.define(
  "EmailLog",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    type: {
      type: DataTypes.ENUM(["VERIFICATION", "RESET_PASSWORD"]),
      allowNull: false,
      comment: "Type of email (e.g., VERIFICATION, RESET_PASSWORD)",
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

export default EmailLog;

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // o'zingizdagi ulanish

const Statuses = sequelize.define(
  "Statuses",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.ENUM(
        "new",
        "active",
        "in_progress",
        "completed",
        "cancelled"
      ),
      allowNull: false,
    },
  },
  {
    tableName: "statuses",
    timestamps: false, // createdAt, updatedAt bo'lmasa
  }
);

module.exports = Statuses;

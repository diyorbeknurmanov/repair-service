const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");
const Contract = require("./contracts");

const Payment = sequelize.define(
  "payment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    method: {
      type: DataTypes.ENUM("cash", "card", "bank_transfer"),
      allowNull: false,
    },
    paid_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

Contract.hasMany(Payment, { foreignKey: "contract_id" });
Payment.belongsTo(Contract, { foreignKey: "contract_id" });

module.exports = Payment;

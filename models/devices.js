const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");
const Client = require("./clients");

const Devices = sequelize.define(
  "devices",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("TV", "Washer", "Fridge", "AC", "Oven"),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: true, // optional: createdAt, updatedAt qo‘shish uchun
  }
);

// Foreign key relation
Client.hasMany(Devices, { foreignKey: "client_id" });
Devices.belongsTo(Client, { foreignKey: "client_id" });

module.exports = Devices;

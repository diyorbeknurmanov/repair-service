const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");
const Devices = require("./devices");
const Owner = require("./owner");
const Services = require("./services");
const Statuses = require("./statuses");

const Contract = sequelize.define(
  "contract",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    issue_date: {
      type: DataTypes.DATE,
    },
    due_date: {
      type: DataTypes.DATE,
    },
    notes: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

Devices.hasMany(Contract, { foreignKey: "devices_id" });
Contract.belongsTo(Devices, { foreignKey: "devices_id" });

Owner.hasMany(Contract, { foreignKey: "owner_id" });
Contract.belongsTo(Owner, { foreignKey: "owner_id" });

Services.hasMany(Contract, { foreignKey: "services_id" });
Contract.belongsTo(Services, { foreignKey: "services_id" });

Statuses.hasMany(Contract, { foreignKey: "status_id" });
Contract.belongsTo(Statuses, { foreignKey: "status_id" });

module.exports = Contract;

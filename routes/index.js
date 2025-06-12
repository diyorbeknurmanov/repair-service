const admin_routes = require("./admin.routes");
const client_router = require("./client.routes");
const contract_router = require("./contract.routes");
const devices_router = require("./devices.routes");
const owner_router = require("./owner.routes");
const payment_router = require("./payment.routes");
const services_router = require("./services.routes");
const statuses_router = require("./statuses.routes");

const index_router = require("express").Router();

index_router.use("/admin", admin_routes);
index_router.use("/client", client_router);
index_router.use("/owner", owner_router);
index_router.use("/devices", devices_router);
index_router.use("/services", services_router);
index_router.use("/statuses", statuses_router);
index_router.use("/contract", contract_router);
index_router.use("/payment", payment_router);
module.exports = index_router;

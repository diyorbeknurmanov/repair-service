const {
  create,
  getAll,
  getOne,
  update,
  remove,
  getServicesByDateRange,
  getClientsByServiceDateRange,
  getCancelledClientsByDateRange,
} = require("../controllers/contract.controller");

const contract_router = require("express").Router();

contract_router.post("/", create);
contract_router.get("/", getAll);
contract_router.post("/services-range", getServicesByDateRange);
contract_router.post("/client-range", getClientsByServiceDateRange);
contract_router.post("/cancelled-range", getCancelledClientsByDateRange);

contract_router.get("/:id", getOne);
contract_router.patch("/:id", update);
contract_router.delete("/:id", remove);

module.exports = contract_router;

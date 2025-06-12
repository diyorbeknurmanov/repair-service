const {
  create,
  getAll,
  getOne,
  update,
  remove,
} = require("../controllers/payment.controller");

const payment_router = require("express").Router();

payment_router.post("/", create);
payment_router.get("/", getAll);
payment_router.get("/:id", getOne);
payment_router.patch("/:id", update);
payment_router.delete("/:id", remove);

module.exports = payment_router;

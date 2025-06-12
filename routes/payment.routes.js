const {
  create,
  getAll,
  getOne,
  update,
  remove,
} = require("../controllers/payment.controller");

const {
  adminGuard,
  ownerGuard,
  selfGuard,
} = require("../middleware/guards.guard");

const adminJwtGuard = require("../middleware/admin.jwt.guard");
const ownerJwtGuard = require("../middleware/owner.jwt.guard");
const clientJwtGuard = require("../middleware/client.jwt.guard");

const payment_router = require("express").Router();

payment_router.post("/", ownerJwtGuard, ownerGuard, create);

payment_router.get("/", adminJwtGuard, adminGuard, getAll);

payment_router.get("/:id", clientJwtGuard, selfGuard, getOne);

payment_router.patch("/:id", adminJwtGuard, adminGuard, update);

payment_router.delete("/:id", adminJwtGuard, adminGuard, remove);

module.exports = payment_router;

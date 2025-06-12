const {
  create,
  getAll,
  getOne,
  update,
  remove,
} = require("../controllers/devices.controller");

const {
  adminGuard,
  clientGuard,
  selfGuard,
} = require("../middleware/guards.guard");

const adminJwtGuard = require("../middleware/admin.jwt.guard");
const clientJwtGuard = require("../middleware/client.jwt.guard");

const devices_router = require("express").Router();

devices_router.post("/", clientJwtGuard, clientGuard, create);

devices_router.get("/", adminJwtGuard, adminGuard, getAll);

devices_router.get("/:id", clientJwtGuard, selfGuard, getOne);

devices_router.patch("/:id", clientJwtGuard, selfGuard, update);

devices_router.delete("/:id", clientJwtGuard, selfGuard, remove);

module.exports = devices_router;

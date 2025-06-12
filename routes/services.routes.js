const {
  create,
  getAll,
  getOne,
  update,
  remove,
} = require("../controllers/services.controller");

const services_router = require("express").Router();

const adminJwtGuard = require("../middleware/admin.jwt.guard");
const { adminGuard } = require("../middleware/guards.guard");

services_router.post("/", adminJwtGuard, adminGuard, create);

services_router.get("/", getAll);

services_router.get("/:id", getOne);

services_router.patch("/:id", adminJwtGuard, adminGuard, update);

services_router.delete("/:id", adminJwtGuard, adminGuard, remove);

module.exports = services_router;

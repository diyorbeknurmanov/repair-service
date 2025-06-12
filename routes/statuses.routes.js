const {
  create,
  getAll,
  getOne,
  update,
  remove,
} = require("../controllers/statuses.controller");

const statuses_router = require("express").Router();

const adminJwtGuard = require("../middleware/admin.jwt.guard");
const { adminGuard } = require("../middleware/guards.guard");

statuses_router.post("/", adminJwtGuard, adminGuard, create);

statuses_router.get("/", getAll);
statuses_router.get("/:id", getOne);

statuses_router.patch("/:id", adminJwtGuard, adminGuard, update);
statuses_router.delete("/:id", adminJwtGuard, adminGuard, remove);

module.exports = statuses_router;

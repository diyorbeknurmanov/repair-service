const {
  create,
  getAll,
  getOne,
  update,
  remove,
} = require("../controllers/statuses.controller");

const statuses_router = require("express").Router();

statuses_router.post("/", create);
statuses_router.get("/", getAll);
statuses_router.get("/:id", getOne);
statuses_router.patch("/:id", update);
statuses_router.delete("/:id", remove);

module.exports = statuses_router;

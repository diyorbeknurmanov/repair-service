const {
  create,
  getAll,
  getOne,
  update,
  remove,
} = require("../controllers/devices.controller");

const devices_router = require("express").Router();

devices_router.post("/", create);
devices_router.get("/", getAll);
devices_router.get("/:id", getOne);
devices_router.patch("/:id", update);
devices_router.delete("/:id", remove);

module.exports = devices_router;

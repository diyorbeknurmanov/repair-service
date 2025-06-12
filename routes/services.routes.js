const {
  create,
  getAll,
  getOne,
  update,
  remove,
} = require("../controllers/services.controller");

const services_router = require("express").Router();

services_router.post("/", create);
services_router.get("/", getAll);
services_router.get("/:id", getOne);
services_router.patch("/:id", update);
services_router.delete("/:id", remove);

module.exports = services_router;

const {
  register,
  remove,
  login,
  getAll,
  getOne,
  update,
  refreshToken,
  logout,
  ownerActivate,
  changePassword,
} = require("../controllers/owner.controller");

const owner_router = require("express").Router();

owner_router.post("/register", register);
owner_router.post("/login", login);
owner_router.post("/refresh", refreshToken);
owner_router.post("/logout", logout);
owner_router.get("/", getAll);
owner_router.get("/activate/:link", ownerActivate);
owner_router.get("/:id", getOne);
owner_router.patch("/:id", update);
owner_router.patch("/:id/changepass", changePassword);
owner_router.delete("/:id", remove);

module.exports = owner_router;

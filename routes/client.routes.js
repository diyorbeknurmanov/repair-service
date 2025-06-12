const {
  register,
  clientActivate,
  remove,
  login,
  getAll,
  getOne,
  update,
  refreshToken,
  logout,
  changePassword,
} = require("../controllers/client.controller");

const client_router = require("express").Router();

client_router.post("/register", register);
client_router.post("/login", login);
client_router.post("/refresh", refreshToken);
client_router.post("/logout", logout);
client_router.get("/", getAll);
client_router.get("/activate/:link", clientActivate);
client_router.get("/:id", getOne);
client_router.patch("/:id", update);
client_router.patch("/:id/changepass", changePassword);
client_router.delete("/:id", remove);

module.exports = client_router;

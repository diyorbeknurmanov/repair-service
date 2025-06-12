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
const adminJwtGuard = require("../middleware/admin.jwt.guard");
const clientJwtGuard = require("../middleware/client.jwt.guard");

const { clientGuard, selfGuard, adminGuard } = require("../middleware/guards.guard");

const client_router = require("express").Router();

client_router.post("/register", register);
client_router.post("/login", login);
client_router.post("/refresh", refreshToken);
client_router.post("/logout", clientJwtGuard, clientGuard, logout);
client_router.get("/", adminJwtGuard, adminGuard, getAll);
client_router.get("/activate/:link", clientActivate);
client_router.get("/:id", clientJwtGuard, selfGuard, getOne);
client_router.patch("/:id", clientJwtGuard, selfGuard, update);
client_router.patch(
  "/:id/changepass",
  clientJwtGuard,
  selfGuard,
  changePassword
);
client_router.delete("/:id", clientJwtGuard, selfGuard, remove);

module.exports = client_router;

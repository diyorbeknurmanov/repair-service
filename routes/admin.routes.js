const {
  register,
  login,
  getAll,
  getOne,
  update,
  changePassword,
  remove,
  logout,
  refreshToken,
} = require("../controllers/admin.controller");
const adminJwtGuard = require("../middleware/admin.jwt.guard");
const { adminGuard, selfGuard } = require("../middleware/guards.guard");

const admin_routes = require("express").Router();

admin_routes.post("/register", register);
admin_routes.post("/login", login);
admin_routes.post("/refresh", refreshToken);

admin_routes.post("/logout", adminJwtGuard, adminGuard, logout);

admin_routes.get("/", adminJwtGuard, adminGuard, getAll);

admin_routes.get("/:id", adminJwtGuard, selfGuard, getOne);

admin_routes.patch("/:id", adminJwtGuard, selfGuard, update);

admin_routes.patch("/:id/changepass", adminJwtGuard, selfGuard, changePassword);

admin_routes.delete("/:id", adminJwtGuard, adminGuard, remove);

module.exports = admin_routes;

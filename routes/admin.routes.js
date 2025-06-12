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

const admin_routes = require("express").Router();

admin_routes.post("/register", register);
admin_routes.post("/login", login);
admin_routes.post("/logout", logout);
admin_routes.post("/refresh", refreshToken);
admin_routes.get("/", getAll);
admin_routes.get("/:id", getOne);
admin_routes.patch("/:id", update);
admin_routes.patch("/:id/changepass", changePassword);
admin_routes.delete("/:id", remove);

module.exports = admin_routes;

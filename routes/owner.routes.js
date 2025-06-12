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

const ownerJwtGuard = require("../middleware/owner.jwt.guard");
const {
  ownerGuard,
  selfGuard,
  adminGuard,
} = require("../middleware/guards.guard");
const adminJwtGuard = require("../middleware/admin.jwt.guard");

const owner_router = require("express").Router();

owner_router.post("/register", register);
owner_router.post("/login", login);
owner_router.post("/refresh", refreshToken);

owner_router.post("/logout", ownerJwtGuard, ownerGuard, logout);

owner_router.get("/", adminJwtGuard, adminGuard, getAll);
owner_router.get("/activate/:link", ownerActivate);

owner_router.get("/:id", ownerJwtGuard, selfGuard, getOne);
owner_router.patch("/:id", ownerJwtGuard, selfGuard, update);
owner_router.patch("/:id/changepass", ownerJwtGuard, selfGuard, changePassword);

owner_router.delete("/:id", ownerJwtGuard, ownerGuard, remove);

module.exports = owner_router;

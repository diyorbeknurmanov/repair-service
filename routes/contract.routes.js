const {
  create,
  getAll,
  getOne,
  update,
  remove,
  getServicesByDateRange,
  getClientsByServiceDateRange,
  getCancelledClientsByDateRange,
  getTopOwnersByServiceName,
} = require("../controllers/contract.controller");

const contract_router = require("express").Router();

const adminJwtGuard = require("../middleware/admin.jwt.guard");
const ownerJwtGuard = require("../middleware/owner.jwt.guard");
const clientJwtGuard = require("../middleware/client.jwt.guard");
const {
  adminGuard,
  creatorGuard,
  selfGuard,
} = require("../middleware/guards.guard");

const adminOrOwnerJwtGuard = async (req, res, next) => {
  try {
    await adminJwtGuard(req, res, () => {});
    if (req.admin) return next();
  } catch {}

  try {
    await ownerJwtGuard(req, res, () => {});
    if (req.owner) return next();
  } catch {}

  return res
    .status(401)
    .json({ message: "Admin yoki owner bo‘lishingiz kerak" });
};

const anyUserGuard = async (req, res, next) => {
  try {
    await adminJwtGuard(req, res, () => {});
    if (req.admin) return next();
  } catch {}

  try {
    await ownerJwtGuard(req, res, () => {});
    if (req.owner) return next();
  } catch {}

  try {
    await clientJwtGuard(req, res, () => {});
    if (req.client) return next();
  } catch {}

  return res.status(401).json({ message: "Ruxsat yo‘q!" });
};


contract_router.post("/", adminOrOwnerJwtGuard, create);

contract_router.get("/", adminJwtGuard, adminGuard, getAll);

contract_router.post(
  "/services-range",
  adminJwtGuard,
  adminGuard,
  getServicesByDateRange
)
contract_router.post(
  "/client-range",
  adminJwtGuard,
  adminGuard,
  getClientsByServiceDateRange
);
contract_router.post(
  "/cancelled-range",
  adminJwtGuard,
  adminGuard,
  getCancelledClientsByDateRange
);
contract_router.post(
  "/owner-range",
  adminJwtGuard,
  adminGuard,
  getTopOwnersByServiceName
);

contract_router.get("/:id", anyUserGuard, selfGuard, getOne);

contract_router.patch("/:id", adminOrOwnerJwtGuard, creatorGuard, update);

contract_router.delete("/:id", adminJwtGuard, adminGuard, remove);

module.exports = contract_router;

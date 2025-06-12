const Contract = require("../models/contracts");

const adminGuard = (req, res, next) => {
  const user = req.admin || req.user;
  if (!user || user.role !== "admin") {
    return res.status(403).json({ message: "Faqat adminlar uchun!" });
  }
  next();
};

const ownerGuard = (req, res, next) => {
  const user = req.owner || req.user;
  if (!user || user.role !== "owner") {
    return res.status(403).json({ message: "Faqat ustalar uchun!" });
  }
  next();
};

const clientGuard = (req, res, next) => {
  const user = req.client || req.user;
  if (!user || user.role !== "client") {
    return res.status(403).json({ message: "Faqat mijozlar uchun!" });
  }
  next();
};
const selfGuard = (req, res, next) => {
  const { id } = req.params;
  const user = req.admin || req.owner || req.client || req.user;

  if (!user) {
    return res.status(401).json({ message: "Foydalanuvchi aniqlanmadi!" });
  }

  const isSelf = parseInt(id) === user.id;
  const isAdmin = user.role === "admin";

  if (!isSelf && !isAdmin) {
    return res
      .status(403)
      .json({ message: "Faqat o‘zingizga tegishli resursga kira olasiz!" });
  }

  next();
};

const creatorGuard = async (req, res, next) => {
  try {
    const id = req.params.id;
    const contract = await Contract.findByPk(id);

    if (!contract) {
      return res.status(404).json({ message: "Contract topilmadi" });
    }

    // Admin bo‘lsa — o‘tkazamiz
    if (req.admin) return next();

    // Owner bo‘lsa va contract u yaratgan bo‘lsa — o‘tkazamiz
    if (req.owner && contract.owner_id === req.owner.id) {
      return next();
    }

    return res
      .status(403)
      .json({ message: "Faqat creator yoki admin o‘zgartira oladi" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Ichki xatolik" });
  }
};

module.exports = {
  adminGuard,
  ownerGuard,
  clientGuard,
  selfGuard,
  creatorGuard,
};

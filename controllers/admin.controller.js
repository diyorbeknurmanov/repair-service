const { sendErrorResponse } = require("../helpers/send_error_response");
const Admin = require("../models/admins");
const { adminJwtService } = require("../service/jwt.service");
const adminValidation = require("../validations/admin.validation");
const bcrypt = require("bcrypt");
const config = require("config");

// register qism
const register = async (req, res) => {
  try {
    const { error, value } = adminValidation.validate(req.body);
    if (error) {
      return res.status(400).send({ error: error.message });
    }
    const { full_name, email, password } = value;
    const existingAdmin = await Admin.findOne({ where: { email } });
    if (existingAdmin) {
      return res
        .status(400)
        .send({ message: "Bu email bilan admin allaqachon ro'yxatdan o'tgan" });
    }
    const hashPass = await bcrypt.hash(password, 7);
    const newAdmin = await Admin.create({
      full_name,
      email,
      password: hashPass,
    });
    res.status(201).send({
      message: "Admin muvaffaqiyatli ro'yxatdan o'tdi",
      admin: {
        id: newAdmin.id,
        full_name: newAdmin.full_name,
        email: newAdmin.email,
      },
    });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

// login qism
const login = async (req, res) => {
  try {
    // Login uchun faqat email va password kerak
    const { error, value } = adminValidation.validateLogin(req.body);
    if (error) {
      return res.status(400).send({ error: error.message });
    }
    const { email, password } = value;
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res
        .status(400)
        .send({ message: "Email yoki password noto'g'ri!" });
    }
    const isMatchPass = await bcrypt.compare(password, admin.password);
    if (!isMatchPass) {
      return res
        .status(400)
        .send({ message: "Email yoki password noto'g'ri!" });
    }
    const payload = {
      id: admin.id,
      email: admin.email,
    };
    const tokens = adminJwtService.generateTokens(payload);
    admin.refresh_token = tokens.refreshToken;
    await admin.save();
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("admin_cookie_refresh_time"),
    });
    res.status(200).send({
      message: "Tizimga xush kelibsiz",
      id: admin.id,
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getAll = async (req, res) => {
  try {
    const findAll = await Admin.findAll({
      attributes: { exclude: ["password", "refresh_token"] }, // Parolni ko'rsatmaslik
    });
    res.status(200).send({ message: "Hamma adminlar: ", findAll });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getOne = async (req, res) => {
  const { id } = req.params;
  try {
    const admin = await Admin.findByPk(id, {
      attributes: { exclude: ["password", "refresh_token"] }, // Parolni ko'rsatmaslik
    });
    if (!admin) {
      return res.status(400).send({ message: "bunday admin topilmadi" });
    }
    res.status(200).send({ admin });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  try {
    // Update uchun alohida validatsiya
    const { error, value } = adminValidation.validateUpdate(req.body);
    if (error) {
      return res.status(400).send({ error: error.message });
    }

    const admin = await Admin.findByPk(id);
    if (!admin) {
      return res.status(400).send({ message: "bunday admin topilmadi" });
    }

    // Email unique ekanligini tekshirish (agar yangi email berilgan bo'lsa)
    if (value.email && value.email !== admin.email) {
      const existingAdmin = await Admin.findOne({
        where: {
          email: value.email,
          id: { [require("sequelize").Op.ne]: id }, // O'z ID sini chiqarib tashlash
        },
      });
      if (existingAdmin) {
        return res.status(400).send({
          message: "Bu email bilan boshqa admin allaqachon ro'yxatdan o'tgan",
        });
      }
    }

    // Faqat berilgan maydonlarni yangilash
    const updateData = {};
    if (value.full_name) updateData.full_name = value.full_name;
    if (value.email) updateData.email = value.email;

    await admin.update(updateData);

    // Yangilangan adminni parolsiz qaytarish
    const updatedAdmin = await Admin.findByPk(id, {
      attributes: { exclude: ["password", "refresh_token"] },
    });

    res.status(200).send({
      message: "Admin muvaffaqiyatli yangilandi",
      admin: updatedAdmin,
    });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const changePassword = async (req, res) => {
  const { id } = req.params;
  try {
    const { error, value } = adminValidation.validateChangePassword(req.body);
    if (error) {
      return res.status(400).send({ error: error.message });
    }

    const { password, newPassword } = value;

    const admin = await Admin.findByPk(id);
    if (!admin) {
      return res.status(400).send({ message: "Bunday admin topilmadi" });
    }

    const isMatchPass = await bcrypt.compare(password, admin.password);
    if (!isMatchPass) {
      return res.status(400).send({ message: "Eski parol noto'g'ri" });
    }

    const hashPass = await bcrypt.hash(newPassword, 7);

    await admin.update({ password: hashPass });

    res.status(200).send({ message: "password o'zgartirildi!..." });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const remove = async (req, res) => {
  const { id } = req.params;
  try {
    const admin = await Admin.findByPk(id);
    if (!admin) {
      return res.status(400).send({ message: "Bunday admin topilmadi" });
    }

    await admin.destroy();

    res.status(200).send({ message: "admin o'chirildi!..." });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};
const logout = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res
        .status(401)
        .send({ message: "Cookieda refresh token topilmadi" });
    }

    const admin = await Admin.findOne({
      where: { refresh_token: refreshToken },
    });

    if (!admin) {
      return res.status(403).send({ message: "Token noto'g'ri" });
    }

    admin.refresh_token = null;
    await admin.save();

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false, // HTTPS bo‘lsa true, aks holda false
      sameSite: "Strict",
    });

    res.status(200).send({ message: "Admin tizimdan chiqdi" });
  } catch (error) {
    return sendErrorResponse(error, res);
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res
        .status(401)
        .send({ message: "Cookieda refresh token topilmadi" });
    }

    await adminJwtService.verifyRefreshToken(refreshToken);

    const admin = await Admin.findOne({
      where: { refresh_token: refreshToken },
    });
    if (!admin) {
      return res.status(401).send({ message: "Refresh token topilmadi" });
    }

    const payload = {
      id: admin.id,
      email: admin.email,
    };
    const tokens = adminJwtService.generateTokens(payload);
    admin.refresh_token = tokens.refreshToken;

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("admin_cookie_refresh_time"),
    });

    res.status(201).send({
      message: "Tokenlar yangilandi",
      id: admin.id,
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

module.exports = {
  register,
  login,
  getAll,
  getOne,
  update,
  changePassword,
  remove,
  logout,
  refreshToken,
};

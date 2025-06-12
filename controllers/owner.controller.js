const { sendErrorResponse } = require("../helpers/send_error_response");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const config = require("config");
const ownerValidation = require("../validations/owner.validation");
const { ownerMailService } = require("../service/mail.service");
const Owner = require("../models/owner");
const { ownerJwtService } = require("../service/jwt.service");
const Contract = require("../models/contracts");

const register = async (req, res) => {
  try {
    const { error, value } = ownerValidation.validate(req.body);
    if (error) {
      return res.status(200).send({ error: error.message });
    }
    const { full_name, phone, email, password, address, is_active } = value;
    const existingowner = await Owner.findOne({ where: { email } });
    if (existingowner) {
      return res
        .status(400)
        .send({ message: "bunday Owner Avval royxatdan otgan..." });
    }
    const hashPass = await bcrypt.hash(password, 7);
    const activation_link = uuid.v4();
    const newOwner = {
      full_name,
      phone,
      email,
      password: hashPass,
      address,
      is_active,
      activation_link,
    };

    const createdOwner = await Owner.create(newOwner);

    const link = `${config.get(
      "api_url"
    )}/api/owner/activate/${activation_link}`;
    await ownerMailService.sendMail(value.email, link);

    res.status(201).send({
      message: "Owner muvaffaqiyatli ro'yxatdan otdi!...",
      newOwner: createdOwner,
    });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const login = async (req, res) => {
  try {
    const { error, value } = ownerValidation.validateLogin(req.body);
    if (error) {
      return res.status(400).send({ error: error.message });
    }
    const { email, password } = value;

    const owner = await Owner.findOne({ where: { email } });
    if (!owner) {
      return res
        .status(400)
        .send({ message: "Email yoki password noto'g'ri!" });
    }
    const isMatchPass = await bcrypt.compare(password, owner.password);
    if (!isMatchPass) {
      return res
        .status(400)
        .send({ message: "Email yoki password noto'g'ri!" });
    }
    const payload = {
      id: owner.id,
      email: owner.email,
    };
    const tokens = ownerJwtService.generateTokens(payload);
    owner.refresh_token = tokens.refreshToken;
    await owner.save();
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("owner_cookie_refresh_time"),
    });
    res.status(200).send({
      message: "Tizimga xush kelibsiz",
      id: owner.id,
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getAll = async (req, res) => {
  try {
    const findAll = await Owner.findAll({
      include: [
        { model: Contract, attributes: ["issue_date", "due_date", "notes"] },
      ],
      attributes: { exclude: ["password", "refresh_token"] },
    });
    res.status(200).send({ findAll });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getOne = async (req, res) => {
  const { id } = req.params;
  try {
    const owner = await Owner.findByPk(id, {
      include: [
        { model: Contract, attributes: ["issue_date", "due_date", "notes"] },
      ],
      attributes: { exclude: ["password", "refresh_token"] },
    });
    if (!owner) {
      return res.status(400).send({ message: "bunday owner topilmadi" });
    }

    res.status(200).send({ owner });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  try {
    const { error, value } = ownerValidation.validateUpdate(req.body);
    if (error) {
      return res.status(200).send({ error: error.message });
    }

    const owner = await Owner.findByPk(id);
    if (!owner) {
      return res.status(400).send({ message: "bunday owner topilmadi" });
    }

    if (value.email && value.email !== owner.email) {
      const existingowner = await Owner.findOne({
        where: {
          email: value.email,
          id: { [require("sequelize").Op.ne]: id },
        },
      });
      if (existingowner) {
        return res.status(400).send({
          message: "Bu email bilan boshqa owner allaqachon ro'yxatdan o'tgan",
        });
      }
    }

    const updateData = {};
    if (value.full_name) updateData.full_name = value.full_name;
    if (value.phone) updateData.phone = value.phone;
    if (value.email) updateData.email = value.email;
    if (value.address) updateData.address = value.address;
    if (value.is_active) updateData.is_active = value.is_active;

    await owner.update(updateData);

    const updateowner = await Owner.findByPk(id, {
      attributes: { exclude: ["password", "refresh_token"] },
    });

    res.status(200).send({ message: "Clinet yangilandi", owner: updateowner });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const remove = async (req, res) => {
  const { id } = req.params;
  try {
    const owner = await Owner.findByPk(id);
    if (!owner) {
      return res.status(400).send({ message: "Bunday owner topilmadi" });
    }

    await owner.destroy();

    res.status(200).send({ message: "owner o'chirildi!..." });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const ownerActivate = async (req, res) => {
  try {
    const { link } = req.params; // to'g'ri joydan olinmoqda
    const owner = await Owner.findOne({ where: { activation_link: link } }); // Sequelize uchun 'where' ishlatiladi
    if (!owner) {
      return res.status(400).send({ message: "Avtor link noto'g'ri" });
    }

    if (owner.is_active) {
      return res.status(400).send({ message: "Avtor avval faollashtirilgan" });
    }

    owner.is_active = true;
    await owner.save();
    res.send({ message: "Avtor faollashtirildi" });
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

    const owner = await Owner.findOne({
      where: { refresh_token: refreshToken },
    });

    if (!owner) {
      return res.status(403).send({ message: "Token noto'g'ri" });
    }

    owner.refresh_token = null;
    await owner.save();

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false, // HTTPS bo‘lsa true, aks holda false
      sameSite: "Strict",
    });

    res.status(200).send({ message: "Owner tizimdan chiqdi" });
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

    await ownerJwtService.verifyRefreshToken(refreshToken);

    const owner = await Owner.findOne({
      where: { refresh_token: refreshToken },
    });
    if (!owner) {
      return res.status(401).send({ message: "Refresh token topilmadi" });
    }

    const payload = {
      id: owner.id,
      email: owner.email,
    };
    const tokens = ownerJwtService.generateTokens(payload);
    owner.refresh_token = tokens.refreshToken;

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("owner_cookie_refresh_time"),
    });

    res.status(201).send({
      message: "Tokenlar yangilandi",
      id: owner.id,
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const changePassword = async (req, res) => {
  const { id } = req.params;
  try {
    const { error, value } = ownerValidation.validateChangePassword(req.body);
    if (error) {
      return res.status(400).send({ error: error.message });
    }

    const { password, newPassword } = value;

    const owner = await Owner.findByPk(id);
    if (!owner) {
      return res.status(400).send({ message: "Bunday owner topilmadi" });
    }

    const isMatchPass = await bcrypt.compare(password, owner.password);
    if (!isMatchPass) {
      return res.status(400).send({ message: "Eski parol noto'g'ri" });
    }

    const hashPass = await bcrypt.hash(newPassword, 7);

    await owner.update({ password: hashPass });

    res.status(200).send({ message: "password o'zgartirildi!..." });
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
  remove,
  ownerActivate,
  logout,
  refreshToken,
  changePassword,
};

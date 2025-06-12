const { sendErrorResponse } = require("../helpers/send_error_response");
const Client = require("../models/clients");
const { clientMailService } = require("../service/mail.service");
const clientValidation = require("../validations/client.validation");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const config = require("config");
const { clientJwtService } = require("../service/jwt.service");
const { required } = require("joi");
const Devices = require("../models/devices");

const register = async (req, res) => {
  try {
    const { error, value } = clientValidation.validate(req.body);
    if (error) {
      return res.status(200).send({ error: error.message });
    }
    const { full_name, phone, email, password, address, is_active } = value;
    const existingClient = await Client.findOne({ where: { email } });
    if (existingClient) {
      return res
        .status(400)
        .send({ message: "bunday Client Avval royxatdan otgan..." });
    }
    const hashPass = await bcrypt.hash(password, 7);
    const activation_link = uuid.v4();
    const newClient = {
      full_name,
      phone,
      email,
      password: hashPass,
      address,
      is_active,
      activation_link,
    };

    const createdClient = await Client.create(newClient);

    const link = `${config.get(
      "api_url"
    )}/api/client/activate/${activation_link}`;
    await clientMailService.sendMail(value.email, link);

    res.status(201).send({
      message: "Client muvaffaqiyatli ro'yxatdan otdi!...",
      newClient: createdClient,
    });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const login = async (req, res) => {
  try {
    const { error, value } = clientValidation.validateLogin(req.body);
    if (error) {
      return res.status(400).send({ error: error.message });
    }
    const { email, password } = value;

    const client = await Client.findOne({ where: { email } });
    if (!client) {
      return res
        .status(400)
        .send({ message: "Email yoki password noto'g'ri!" });
    }
    const isMatchPass = await bcrypt.compare(password, client.password);
    if (!isMatchPass) {
      return res
        .status(400)
        .send({ message: "Email yoki password noto'g'ri!" });
    }
    const payload = {
      id: client.id,
      email: client.email,
    };
    const tokens = clientJwtService.generateTokens(payload);
    client.refresh_token = tokens.refreshToken;
    await client.save();
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("client_cookie_refresh_time"),
    });
    res.status(200).send({
      message: "Tizimga xush kelibsiz",
      id: client.id,
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getAll = async (req, res) => {
  try {
    const findAll = await Client.findAll({
      include: [{ model: Devices, attributes: ["brand", "type"] }],
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
    const client = await Client.findByPk(id, {
      include: [{ model: Devices, attributes: ["brand", "type"] }],
      attributes: {
        exclude: [
          "password",
          "refresh_token",
          "createdAt",
          "updatedAt",
          "activation_link",
        ],
      },
    });
    if (!client) {
      return res.status(400).send({ message: "bunday client topilmadi" });
    }

    res.status(200).send({ client });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  try {
    const { error, value } = clientValidation.validateUpdate(req.body);
    if (error) {
      return res.status(200).send({ error: error.message });
    }

    const client = await Client.findByPk(id);
    if (!client) {
      return res.status(400).send({ message: "bunday client topilmadi" });
    }

    if (value.email && value.email !== client.email) {
      const existingClient = await Client.findOne({
        where: {
          email: value.email,
          id: { [require("sequelize").Op.ne]: id },
        },
      });
      if (existingClient) {
        return res.status(400).send({
          message: "Bu email bilan boshqa client allaqachon ro'yxatdan o'tgan",
        });
      }
    }

    const updateData = {};
    if (value.full_name) updateData.full_name = value.full_name;
    if (value.phone) updateData.phone = value.phone;
    if (value.email) updateData.email = value.email;
    if (value.address) updateData.address = value.address;
    if (value.is_active) updateData.is_active = value.is_active;

    await client.update(updateData);

    const updateClient = await Client.findByPk(id, {
      attributes: { exclude: ["password", "refresh_token"] },
    });

    res
      .status(200)
      .send({ message: "Clinet yangilandi", client: updateClient });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const remove = async (req, res) => {
  const { id } = req.params;
  try {
    const client = await Client.findByPk(id);
    if (!client) {
      return res.status(400).send({ message: "Bunday client topilmadi" });
    }

    await client.destroy();

    res.status(200).send({ message: "client o'chirildi!..." });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const clientActivate = async (req, res) => {
  try {
    const { link } = req.params; // to'g'ri joydan olinmoqda
    const client = await Client.findOne({ where: { activation_link: link } }); // Sequelize uchun 'where' ishlatiladi
    if (!client) {
      return res.status(400).send({ message: "Avtor link noto'g'ri" });
    }

    if (client.is_active) {
      return res.status(400).send({ message: "Avtor avval faollashtirilgan" });
    }

    client.is_active = true;
    await client.save();
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

    const client = await Client.findOne({
      where: { refresh_token: refreshToken },
    });

    if (!client) {
      return res.status(403).send({ message: "Token noto'g'ri" });
    }

    client.refresh_token = null;
    await client.save();

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false, // HTTPS bo‘lsa true, aks holda false
      sameSite: "Strict",
    });

    res.status(200).send({ message: "Client tizimdan chiqdi" });
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

    await clientJwtService.verifyRefreshToken(refreshToken);

    const client = await Client.findOne({
      where: { refresh_token: refreshToken },
    });
    if (!client) {
      return res.status(401).send({ message: "Refresh token topilmadi" });
    }

    const payload = {
      id: client.id,
      email: client.email,
    };
    const tokens = clientJwtService.generateTokens(payload);
    client.refresh_token = tokens.refreshToken;

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("client_cookie_refresh_time"),
    });

    res.status(201).send({
      message: "Tokenlar yangilandi",
      id: client.id,
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const changePassword = async (req, res) => {
  const { id } = req.params;
  try {
    // Validatsiya
    const { error, value } = clientValidation.validateChangePassword(req.body);
    if (error) {
      return res.status(400).send({ message: error.message });
    }

    const { password, newPassword } = value;

    // Foydalanuvchini topish
    const client = await Client.findByPk(id);
    if (!client) {
      return res.status(404).send({ message: "Bunday client topilmadi" });
    }

    // Parolni solishtirish
    const isMatchPass = await bcrypt.compare(password, client.password);
    if (!isMatchPass) {
      return res.status(400).send({ message: "Eski parol noto'g'ri" });
    }

    // Yangi parolni xesh qilish
    if (!newPassword) {
      return res.status(400).send({ message: "Yangi parol kiritilmadi" });
    }

    const hashPass = await bcrypt.hash(newPassword, 10); // 10 - tavsiya etilgan saltRounds

    // Parolni yangilash
    await client.update({ password: hashPass });

    res.status(200).send({ message: "Parol muvaffaqiyatli o'zgartirildi!" });
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
  clientActivate,
  logout,
  refreshToken,
  changePassword,
};

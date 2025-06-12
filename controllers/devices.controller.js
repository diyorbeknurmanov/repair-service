const { sendErrorResponse } = require("../helpers/send_error_response");
const Client = require("../models/clients");
const Contract = require("../models/contracts");
const Devices = require("../models/devices");
const devicesValidation = require("../validations/devices.validation");

const create = async (req, res) => {
  try {
    const { error, value } = devicesValidation.validateDevice(req.body);
    if (error) {
      return res.status(400).send({ message: error.message });
    }

    const { client_id, brand, model, type } = value;
    const client = await Client.findByPk(client_id);
    if (!client) {
      return res.status(400).send({ message: "Bunday client mavjud emas!..." });
    }

    const newDevices = await Devices.create({ client_id, brand, model, type });
    res
      .status(201)
      .send({ message: "Yangi Devices qo'shildi!...", newDevices });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getAll = async (req, res) => {
  try {
    const devices = await Devices.findAll({
      include: [
        { model: Client, attributes: ["full_name", "address", "phone"] },
        { model: Contract, attributes: ["issue_date", "due_date", "notes"] },
      ],
    });
    res.status(200).send({ devices });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getOne = async (req, res) => {
  const { id } = req.params;
  try {
    const device = await Devices.findByPk(id, {
      include: [
        {
          model: Client,
          attributes: ["full_name", "address", "phone"],
        },
        { model: Contract, attributes: ["issue_date", "due_date", "notes"] },
      ],
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    if (!device) {
      return res.status(404).json({ message: "Qurilma topilmadi." });
    }

    res.status(200).json(device);
  } catch (error) {
    console.error("GetOne Error:", error);
    res.status(500).json({ message: "Server xatosi", error: error.message });
  }
};
const update = async (req, res) => {
  const { id } = req.params;

  try {
    const { error, value } = devicesValidation.validateDeviceUpdate(req.body);
    if (error) {
      return res.status(400).send({ message: error.message });
    }

    const { client_id, brand, model, address, is_active } = value;

    const device = await Devices.findByPk(id);
    if (!device) {
      return res.status(404).json({ message: "Bunday qurilma topilmadi." });
    }

    if (client_id) {
      const client = await Client.findByPk(client_id);
      if (!client) {
        return res.status(404).send({ message: "Bunday client mavjud emas." });
      }
    }

    const updateData = {};
    if (client_id !== undefined) updateData.client_id = client_id;
    if (brand !== undefined) updateData.brand = brand;
    if (model !== undefined) updateData.model = model;
    if (address !== undefined) updateData.address = address;
    if (is_active !== undefined) updateData.is_active = is_active;

    await device.update(updateData);

    res
      .status(200)
      .send({ message: "Qurilma muvaffaqiyatli yangilandi.", device });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).send({ message: "Server xatosi", error: error.message });
  }
};

const remove = async (req, res) => {
  const { id } = req.params;

  try {
    const device = await Devices.findByPk(id);
    if (!device) {
      return res.status(404).send({ message: "Qurilma topilmadi." });
    }

    await device.destroy(); // Qurilmani o'chirish

    res.status(200).send({ message: "Qurilma o'chirildi." });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

module.exports = {
  create,
  getAll,
  getOne,
  update,
  remove,
};

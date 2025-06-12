const { sendErrorResponse } = require("../helpers/send_error_response");
const Contract = require("../models/contracts");
const Devices = require("../models/devices");
const Owner = require("../models/owner");
const Services = require("../models/services");
const Statuses = require("../models/statuses");
const { Op } = require("sequelize");

const {
  contractValidate,
  contractUpdateValidate,
} = require("../validations/contract.validation");
const Client = require("../models/clients");

const create = async (req, res) => {
  try {
    const { error, value } = contractValidate.validate(req.body);
    if (error) return res.status(400).send({ message: error.message });

    const {
      issue_date,
      due_date,
      notes,
      devices_id,
      owner_id,
      services_id,
      status_id,
    } = value;

    // Foreign key tekshiruvlari
    const [device, owner, service, status] = await Promise.all([
      Devices.findByPk(devices_id),
      Owner.findByPk(owner_id),
      Services.findByPk(services_id),
      Statuses.findByPk(status_id),
    ]);

    if (!device)
      return res
        .status(400)
        .send({ message: "Bunday qurilma (Device) mavjud emas" });
    if (!owner)
      return res
        .status(400)
        .send({ message: "Bunday egasi (Owner) mavjud emas" });
    if (!service)
      return res
        .status(400)
        .send({ message: "Bunday xizmat (Service) mavjud emas" });
    if (!status)
      return res.status(400).send({ message: "Bunday status mavjud emas" });

    const newContract = await Contract.create({
      issue_date,
      due_date,
      notes,
      devices_id,
      owner_id,
      services_id,
      status_id,
    });

    return res.status(201).send(newContract);
  } catch (err) {
    sendErrorResponse(err, res);
  }
};

const getAll = async (req, res) => {
  try {
    const contracts = await Contract.findAll({
      include: [
        { model: Devices, attributes: ["brand", "type"] },
        { model: Owner, attributes: ["full_name", "phone", "address"] },
        { model: Services, attributes: ["name", "price", "description"] },
        { model: Statuses, attributes: ["name"] },
      ],
      attributes: {
        exclude: ["devices_id", "owner_id", "services_id", "status_id"],
      },
    });

    return res.status(200).send({ contracts });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getOne = async (req, res) => {
  const { id } = req.params;
  try {
    const contract = await Contract.findByPk(id, {
      include: [
        { model: Devices, attributes: ["brand", "type"] },
        { model: Owner, attributes: ["full_name", "phone", "address"] },
        { model: Services, attributes: ["name", "price", "description"] },
        { model: Statuses, attributes: ["name"] },
      ],
      attributes: {
        exclude: ["devices_id", "owner_id", "services_id", "status_id"],
      },
    });

    if (!contract) {
      return res.status(404).send({ message: "Bunday contract mavjud emas" });
    }

    return res.status(200).send({ contract });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const update = async (req, res) => {
  const { id } = req.params;

  try {
    const { error, value } = contractUpdateValidate.validate(req.body);
    if (error) return res.status(400).send({ message: error.message });

    const {
      issue_date,
      due_date,
      notes,
      devices_id,
      owner_id,
      services_id,
      status_id,
    } = value;

    const contract = await Contract.findByPk(id);
    if (!contract) {
      return res.status(404).send({ message: "Bunday contract mavjud emas" });
    }

    // Faqat mavjud bo‘lsa tekshiradi
    if (devices_id) {
      const device = await Devices.findByPk(devices_id);
      if (!device)
        return res
          .status(400)
          .send({ message: "Bunday qurilma (Device) mavjud emas" });
    }

    if (owner_id) {
      const owner = await Owner.findByPk(owner_id);
      if (!owner)
        return res
          .status(400)
          .send({ message: "Bunday egasi (Owner) mavjud emas" });
    }

    if (services_id) {
      const service = await Services.findByPk(services_id);
      if (!service)
        return res
          .status(400)
          .send({ message: "Bunday xizmat (Service) mavjud emas" });
    }

    if (status_id) {
      const status = await Statuses.findByPk(status_id);
      if (!status)
        return res.status(400).send({ message: "Bunday status mavjud emas" });
    }

    // Yangilanadigan qiymatlar
    const updateData = {};
    if (issue_date !== undefined) updateData.issue_date = issue_date;
    if (due_date !== undefined) updateData.due_date = due_date;
    if (notes !== undefined) updateData.notes = notes;
    if (devices_id !== undefined) updateData.devices_id = devices_id;
    if (owner_id !== undefined) updateData.owner_id = owner_id;
    if (services_id !== undefined) updateData.services_id = services_id;
    if (status_id !== undefined) updateData.status_id = status_id;

    await contract.update(updateData);

    return res.status(200).send({ message: "Contract yangilandi", contract });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const remove = async (req, res) => {
  const { id } = req.params;

  try {
    const contract = await Contract.findByPk(id);
    if (!contract) {
      return res.status(404).send({ message: "Bunday contract mavjud emas" });
    }

    await contract.destroy();
    return res
      .status(200)
      .send({ message: "Contract muvaffaqiyatli o'chirildi" });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getServicesByDateRange = async (req, res) => {
  try {
    const { from, to } = req.body;

    if (!from || !to) {
      return res.status(400).send({
        message: "Iltimos, 'from' va 'to' sanalarni body orqali yuboring.",
      });
    }

    const contracts = await Contract.findAll({
      where: {
        issue_date: { [Op.lte]: new Date(to) },
        due_date: { [Op.gte]: new Date(from) },
      },
      include: [
        {
          model: Services,
          attributes: ["name", "price", "description"],
        },
      ],
      attributes: {
        exclude: ["devices_id", "owner_id", "services_id", "status_id"],
      },
    });

    if (contracts.length === 0) {
      return res
        .status(404)
        .send({ message: "Berilgan oraliqda xizmatlar topilmadi." });
    }

    res.status(200).send({ contracts });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getClientsByServiceDateRange = async (req, res) => {
  try {
    const { from, to } = req.body;

    if (!from || !to) {
      return res.status(400).send({
        message: "Iltimos, 'from' va 'to' sanalarni body orqali yuboring.",
      });
    }

    const contracts = await Contract.findAll({
      where: {
        issue_date: { [Op.lte]: new Date(to) },
        due_date: { [Op.gte]: new Date(from) },
      },
      include: [
        {
          model: Services,
          attributes: ["name", "price", "description"],
        },
        {
          model: Devices,
          attributes: ["brand", "model", "type"],
          include: [
            {
              model: Client,
              attributes: ["full_name", "phone", "address"],
            },
          ],
        },
      ],
      attributes: {
        exclude: ["devices_id", "owner_id", "services_id", "status_id"],
      },
    });

    if (contracts.length === 0) {
      return res
        .status(404)
        .send({ message: "Berilgan oraliqda xizmatlar topilmadi." });
    }

    res.status(200).send({ contracts });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getCancelledClientsByDateRange = async (req, res) => {
  try {
    const { from, to } = req.body;
    if (!from || !to)
      return res
        .status(400)
        .send({ message: "'from' va 'to' talab qilinadi." });

    const contracts = await Contract.findAll({
      where: {
        issue_date: { [Op.lte]: new Date(to) },
        due_date: { [Op.gte]: new Date(from) },
      },
      include: [
        {
          model: Statuses,
          where: { name: "cancelled" }, // yoki Status modeldagi nomga qarab sozlang
        },
        {
          model: Services,
          attributes: ["name", "price", "description"],
        },
        {
          model: Devices,
          include: [
            {
              model: Client,
              attributes: ["full_name", "phone", "address"],
            },
          ],
        },
      ],
      attributes: { exclude: ["owner_id", "services_id"] },
    });

    if (contracts.length === 0) {
      return res
        .status(404)
        .send({ message: "Oraliqda bekor qilingan kontrakt topilmadi." });
    }

    const clients = contracts.map((c) => c.device.client);
    res.status(200).send({ contracts, clients });
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
  getServicesByDateRange,
  getClientsByServiceDateRange,
  getCancelledClientsByDateRange,
};

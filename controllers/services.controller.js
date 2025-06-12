const { sendErrorResponse } = require("../helpers/send_error_response");
const Contract = require("../models/contracts");
const Services = require("../models/services");
const servicesValidation = require("../validations/services.validation");

// Yangi xizmat qo'shish
const create = async (req, res) => {
  try {
    const { error, value } = servicesValidation.validateService(req.body);
    if (error) {
      return res.status(400).send({ message: error.message });
    }

    const { name, price, description } = value;

    const newService = await Services.create({ name, price, description });

    res.status(201).send({ message: "Yangi xizmat qo'shildi!", newService });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

// Barcha xizmatlarni olish
const getAll = async (req, res) => {
  try {
    const services = await Services.findAll({
      include: [
        { model: Contract, attributes: ["issue_date", "due_date", "notes"] },
      ],
    });
    res.status(200).send({ services });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

// Bitta xizmatni olish
const getOne = async (req, res) => {
  const { id } = req.params;
  try {
    const service = await Services.findByPk(id, {
      include: [
        { model: Contract, attributes: ["issue_date", "due_date", "notes"] },
      ],
    });
    if (!service) {
      return res.status(404).json({ message: "Xizmat topilmadi." });
    }
    res.status(200).json(service);
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

// Xizmatni yangilash
const update = async (req, res) => {
  const { id } = req.params;

  try {
    const { error, value } = servicesValidation.validateServiceUpdate(req.body);
    if (error) {
      return res.status(400).send({ message: error.message });
    }

    const service = await Services.findByPk(id);
    if (!service) {
      return res.status(404).json({ message: "Xizmat topilmadi." });
    }

    await service.update(value);

    res
      .status(200)
      .send({ message: "Xizmat muvaffaqiyatli yangilandi.", service });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

// Xizmatni o'chirish
const remove = async (req, res) => {
  const { id } = req.params;

  try {
    const service = await Services.findByPk(id);
    if (!service) {
      return res.status(404).send({ message: "Xizmat topilmadi." });
    }

    await service.destroy();
    res.status(200).send({ message: "Xizmat o'chirildi." });
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

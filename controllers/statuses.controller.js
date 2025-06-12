const { sendErrorResponse } = require("../helpers/send_error_response");
const Contract = require("../models/contracts");
const Statuses = require("../models/statuses");
const { validateStatusCreate } = require("../validations/statuses.validation");

const create = async (req, res) => {
  try {
    const { error, value } = validateStatusCreate(req.body);
    if (error) {
      return res.status(400).send({ message: error.message });
    }

    const { name } = value;

    const existingStatus = await Statuses.findOne({ where: { name } });
    if (existingStatus) {
      return res.status(400).send({ message: "Bu status allaqachon mavjud" });
    }

    const newStatus = await Statuses.create({ name });
    res
      .status(201)
      .send({ message: "Status muvaffaqiyatli qo'shildi", newStatus });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getAll = async (req, res) => {
  try {
    const statuses = await Statuses.findAll({
      include: [
        { model: Contract, attributes: ["issue_date", "due_date", "notes"] },
      ],
    });
    res.status(200).send(statuses);
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getOne = async (req, res) => {
  const { id } = req.params;
  try {
    const status = await Statuses.findByPk(id, {
      include: [
        { model: Contract, attributes: ["issue_date", "due_date", "notes"] },
      ],
    });
    if (!status) {
      return res.status(404).send({ message: "Bunday status topilmadi" });
    }
    res.status(200).send(status);
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  try {
    const { error, value } = validateStatusCreate(req.body);
    const { name } = value;
    if (error) {
      return res.status(400).send({ message: error.message });
    }
    const status = await Statuses.findByPk(id);
    if (!status)
      return res.status(401).send({ message: "bunday status topilmadi!..." });

    const updateData = {};
    if (name !== undefined) updateData.name = name;

    await status.update(updateData);

    res.status(200).send({ message: "status yangilandi!...", status });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const remove = async (req, res) => {
  const { id } = req.params;
  try {
    const status = await Statuses.findByPk(id);
    if (!status) {
      return res.status(401).send({ message: "bunday status topilmadi!..." });
    }
    await status.destroy();
    res.status(200).send({ message: "status o'chirildi" });
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

const { sendErrorResponse } = require("../helpers/send_error_response");
const Client = require("../models/clients");
const Contract = require("../models/contracts");
const Devices = require("../models/devices");
const Payment = require("../models/payment");
const {
  paymentCreateValidate,
  paymentUpdateValidate,
} = require("../validations/paymnet.validate");

// Create Payment
const create = async (req, res) => {
  try {
    const { error, value } = paymentCreateValidate.validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.message });
    }

    const { amount, method, paid_at, contract_id } = value;

    const contract = await Contract.findByPk(contract_id);
    if (!contract)
      return res.status(400).send({ message: "Bunday contract topilmadi!..." });

    // ✅ Object ko‘rinishida create
    const newPayment = await Payment.create({
      amount,
      method,
      paid_at,
      contract_id,
    });

    res
      .status(201)
      .send({ message: "Yangi payment yaratildi!...", newPayment });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

// Get all payments
const getAll = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      include: [
        {
          model: Contract,
          attributes: ["issue_date", "due_date", "notes"],
          include: [
            {
              model: Devices,
              attributes: ["brand", "type"],
              include: [
                {
                  model: Client,
                  attributes: ["full_name", "phone", "address"],
                },
              ],
            },
          ],
        },
      ],
      order: [["paid_at", "DESC"]],
    });

    res.status(200).send({ payments });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

// Get one payment by ID
const getOne = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findByPk(id, {
      include: [
        {
          model: Contract,
          attributes: ["issue_date", "due_date", "notes"],
          include: [
            {
              model: Devices,
              attributes: ["brand", "type"],
              include: [
                {
                  model: Client,
                  attributes: ["full_name", "phone", "address"],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!payment) {
      return res.status(404).send({ message: "Payment topilmadi!" });
    }

    res.status(200).send({ payment });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

// Update payment
const update = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findByPk(id);
    if (!payment) {
      return res.status(404).send({ message: "Payment topilmadi!" });
    }

    const { error, value } = paymentUpdateValidate.validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.message });
    }

    await payment.update(value);

    res.status(200).send({ message: "Payment yangilandi!", payment });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

// Delete payment
const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findByPk(id);
    if (!payment) {
      return res.status(404).send({ message: "Payment topilmadi!" });
    }

    await payment.destroy();

    res.status(200).send({ message: "Payment o'chirildi!" });
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

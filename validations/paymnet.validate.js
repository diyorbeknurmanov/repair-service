const Joi = require("joi");

const paymentCreateValidate = Joi.object({
  contract_id: Joi.number().integer().positive().required().messages({
    "number.base": `"contract_id" butun son bo'lishi kerak`,
    "number.integer": `"contract_id" butun son bo'lishi kerak`,
    "number.positive": `"contract_id" musbat son bo'lishi kerak`,
    "any.required": `"contract_id" majburiy maydon`,
  }),

  amount: Joi.number().precision(2).positive().required().messages({
    "number.base": `"amount" raqam bo'lishi kerak`,
    "number.positive": `"amount" musbat bo'lishi kerak`,
    "any.required": `"amount" majburiy maydon`,
  }),

  method: Joi.string()
    .valid("cash", "card", "bank_transfer")
    .required()
    .messages({
      "any.only": `"method" faqat quyidagilardan biri bo'lishi kerak: "cash", "card", "bank_transfer"`,
      "any.required": `"method" majburiy maydon`,
    }),

  paid_at: Joi.date().required().messages({
    "date.base": `"paid_at" to'g'ri sana formatida bo'lishi kerak`,
    "any.required": `"paid_at" majburiy maydon`,
  }),
});

const paymentUpdateValidate = Joi.object({
  contract_id: Joi.number().integer().positive().messages({
    "number.base": `"contract_id" butun son bo'lishi kerak`,
    "number.integer": `"contract_id" butun son bo'lishi kerak`,
    "number.positive": `"contract_id" musbat son bo'lishi kerak`,
  }),

  amount: Joi.number().precision(2).positive().messages({
    "number.base": `"amount" raqam bo'lishi kerak`,
    "number.positive": `"amount" musbat bo'lishi kerak`,
  }),

  method: Joi.string().valid("cash", "card", "bank_transfer").messages({
    "any.only": `"method" faqat quyidagilardan biri bo'lishi kerak: "cash", "card", "bank_transfer"`,
  }),

  paid_at: Joi.date().messages({
    "date.base": `"paid_at" to'g'ri sana formatida bo'lishi kerak`,
  }),
});

module.exports = {
  paymentCreateValidate,
  paymentUpdateValidate,
};

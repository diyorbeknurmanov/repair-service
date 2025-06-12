const Joi = require("joi");

const serviceSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    "string.base": "Nomi matn bo'lishi kerak",
    "string.empty": "Nomi kiritilishi shart",
    "string.min": "Nomi kamida 2 ta belgidan iborat bo'lishi kerak",
    "string.max": "Nomi 50 ta belgidan oshmasligi kerak",
    "any.required": "Nomi kiritilishi shart",
  }),
  price: Joi.number().positive().precision(2).required().messages({
    "number.base": "Narx raqam bo'lishi kerak",
    "number.positive": "Narx musbat bo'lishi kerak",
    "any.required": "Narx kiritilishi shart",
  }),
  description: Joi.string().allow("", null).max(255).messages({
    "string.base": "Tavsif matn bo'lishi kerak",
    "string.max": "Tavsif 255 belgidan oshmasligi kerak",
  }),
});

const updateServiceSchema = Joi.object({
  name: Joi.string().min(2).max(50).messages({
    "string.base": "Nomi matn bo'lishi kerak",
    "string.min": "Nomi kamida 2 ta belgidan iborat bo'lishi kerak",
    "string.max": "Nomi 50 ta belgidan oshmasligi kerak",
  }),
  price: Joi.number().positive().precision(2).messages({
    "number.base": "Narx raqam bo'lishi kerak",
    "number.positive": "Narx musbat bo'lishi kerak",
  }),
  description: Joi.string().allow("", null).max(255).messages({
    "string.base": "Tavsif matn bo'lishi kerak",
    "string.max": "Tavsif 255 belgidan oshmasligi kerak",
  }),
})
  .min(1)
  .messages({
    "object.min": "Kamida bitta maydon yangilanishi kerak",
  });

module.exports = {
  validateService: (data) => serviceSchema.validate(data),
  validateServiceUpdate: (data) => updateServiceSchema.validate(data),
};

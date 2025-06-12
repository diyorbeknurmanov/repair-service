const Joi = require("joi");

const deviceSchema = Joi.object({
  client_id: Joi.number().integer().required().messages({
    "number.base": "Client ID raqam bo'lishi kerak",
    "any.required": "Client ID kiritilishi shart",
  }),
  brand: Joi.string().min(2).max(50).required().messages({
    "string.base": "Brend matn bo'lishi kerak",
    "string.empty": "Brend kiritilishi shart",
    "string.min": "Brend kamida 2 ta belgidan iborat bo'lishi kerak",
    "string.max": "Brend 50 ta belgidan oshmasligi kerak",
    "any.required": "Brend kiritilishi shart",
  }),
  model: Joi.string().min(2).max(50).required().messages({
    "string.base": "Model matn bo'lishi kerak",
    "string.empty": "Model kiritilishi shart",
    "string.min": "Model kamida 2 ta belgidan iborat bo'lishi kerak",
    "string.max": "Model 50 ta belgidan oshmasligi kerak",
    "any.required": "Model kiritilishi shart",
  }),
  type: Joi.string()
    .valid("TV", "Washer", "Fridge", "AC", "Oven")
    .required()
    .messages({
      "any.only": "Type faqat TV, Washer, Fridge, AC yoki Oven bo'lishi mumkin",
      "any.required": "Type kiritilishi shart",
    }),
});

const updateDeviceSchema = Joi.object({
  client_id: Joi.number().integer().messages({
    "number.base": "Client ID raqam bo'lishi kerak",
  }),
  brand: Joi.string().min(2).max(50).messages({
    "string.base": "Brend matn bo'lishi kerak",
    "string.min": "Brend kamida 2 ta belgidan iborat bo'lishi kerak",
    "string.max": "Brend 50 ta belgidan oshmasligi kerak",
  }),
  model: Joi.string().min(2).max(50).messages({
    "string.base": "Model matn bo'lishi kerak",
    "string.min": "Model kamida 2 ta belgidan iborat bo'lishi kerak",
    "string.max": "Model 50 ta belgidan oshmasligi kerak",
  }),
  type: Joi.string().valid("TV", "Washer", "Fridge", "AC", "Oven").messages({
    "any.only": "Type faqat TV, Washer, Fridge, AC yoki Oven bo'lishi mumkin",
  }),
})
  .min(1)
  .messages({
    "object.min": "Kamida bitta maydon yangilanishi kerak",
  });

module.exports = {
  validateDevice: (data) => deviceSchema.validate(data),
  validateDeviceUpdate: (data) => updateDeviceSchema.validate(data),
};

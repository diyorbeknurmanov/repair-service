const Joi = require("joi");

const registerSchema = Joi.object({
  full_name: Joi.string().min(2).max(100).required().messages({
    "string.empty": "Ism familiya kiritilishi shart",
    "string.min": "Ism familiya kamida 2 ta belgidan iborat bo'lishi kerak",
    "string.max": "Ism familiya 100 ta belgidan oshmasligi kerak",
    "any.required": "Ism familiya kiritilishi shart",
  }),
  phone: Joi.string()
    .pattern(/^(\+998|998)?[0-9]{9}$/)
    .required()
    .messages({
      "string.pattern.base":
        "shu tarzda kiriting: (masalan, 998901234567 yoki +998901234567)",
      "string.empty": "Telefon raqam kiritilishi shart",
      "any.required": "Telefon raqam kiritilishi shart",
    }),
  email: Joi.string().email().required().messages({
    "string.email": "Email formati noto'g'ri",
    "string.empty": "Email kiritilishi shart",
    "any.required": "Email kiritilishi shart",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Parol kamida 6 ta belgidan iborat bo'lishi kerak",
    "string.empty": "Parol kiritilishi shart",
    "any.required": "Parol kiritilishi shart",
  }),
  address: Joi.string().min(5).max(200).required().messages({
    "string.empty": "Manzil kiritilishi shart",
    "string.min": "Manzil kamida 5 ta belgidan iborat bo'lishi kerak",
    "string.max": "Manzil 200 ta belgidan oshmasligi kerak",
    "any.required": "Manzil kiritilishi shart",
  }),
  is_active: Joi.boolean().default(false),
  refresh_token: Joi.string(),
  activation_link: Joi.string(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Email formati noto'g'ri",
    "string.empty": "Email kiritilishi shart",
    "any.required": "Email kiritilishi shart",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Parol kiritilishi shart",
    "any.required": "Parol kiritilishi shart",
  }),
});

const updateSchema = Joi.object({
  full_name: Joi.string().min(2).max(100).optional().messages({
    "string.min": "Ism familiya kamida 2 ta belgidan iborat bo'lishi kerak",
    "string.max": "Ism familiya 100 ta belgidan oshmasligi kerak",
  }),
  phone: Joi.string()
    .pattern(/^(\+998|998)?[0-9]{9}$/)
    .optional()
    .messages({
      "string.pattern.base":
        "shu tarzda kiriting: (masalan, 998901234567 yoki +998901234567)",
    }),
  email: Joi.string().email().optional().messages({
    "string.email": "Email formati noto'g'ri",
  }),
  address: Joi.string().min(5).max(200).optional().messages({
    "string.min": "Manzil kamida 5 ta belgidan iborat bo'lishi kerak",
    "string.max": "Manzil 200 ta belgidan oshmasligi kerak",
  }),
  is_active: Joi.boolean().optional(),
  refresh_token: Joi.string().optional(),
  activation_link: Joi.string().optional(),
})
  .min(1)
  .messages({
    "object.min": "Kamida bitta maydon yangilanishi kerak",
  });

const changePassword = Joi.object({
  password: Joi.string().required().messages({
    "string.empty": "Eski parol kiritilishi shart",
    "any.required": "Eski parol kiritilishi shart",
  }),
  newPassword: Joi.string().min(6).required().messages({
    "string.min": "Yangi parol kamida 6 ta belgidan iborat bo'lishi kerak",
    "string.empty": "Yangi parol kiritilishi shart",
    "any.required": "Yangi parol kiritilishi shart",
  }),
});

module.exports = {
  validate: (data) => registerSchema.validate(data),

  // Login uchun
  validateLogin: (data) => loginSchema.validate(data),

  // Update uchun
  validateUpdate: (data) => updateSchema.validate(data),

  //change Password
  validateChangePassword: (data) => changePassword.validate(data),
};

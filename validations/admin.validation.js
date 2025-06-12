const Joi = require("joi");

// Register uchun validatsiya (barcha maydonlar majburiy)
const registerSchema = Joi.object({
  full_name: Joi.string().min(2).max(100).required().messages({
    "string.empty": "Ism familiya kiritilishi shart",
    "string.min": "Ism familiya kamida 2 ta belgidan iborat bo'lishi kerak",
    "string.max": "Ism familiya 100 ta belgidan oshmasligi kerak",
    "any.required": "Ism familiya kiritilishi shart",
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
});

// Login uchun validatsiya (faqat email va password)
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

// Update uchun validatsiya (barcha maydonlar ixtiyoriy)
const updateSchema = Joi.object({
  full_name: Joi.string().min(2).max(100).optional().messages({
    "string.min": "Ism familiya kamida 2 ta belgidan iborat bo'lishi kerak",
    "string.max": "Ism familiya 100 ta belgidan oshmasligi kerak",
  }),
  email: Joi.string().email().optional().messages({
    "string.email": "Email formati noto'g'ri",
  }),
})
  .min(1)
  .messages({
    "object.min": "Kamida bitta maydon yangilanishi kerak",
  });

const changePassword = Joi.object({
  password: Joi.string().min(6).required().messages({
    "string.min": "Parol kamida 6 ta belgidan iborat bo'lishi kerak",
    "string.empty": "Parol kiritilishi shart",
    "any.required": "Parol kiritilishi shart",
  }),
  newPassword: Joi.string().min(6).required().messages({
    "string.min": "Yangi parol kamida 6 ta belgi bo'lishi kerak",
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

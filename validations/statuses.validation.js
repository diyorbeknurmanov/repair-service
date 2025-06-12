const Joi = require("joi");

// ENUM qiymatlar (modeldagi ENUM bilan aynan bir xil bo'lishi kerak!)
const validStatusNames = [
  "new",
  "active",
  "in_progress",
  "completed",
  "cancelled",
];

// Create uchun validation
const validateStatusCreate = (data) => {
  const schema = Joi.object({
    name: Joi.string()
      .valid(...validStatusNames)
      .required()
      .messages({
        "any.only": `"name" faqat quyidagilardan biri bo'lishi mumkin: ${validStatusNames.join(
          ", "
        )}`,
        "string.base": `"name" matn bo'lishi kerak`,
        "any.required": `"name" majburiy maydon`,
      }),
  });

  return schema.validate(data);
};

// Update uchun validation
const validateStatusUpdate = (data) => {
  const schema = Joi.object({
    name: Joi.string()
      .valid(...validStatusNames)
      .optional()
      .messages({
        "any.only": `"name" faqat quyidagilardan biri bo'lishi mumkin: ${validStatusNames.join(
          ", "
        )}`,
        "string.base": `"name" matn bo'lishi kerak`,
      }),
  });

  return schema.validate(data);
};

module.exports = {
  validateStatusCreate,
  validateStatusUpdate,
};

const Joi = require("joi");

const contractValidate = Joi.object({
  issue_date: Joi.date().required().messages({
    "date.base": `"issue_date" noto'g'ri sana formatida`,
    "any.required": `"issue_date" majburiy maydon`,
  }),

  due_date: Joi.date().greater(Joi.ref("issue_date")).required().messages({
    "date.base": `"due_date" noto'g'ri sana formatida`,
    "date.greater": `"due_date" "issue_date" dan katta bo'lishi kerak`,
    "any.required": `"due_date" majburiy maydon`,
  }),

  notes: Joi.string().allow("").optional().messages({
    "string.base": `"notes" matn bo'lishi kerak`,
  }),

  devices_id: Joi.number().required().messages({
    "number.base": `"devices_id" raqam bo'lishi kerak`,
    "any.required": `"devices_id" majburiy maydon`,
  }),

  owner_id: Joi.number().required().messages({
    "number.base": `"owner_id" raqam bo'lishi kerak`,
    "any.required": `"owner_id" majburiy maydon`,
  }),

  services_id: Joi.number().required().messages({
    "number.base": `"services_id" raqam bo'lishi kerak`,
    "any.required": `"services_id" majburiy maydon`,
  }),

  status_id: Joi.number().required().messages({
    "number.base": `"status_id" raqam bo'lishi kerak`,
    "any.required": `"status_id" majburiy maydon`,
  }),
});

const contractUpdateValidate = Joi.object({
  issue_date: Joi.date().messages({
    "date.base": `"issue_date" noto'g'ri sana formatida`,
  }),

  due_date: Joi.date()
    .when("issue_date", {
      is: Joi.date(),
      then: Joi.date().greater(Joi.ref("issue_date")).messages({
        "date.greater": `"due_date" "issue_date" dan katta bo'lishi kerak`,
      }),
      otherwise: Joi.date(),
    })
    .messages({
      "date.base": `"due_date" noto'g'ri sana formatida`,
    }),

  notes: Joi.string().allow("").optional().messages({
    "string.base": `"notes" matn bo'lishi kerak`,
  }),

  devices_id: Joi.number().messages({
    "number.base": `"devices_id" raqam bo'lishi kerak`,
  }),

  owner_id: Joi.number().messages({
    "number.base": `"owner_id" raqam bo'lishi kerak`,
  }),

  services_id: Joi.number().messages({
    "number.base": `"services_id" raqam bo'lishi kerak`,
  }),

  status_id: Joi.number().messages({
    "number.base": `"status_id" raqam bo'lishi kerak`,
  }),
});

module.exports = {
  contractValidate,
  contractUpdateValidate,
};

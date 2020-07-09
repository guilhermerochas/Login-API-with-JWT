const Joi = require("@hapi/joi");

//Schema for Validation

const Schema = Joi.object({
  name: Joi.string().min(6).required(),
  email: Joi.string().email().min(10).required(),
  password: Joi.string().min(6).required(),
});

module.exports = Schema;

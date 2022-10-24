const Joi = require("joi");

const registerValidate = (data) => {
  const user = Joi.object({
    username: Joi.string().max(255).required(),
    email: Joi.string().max(255).email().required(),
    password: Joi.string().min(6).max(255).required(),
    confirmPassword: Joi.string().max(255).required(),
  });
  return user.validate(data);
};

const loginValidate = (data) => {
  const user = Joi.object({
    username: Joi.string().max(255).required(),
    password: Joi.string().max(255).required(),
  });
  return user.validate(data);
};

module.exports = { registerValidate, loginValidate };

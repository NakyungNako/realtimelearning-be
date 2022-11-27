const Joi = require("joi");

module.exports.emailValidate = (mail) => {
  const email = Joi.string().max(255).email();
  return email.validate(mail);
};

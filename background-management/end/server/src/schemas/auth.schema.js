const Joi = require("joi");

const loginSchemas = Joi.object({
  username: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{6,16}$")).required(),
  yzm: Joi.string().required(),
  uuid: Joi.string().required(),
});

module.exports = {
  loginSchemas,
};

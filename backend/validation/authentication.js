const Joi = require('joi');

const validateLogin = data => {
    const schema = Joi.object({
        username: Joi.string()
                     .min(6)
                     .max(20)
                     .required(),
        password: Joi.string()
                     .min(6)
                     .max(20)
                     .required()
    });

    return schema.validate(data, {abortEarly: false});
}

const validateRegistration = data => {
    const schema = Joi.object({
        username: Joi.string()
                     .min(6)
                     .max(20)
                     .required(),
        password: Joi.string()
                     .min(6)
                     .max(20)
                     .required(),
        repeat_password: Joi.string()
                            .required()
                            .valid(Joi.ref('password'))
    });

    return schema.validate(data, {abortEarly: false});
}

module.exports.validateLogin = validateLogin;
module.exports.validateRegistration = validateRegistration;
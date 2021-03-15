const Joi = require('joi');

const validateCreateTest = data => {

    const answers = Joi.object().keys({
        no: Joi.number()
               .greater(0)
               .required(),
        answer: Joi.string()
                   .required(),
        correct: Joi.boolean()
                    .required()
    });

    const questions = Joi.object().keys({
        no: Joi.number()
              .greater(0)
              .required(),
        question: Joi.string()
                    .required(),
        answers: Joi.array()
                    .items(answers)
                    .min(1)
                    .required(),
        points: Joi.number()
                    .greater(0)
                    .required()
    });


    const schema = Joi.object({
        title: Joi.string()
                  .min(1)
                  .max(25)
                  .required(),
        questions: Joi.array()
                     .min(1)
                     .items(questions)
                     .required()
    });

    return schema.validate(data, {abortEarly: false});
}

module.exports.validateCreateTest = validateCreateTest;
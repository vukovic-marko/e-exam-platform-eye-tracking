const Joi = require('joi');

const validateGetTests = data => {
    const schema = Joi.object({
        page: Joi.number()
                 .greater(0)
                 .required(),
        limit: Joi.number()
                  .greater(0)
                  .required()
    });

    return schema.validate(data, {abortEarly: false});
}

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

const validateSubmitAnswers = data => {
    const gaze_data = Joi.object({
        x: Joi.number()
              .required(),
        y: Joi.number()
              .required()
    })
    
    const answers = Joi.object({
        no: Joi.number()
               .greater(0)
               .required(),
        answer: Joi.string(),
        gaze_data: Joi.array()
                      .items(gaze_data)
    })
    
    const schema = Joi.object({
        answers: Joi.array()
                    .items(answers)
                    .required()
    });

    return schema.validate(data, {abortEarly: false});
}

module.exports.validateGetTests = validateGetTests;
module.exports.validateCreateTest = validateCreateTest;
module.exports.validateSubmitAnswers = validateSubmitAnswers;
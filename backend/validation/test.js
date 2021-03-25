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
        answer: Joi.string()
                   .required(),
        correct: Joi.boolean()
                    .required()
    });

    const areas_of_interest = Joi.object().keys({
        caption: Joi.string()
                    .required(),
        top_left: Joi.object()
                     .keys({
                        x1: Joi.number()
                                .greater(0)
                                .required(),
                        y1: Joi.number()
                                .greater(0)
                                .required()    
                     }),
        bottom_right: Joi.object()
                         .keys({
                            x2: Joi.number()
                                .greater(0)
                                .required(),
                            y2: Joi.number()
                                .greater(0)
                                .required()    
                        })
    })

    const questions = Joi.object().keys({
        type: Joi.string()
                 .valid('MULTIPLE_CHOICE', 'ESSAY')
                 .required(),
        question: Joi.string()
                    .required(),
        answers: Joi.array()
                    .items(answers),
                    // .min(1)
                    // .required(),
        points: Joi.number()
                    .greater(0)
                    .required(),
        areas_of_interest: Joi.array()
                               .items(areas_of_interest)
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
        GazeX: Joi.number()
              .required(),
        GazeY: Joi.number()
              .required()
    })
    
    const answers = Joi.object({
        _id: Joi.string(),
        question_id: Joi.string()
                        .required(),
        answer_id: Joi.string(),
        answer: Joi.string(),
        gaze_data: Joi.array()
                      .items(gaze_data)
    })
    
    const schema = Joi.object({
        answers: Joi.array()
                    .min(1)
                    .items(answers)
                    .required()
    });

    return schema.validate(data, {abortEarly: false});
}

module.exports.validateGetTests = validateGetTests;
module.exports.validateCreateTest = validateCreateTest;
module.exports.validateSubmitAnswers = validateSubmitAnswers;
const mongoose = require('mongoose')

// const options = {
//     discriminatorKey: 'role'
// };

const schema = mongoose.Schema({
    student: {
        _id: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true
        }
    },
    test: {
        teacher: {
            _id: {
                type: String,
                required: true
            },
            username: {
                type: String,
                required: true
            }
        },
        _id: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        questions: [{
            no: {
                type: Number
            },
            question: {
                type: String
            },
            answers: [{
                no: {
                    type: Number
                },
                answer: {
                    type: String
                },
                correct: {
                    type: Boolean
                }
            }],
            points: {
                type: Number
            }
        }],
        test_points: {
            type: Number
        }
    },
    submitted_answers: [{
        no: {
            type: Number//,
            // required: true
        },
        answer: {
            type: String//,
            // required: true
        },
        points: {
            type: Number
            // not required in case the test is essay or mixed type
        },
        gaze_data: [{
            x: {
                type: Number
            },
            y: {
                type: Number
            }
        }]
    }],
    started_at: {
        type: Date,
        required: true
    },
    submitted_at: {
        type: Date
    }
})//, options)

module.exports = mongoose.model('SubmittedTest', schema)
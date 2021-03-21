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
            },
            areas_of_interest: [{
                caption: {
                    type: String,
                    required: true
                },
                top_left: {
                    x1: {
                        type: Number,
                        required: true,
                    },
                    y1: {
                        type: Number,
                        required: true
                    }
                },
                bottom_right: {
                    x2: {
                        type: Number,
                        required: true
                    },
                    y2: {
                        type: Number,
                        required: true
                    }
                }
            }]
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
            GazeX: {
                type: Number,
                required: true
            },
            GazeY: {
                type: Number,
                required: true
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
const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2');

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
            question: {
                type: String
            },
            answers: [{
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
        question_id: {
            type: String,
            required: true
        },
        answer_id: {
            type: String
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
        }],
        crunched_gaze_data: {
            sequence: [
                {
                    id: {
                        type: String,
                        // required: true
                    },
                    caption: {
                        type: String,
                        // required: true
                    },
                    count: {
                        type: Number,
                        // required: true
                    },
                    percentage: {
                        type: Number,
                        // required: true
                    }
                }
            ],
            sequence_length: {
                type: Number,
                // required: true
            },
            summary: [
                {
                    id: {
                        type: String,
                        // required: true
                    },
                    caption: {
                        type: String,
                        // required: true
                    },
                    count: {
                        type: Number,
                        // required: true
                    },
                    percentage: {
                        type: Number,
                        // required: true
                    }
                }
            ],
        },
        correct: {
            type: Boolean
        }
    }],
    started_at: {
        type: Date,
        required: true
    },
    submitted_at: {
        type: Date
    },
    points: {
        type: Number
    }
})//, options)

schema.plugin(mongoosePaginate);

module.exports = mongoose.model('SubmittedTest', schema)
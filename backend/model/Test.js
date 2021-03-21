const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2');


// const options = {
//     discriminatorKey: 'role'
// };

const schema = mongoose.Schema({
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
})//, options)

schema.plugin(mongoosePaginate);

module.exports = mongoose.model('Test', schema)
const mongoose = require('mongoose')

const options = {
    discriminatorKey: 'role'
};

const schema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        minLength: [6, 'Username too short.'],
        maxLength: [20, 'Username too long.']
    },
    password: {
        type: String,
        required: true
    },
    sessionId: {
        type: String
    }
}, options)

module.exports = mongoose.model('User', schema)
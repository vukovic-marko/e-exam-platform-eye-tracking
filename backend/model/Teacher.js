const mongoose = require('mongoose');

const User = require('./User');

const Teacher = User.discriminator('Teacher', new mongoose.Schema(), 'teacher')

module.exports = mongoose.model('Teacher');
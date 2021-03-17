const mongoose = require('mongoose');

const User = require('./User');

const Student = User.discriminator('Student', new mongoose.Schema(), 'student');

module.exports = mongoose.model('Student');
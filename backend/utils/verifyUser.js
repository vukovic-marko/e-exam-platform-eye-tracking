const asyncHandler = require('express-async-handler')
const createError = require('http-errors')

const Teacher = require('../model/Teacher')
const Student = require('../model/Student')
const User = require('../model/User')

const verifyTeacher = asyncHandler(async (req, res, next) => {
    const teacher = await Teacher.findById(req.user._id);

    if (!teacher) throw createError(403, 'Only for teachers');

    req.teacher = teacher;

    next();
})

const verifyStudent = asyncHandler(async (req, res, next) => {
    const student = await Student.findById(req.user._id);

    if (!student) throw createError(403, 'Only for students');

    req.student = student;

    next();
})

const verifyUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id);

    if (!user) throw createError(403, 'Only for registered users');

    req.user = user;

    next();
})

module.exports.verifyTeacher = verifyTeacher;
module.exports.verifyStudent = verifyStudent;
module.exports.verifyUser = verifyUser;
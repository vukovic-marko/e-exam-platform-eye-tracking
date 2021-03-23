const Teacher = require('../model/Teacher')
const Student = require('../model/Student')
const User = require('../model/User')

const verifyTeacher = async (req, res, next) => {
    const teacher = await Teacher.findById(req.user._id);

    if (!teacher) return res.status(401).send('Unauthorized');

    req.teacher = teacher;

    next();
}

const verifyStudent = async (req, res, next) => {
    const student = await Student.findById(req.user._id);

    if (!student) return res.status(401).send('Unauthorized');

    req.student = student;

    next();
}

const verifyUser = async (req, res, next) => {
    const user = await User.findById(req.user._id);

    if (!user) return res.status(401).send('Unauthorised');

    req.user = user;

    next();
}

module.exports.verifyTeacher = verifyTeacher;
module.exports.verifyStudent = verifyStudent;
module.exports.verifyUser = verifyUser;
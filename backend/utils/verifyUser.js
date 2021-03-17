const Teacher = require('../model/Teacher')
const Student = require('../model/Student')

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

module.exports.verifyTeacher = verifyTeacher;
module.exports.verifyStudent = verifyStudent;
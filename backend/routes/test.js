const router = require('express').Router();

const Test = require('../model/Test');

const { verifyAccessToken } = require('../utils/verifyToken')

const { verifyTeacher, verifyStudent } = require('../utils/verifyUser')

const { validateCreateTest } = require('../validation/test')

router.post('/create', verifyAccessToken, verifyTeacher, async (req, res) => {

  const { error } = validateCreateTest(req.body);
  if (error) return res.status(400).send({ msg: error.details });

    try {
      const test = new Test(req.body)
  
      test.test_points = test.questions.reduce((temp, current) => temp + current.points, 0);
      test.teacher = (({_id, username}) => ({_id, username}))(req.teacher);

      await test.save();
      res.status(200).send(test);
    } catch (err) {
      console.log(err);
      
      res.status(400).send(err);
    }
  })

  module.exports = router
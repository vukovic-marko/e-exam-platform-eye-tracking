const router = require('express').Router();

const Test = require('../model/Test');
const SubmittedTest = require('../model/SubmittedTest')

const { verifyAccessToken } = require('../utils/verifyToken')

const { verifyTeacher, verifyStudent } = require('../utils/verifyUser')

const { validateCreateTest, validateGetTests, validateSubmitAnswers } = require('../validation/test')

// CREATE TEST (ONLY FOR TEACHERS)
// TODO ONLY ONE ANSWER IN A QUESTION CAN BE CORRECT!
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
    res.status(400).send(err);
  }
})

// GET ALL TESTS (FOR ALL REGISTERED USERS)
// ONLY RETURNS TEST ID, TITLE, MAXIMUM NUMBER OF POINTS AND TEACHER INFORMATION
router.get('/', verifyAccessToken, (req, res) => {
  const { error } = validateGetTests(req.query);
  if (error) return res.status(400).send({msg: error.details });
  
  try {
    Test.paginate({}, { page: req.query.page, limit: req.query.limit }).then(result => {
      if (result.totalPages < result.page) {
        return res.status(404).send('Page does not exist.')
      }

      result.docs.forEach(test => {
        test.questions = undefined;
      })

      res.status(200).send(result);
    })
  } catch(err) {
    res.status(400).send(err);
  }
})

// GET TEST (also logs when the student first loaded the test)
// for students only
router.get('/:id', verifyAccessToken, verifyStudent, async (req, res) => {
  try {
    const test = await Test.findById(req.params.id.toString());
    
    let submittedTest = await SubmittedTest.findOne({ "student._id" : req.student.id, "test._id" : test._id });
    
    if (!submittedTest) {
      submittedTest = new SubmittedTest({
        student: {
          _id: req.student._id,
          username: req.student.username
        },
        test: test,
        started_at: new Date()
      }); 

      await submittedTest.save();
    }

    test.questions.forEach(question => {
      question.answers.forEach(answer => {
        answer.correct = undefined;
      })
      question.areas_of_interest = undefined;
    })
    
    res.status(200).send(test);
  } catch(err) {
    res.status(400).send({ msg: err });
  }
  
})

// SUBMIT ANSWERS 
// for students only
router.post('/:id', verifyAccessToken, verifyStudent, async (req, res) => {
  
  const { error } = validateSubmitAnswers(req.body);
  if (error) return res.status(400).send({ msg: error.details });

  try {
    let submittedTest = await SubmittedTest.findOne({ "student._id" : req.student._id, "test._id" : req.params.id.toString() });
    if (!submittedTest) return res.status(400).send('Cannot submit answers without opening it first.');
    if (submittedTest.submitted_at) return res.status(400).send('Answers already submitted.');

    if (submittedTest.test.questions.length !== req.body.answers.length) return res.status(400).send('Number of answers does not match with the number of questions.');

    let points = 0;

    submittedTest.test.questions.forEach((question, idx) => {
      const correct_answer = question.answers.filter(answer => answer.correct === true)[0];
      
      if (question._id.toString() !== req.body.answers[idx].question_id.toString())
        return res.status(400).send('Question and submitted answer id mismatch.');

      if (correct_answer._id.toString() === req.body.answers[idx].answer_id.toString()) {
        // CORRECT ANSWER
        points += question.points;
        req.body.answers[idx].correct = true;
      } else {
        // INCORRECT ANSWER
        req.body.answers[idx].correct = false;
      }
    })

    submittedTest.submitted_answers = req.body.answers;
    submittedTest.points = points;
    submittedTest.submitted_at = new Date();
    await submittedTest.save();
    
    submittedTest.test.questions = undefined;
    submittedTest.submitted_answers.forEach(item => {
      item.answer_id = undefined;
      item.answer = undefined;
      item.gaze_data = undefined;
    });

    res.status(200).send(submittedTest);

  } catch(err) {
    res.status(400).send({ msg: err });
  }
})

module.exports = router
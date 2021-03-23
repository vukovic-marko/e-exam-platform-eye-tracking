const router = require('express').Router();

const Test = require('../model/Test');
const SubmittedTest = require('../model/SubmittedTest')

const { verifyAccessToken } = require('../utils/verifyToken')

const { verifyTeacher, verifyStudent, verifyUser } = require('../utils/verifyUser')

const { validateCreateTest, validateGetTests, validateSubmitAnswers } = require('../validation/test')

// --------------------------------------------------------------------------------------------
//
// student    GET   /test         get tests
//            GET   /test/id      start test (log) or get test (without logging)
//            POST  /test/id      submit answers and eye movement data
//
// teacher    POST  /test         create test
//            GET   /test         see teacher's own tests
//            GET   /test/id      see all students who took the test with id (id)
//            GET   /result/id    see results of a single test (id is id of a submitted test)
//
// --------------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------------
// GET  /test
// --------------------------------------------------------------------------------------------
// GET ALL TESTS (FOR ALL REGISTERED USERS)
// ONLY RETURNS TEST ID, TITLE, MAXIMUM NUMBER OF POINTS AND TEACHER INFORMATION
// TEACHER CAN SEE ONLY TESTS TEACHER'S OWN TESTS
// STUDENTS CAN SEE TESTS BY ALL TEACHERS
router.get('/', verifyAccessToken, verifyUser, async (req, res) => {
  const { error } = validateGetTests(req.query);
  if (error) return res.status(400).send({msg: error.details });
  
  try {

    // TEACHER CAN SEE ONLY TESTS HE CREATED
    // STUDENTS CAN SEE TESTS BY ALL TEACHERS
    let query = {}
    if (req.user.role === 'teacher') {
      query["teacher._id"] = req.user._id;
    } 

    Test.paginate(query, { page: req.query.page, limit: req.query.limit }).then(result => {
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

// --------------------------------------------------------------------------------------------
// GET  /test/id
// --------------------------------------------------------------------------------------------
// STUDENTS GET QUESTIONS AND TEST DETAILS AND START TIME AND DATE GETS LOGGED
// TEACHERS GET STUDENTS WHO TOOK TEST WITH THE PROVIDED ID
router.get('/:id', verifyAccessToken, verifyUser, async (req, res) => {

  if (!req.params.id) return res.status(400).send({ msg: "Test id is missing." });

  if (req.user.role === 'student') {
    try {
      const test = await Test.findById(req.params.id.toString());
      
      let submittedTest = await SubmittedTest.findOne({ "student._id" : req.user.id, "test._id" : test._id });
      
      if (!submittedTest) {
        submittedTest = new SubmittedTest({
          student: {
            _id: req.user._id,
            username: req.user.username
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
  } else if (req.user.role === 'teacher') {
    // TODO TREBALO BI DA IDE PROVERA DA SE VRATI ERROR AKO TEACHER POKUSA DA PRISTUPI PODACIMA DRUGOG TEACHERA
    // TRENUTNO SE VRACA PRAZNA LISTA ZA TAKVE UPITE
    const { error } = validateGetTests(req.query);
    if (error) return res.status(400).send({msg: error.details });
    
    const testId = req.params.id.toString();
    
    try {
      SubmittedTest.paginate({ "test.teacher._id" : req.user._id, "test._id" : testId }, { page: req.query.page, limit: req.query.limit}).then(result => {
        
        result.docs.forEach(submittedTest => {
          submittedTest.test.questions = undefined;
          submittedTest.submitted_answers = undefined;
        })
      
        return res.status(200).send(result);
      });
    } catch(err) {
      res.status(400).send(err);
    }
  } 
})

// --------------------------------------------------------------------------------------------
// POST  /test/id   (STUDENTS ONLY)
// --------------------------------------------------------------------------------------------
// SUBMITS STUDENT'S ANSWERS AND EYE MOVEMENT DATA
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

// --------------------------------------------------------------------------------------------
// POST  /test    (TEACHERS ONLY)
// --------------------------------------------------------------------------------------------
// CREATES TEST
router.post('/', verifyAccessToken, verifyTeacher, async (req, res) => {
  // TODO ONLY ONE ANSWER IN A QUESTION CAN BE CORRECT!
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

// --------------------------------------------------------------------------------------------
// POST  /result/id    (TEACHERS ONLY)
// --------------------------------------------------------------------------------------------
// TEACHERS CAN SEE ANSWERS AND EYE MOVEMENT DATA FOR A SINGLE STUDENT FOR A SINGLE TEST
router.get('/result/:id', verifyAccessToken, verifyTeacher, async (req, res) => {

  // TODO TREBALO BI DA IDE PROVERA DA SE VRATI ERROR AKO TEACHER POKUSA DA PRISTUPI PODACIMA DRUGOG TEACHERA
  // TRENUTNO SE VRACA PRAZNA LISTA ZA TAKVE UPITE

  if (!req.params.id) return res.status(400).send({ msg: "Test id is missing." });

  const submittedTestId = req.params.id;

  try {
    const submittedTest = await SubmittedTest.findOne({ "test.teacher._id" : req.teacher._id, "_id" : submittedTestId });
    
    return res.status(200).send(submittedTest);
  } catch(err) {
    res.status(400).send(err);
  }
})




module.exports = router
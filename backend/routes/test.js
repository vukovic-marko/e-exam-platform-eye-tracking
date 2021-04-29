const router = require('express').Router();
const asyncHandler = require('express-async-handler')
const createError = require('http-errors')

const Test = require('../model/Test');
const SubmittedTest = require('../model/SubmittedTest')

const { crunchData } = require('../utils/crunchData')

const { verifyAccessToken } = require('../utils/verifyToken')

const { verifyTeacher, verifyStudent, verifyUser } = require('../utils/verifyUser')

const { validateCreateTest, validateGetTests, validateSubmitAnswers } = require('../validation/test');

const MULTIPLE_CHOICE = 'MULTIPLE_CHOICE';
const ESSAY = 'ESSAY';
const MIXED = 'MIXED';

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
router.get('/', verifyAccessToken, verifyUser, asyncHandler(async (req, res) => {
  const { error } = validateGetTests(req.query);
  if (error) throw createError(400, error.details);
  
  let query = {}
  if (req.user.role === 'teacher') {
    query["teacher._id"] = req.user._id;
  } else if (req.user.role === 'student') {
    query["students.student._id"] = {$ne: req.user._id};
  }

  Test.paginate(query, { page: req.query.page, limit: req.query.limit }).then(result => {
    if (result.totalPages < result.page) {
      throw createError(400, 'Page does not exist.')
    }

    result.docs.forEach(test => {
      test.questions = undefined;
    })

    res.status(200).send(result);
  })

}))

// --------------------------------------------------------------------------------------------
// GET  /results    (STUDENTS ONLY)
// --------------------------------------------------------------------------------------------
// STUDENTS CAN SEE TESTS THEY TOOK
router.get('/results', verifyAccessToken, verifyStudent, asyncHandler(async (req, res) => {
  const { error } = validateGetTests(req.query);
  if (error) throw createError(400, error.details);
  
  let query = {}
  query["students.student._id"] = req.student._id;

  Test.paginate(query, { page: req.query.page, limit: req.query.limit }).then(result => {
    if (result.totalPages < result.page) {
      throw createError(400, 'Page does not exist.')
    }

    result.docs.forEach(test => {
      test.questions = undefined;
      test.students = test.students.filter(student => student.student._id == req.student._id)
    })

    res.status(200).send(result);
  })

}))

// --------------------------------------------------------------------------------------------
// GET  /test/id
// --------------------------------------------------------------------------------------------
// STUDENTS GET QUESTIONS AND TEST DETAILS AND START TIME AND DATE GETS LOGGED
// TEACHERS GET STUDENTS WHO TOOK TEST WITH THE PROVIDED ID
router.get('/:id', verifyAccessToken, verifyUser, asyncHandler(async (req, res) => {

  if (!req.params.id) throw createError(400, "Test id is missing.");

  if (req.user.role === 'student') {
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

  } else if (req.user.role === 'teacher') {
    // TODO TREBALO BI DA IDE PROVERA DA SE VRATI ERROR AKO TEACHER POKUSA DA PRISTUPI PODACIMA DRUGOG TEACHERA
    // TRENUTNO SE VRACA PRAZNA LISTA ZA TAKVE UPITE
    const { error } = validateGetTests(req.query);
    if (error) throw createError(400, error.details);
    
    const testId = req.params.id.toString();
    
    SubmittedTest.paginate(
      { "test.teacher._id" : req.user._id, "test._id" : testId }, 
      { page: req.query.page, limit: req.query.limit}
    ).then(result => {
      
      result.docs.forEach(submittedTest => {
        submittedTest.test.questions = undefined;
        submittedTest.submitted_answers = undefined;
      })
    
      return res.status(200).send(result);
    });

  } 
}))

// --------------------------------------------------------------------------------------------
// POST  /test/id   (STUDENTS ONLY)
// --------------------------------------------------------------------------------------------
// SUBMITS STUDENT'S ANSWERS AND EYE MOVEMENT DATA
router.post('/:id', verifyAccessToken, verifyStudent, asyncHandler(async (req, res) => {
  
  const { error } = validateSubmitAnswers(req.body);
  if (error) throw createError(400, error.details);

  let submittedTest = await SubmittedTest.findOne({ "student._id" : req.student._id, "test._id" : req.params.id.toString() });
  if (!submittedTest) throw createError(400, 'Cannot submit answers without opening it first.');
  if (submittedTest.submitted_at) throw createError(400, 'Answers already submitted.');

  if (submittedTest.test.questions.length !== req.body.answers.length) {
    throw createError(400, 'Number of answers does not match with the number of questions.');
  }

  let points = 0;

  if (submittedTest.test.type === MULTIPLE_CHOICE) {
    submittedTest.test.questions.forEach((question, idx) => {
      const correct_answer = question.answers.find(answer => answer.correct === true);
      
      if (question._id.toString() !== req.body.answers[idx].question_id.toString())
        throw createError(400, 'Question and submitted answer id mismatch.');

      if (correct_answer._id.toString() === req.body.answers[idx].answer_id.toString()) {
        // CORRECT ANSWER
        points += question.points;
        req.body.answers[idx].correct = true;
      } else {
        // INCORRECT ANSWER
        req.body.answers[idx].correct = false;
      }
    })
    submittedTest.points = points;
  }

  submittedTest.submitted_answers = req.body.answers;
  submittedTest.submitted_at = new Date();

  submittedTest.test.questions.forEach((e,i) => {
    const { sequence, sequence_length, summary } = crunchData(e.areas_of_interest, submittedTest.submitted_answers[i].gaze_data);

    submittedTest.submitted_answers[i].crunched_gaze_data = {
      sequence: sequence,
      sequence_length: sequence_length,
      summary: summary
    }

  })

  try {

    await Test.findByIdAndUpdate(req.params.id.toString(), 
    { $push : { students: {
      student: {
        _id: req.student._id,
        username: req.student.username
      },
      started_at: submittedTest.started_at,
      submitted_at: submittedTest.submitted_at,
      points: submittedTest.points
    }}},
    {safe: true, upsert: true, new : true}
    );
  } catch(err) {
    throw createError(500, err.message);
  }


  await submittedTest.save();
  
  submittedTest.test.questions = undefined;
  submittedTest.submitted_answers.forEach(item => {
    item.answer_id = undefined;
    item.answer = undefined;
    item.gaze_data = undefined;
    item.crunched_gaze_data = undefined;
  });

  res.status(200).send(submittedTest);
}))

// --------------------------------------------------------------------------------------------
// POST  /test    (TEACHERS ONLY)
// --------------------------------------------------------------------------------------------
// CREATES TEST
router.post('/', verifyAccessToken, verifyTeacher, asyncHandler(async (req, res) => {

  const { error } = validateCreateTest(req.body);
  if (error) throw createError(400, error.details);

  let count_multiple_choice = 0;
  let count_essay = 0;

  req.body.questions.forEach(question => {

    if (question.type === MULTIPLE_CHOICE) {
      count_multiple_choice++;
      
      if (!question.answers || question.answers.length < 2) throw createError(400, "Multiple choice questions must have at least two answers!");

      let correct_answers = 0;
      question.answers.forEach(answer => {
        if (answer.correct) {
          correct_answers++;
        }
      })
      if (correct_answers != 1) {
        throw createError(400, 'There must be one correct answer in every question!');
      }
    } else if (question.type === ESSAY) { 
      count_essay++;
    }

  })

  if (count_multiple_choice && count_essay) {
    req.body.type = MIXED;
  } else if (count_multiple_choice) {
    req.body.type = MULTIPLE_CHOICE;
  } else if (count_essay) {
    req.body.type = ESSAY;
  }

  const test = new Test(req.body)

  test.test_points = test.questions.reduce((temp, current) => temp + current.points, 0);
  test.teacher = (({_id, username}) => ({_id, username}))(req.teacher);

  await test.save();
  res.status(200).send(test);
}))

// --------------------------------------------------------------------------------------------
// GET  /result/id    (TEACHERS ONLY)
// --------------------------------------------------------------------------------------------
// TEACHERS CAN SEE ANSWERS AND EYE MOVEMENT DATA FOR A SINGLE STUDENT FOR A SINGLE TEST
router.get('/result/:id', verifyAccessToken, verifyTeacher, asyncHandler(async (req, res) => {
  // TODO TREBALO BI DA IDE PROVERA DA SE VRATI ERROR AKO TEACHER POKUSA DA PRISTUPI PODACIMA DRUGOG TEACHERA
  // TRENUTNO SE VRACA PRAZNA LISTA ZA TAKVE UPITE
  if (!req.params.id) throw createError(400, "Test id is missing.");

  const submittedTestId = req.params.id;

  const submittedTest = await SubmittedTest.findOne({ "test.teacher._id" : req.teacher._id, "_id" : submittedTestId });
  if (!submittedTest) throw createError(404, "Doesn't exist.")

  res.status(200).send(submittedTest);
}))



module.exports = router
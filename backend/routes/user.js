const router = require('express').Router();
const bcrypt = require('bcrypt')
const { v4 } = require('uuid')
const asyncHandler = require('express-async-handler')
const createError = require('http-errors')

const User = require('../model/User')
const Student = require('../model/Student')

const { createAccessToken, createRefreshToken } = require('../utils/createToken')
const { verifyRefreshToken } = require('../utils/verifyToken')

const { validateLogin, validateRegistration } = require('../validation/authentication')

// REGISTER STUDENT
router.post('/register', asyncHandler(async (req, res) => {

  const { error } = validateRegistration(req.body);
  if (error) throw createError(400, error.details);

  const usernameExists = await User.findOne({username: req.body.username});
  if (usernameExists) throw createError(400, 'Username already taken.')

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new Student({username: req.body.username, password: hashedPassword});
  await user.save();
  res.status(200).send({user: user._id});

}))

// LOGIN
router.post('/login', asyncHandler(async (req, res) => {

  const { error } = validateLogin(req.body);
  if (error) throw createError(400, error.details);

  const user = await User.findOne({username: req.body.username});
  if (!user) throw createError(401, 'Username and/or password error.');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) throw createError(401, 'Username and/or password error.');

  const sessionId = v4();
  
  const accessToken = createAccessToken(user._id, user.username, user.role);
  const refreshToken = createRefreshToken(user._id, sessionId);
  
  await User.findByIdAndUpdate(req.body._id, {sessionId: sessionId}, {returnOriginal: true, useFindAndModify: false});

  let date = new Date();
  date.setDate(date.getDate() + 1);

  res.cookie('re-to', refreshToken, {expires: date, httpOnly: true });
  res.status(200).send({accessToken: accessToken});
}))

// REFRESH ACCESS TOKEN
router.post('/refresh', verifyRefreshToken, asyncHandler(async (req, res) => {
  
  const user = await User.findById(req.user._id);
  if (!user) throw createError(400, 'Request not valid.');
  // if (user.sessionId !== req.user.sessionId) return res.status(401).send({ msg: 'Request not valid.' })

  const refreshedAccessToken = createAccessToken(user._id, user.username, user.role);
  const refreshedRefreshToken = createRefreshToken(user._id, user.sessionId);

  let date = new Date();
  date.setDate(date.getDate() + 1);

  res.cookie('re-to', refreshedRefreshToken, {expires: date, httpOnly: true});
  res.status(200).send({accessToken: refreshedAccessToken});
}))

// LOGOUT
router.post('/logout', verifyRefreshToken, asyncHandler(async (req,res) => {
  
  await User.findByIdAndUpdate(req.user._id, {$unset: {sessionId: 1}}, {returnOriginal: true, useFindAndModify: false});

  res.clearCookie('re-to', {expires: new Date(), httpOnly: true})
  res.send('success')
}))

module.exports = router
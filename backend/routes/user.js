const router = require('express').Router();
const bcrypt = require('bcrypt')
const { v4 } = require('uuid')

const User = require('../model/User')
const Student = require('../model/Student')
const Teacher = require('../model/Teacher')

const { createAccessToken, createRefreshToken } = require('../utils/createToken')
const { verifyAccessToken, verifyRefreshToken } = require('../utils/verifyToken')
router.post('/register', async (req, res) => {

  // ADD VALIDATION

  const usernameExists = await User.findOne({username: req.body.username});
  if (usernameExists) return res.status(400).send('Username already taken.')

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  try { 
    const user = new Student({username: req.body.username, password: hashedPassword});
    await user.save();
    res.status(200).send({user: user._id})
  } catch(err) {
    res.status(400).send({msg: err})
  }
})

router.post('/login', async (req, res) => {

  // ADD VALIDATION

  const user = await User.findOne({username: req.body.username});
  if (!user) return res.status(400).send('Username and/or password error.');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Username and/or password error.');

  const sessionId = v4();
  
  const accessToken = createAccessToken(user._id, user.role);
  const refreshToken = createRefreshToken(user._id, sessionId);

  await User.findOneAndUpdate({username: req.body.username}, {sessionId: sessionId}, {returnOriginal: true, useFindAndModify: false});

  let date = new Date();
  date.setDate(date.getDate() + 1);

  res.cookie('re-to', refreshToken, {expires: date, httpOnly: true, path: "/user", domain: "localhost"});
  res.status(200).send({accessToken: accessToken});
})

router.get('/', verifyRefreshToken, (req, res) => {
  res.send(req.user)
})

module.exports = router
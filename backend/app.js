require('dotenv').config() // load environment variables from .env file 

const express = require('express'); // express for rest
const mongoose = require('mongoose');
const cookie = require('cookie-parser');
const createError = require('http-errors');

const app = express();

const user = require('./routes/user')
const test = require('./routes/test')

const port = process.env.PORT || 3000 // load port as an environment variable or use default "3000"

// CONNECT TO DB
mongoose.connect(process.env.DB_CONNECTION || "mongodb://localhost:27017/test", 
  {useNewUrlParser: true, useUnifiedTopology: true}, 
  () => console.log('Connected to db')
);

// BIND ERROR LOG TO CONSOLE
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));

// ENABLE JSON PARSER FOR REQUEST BODY PARAMS
app.use(express.json())

// ENABLE COOKIE PARSER
app.use(cookie())

// ROUTE /user REQUESTS TO user
app.use('/user', user)

// ROUTE /test REQUESTS TO test
app.use('/test', test)

// CATCH 404 ERRORS AND FORWARD THEM TO ERROR HANDLER
app.use((req, res, next) => {
  next(createError(404))
})

// ERROR HANDLER
app.use((error, req, res, next) => {
  res.status(error.status || 500).send(error);
})

// LISTEN ON SPECIFIED PORT
app.listen(port, () => {
  console.log(`Backend app listening at http://localhost:${port}`)
})
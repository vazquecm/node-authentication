'use strict';


const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

const app = express();
const PORT = process.env.PORT || 3000;

// use the first part if it exists if not use the second part
const SESSION_SECRET = process.env.SESSION_SECRET || 'supersecret';

app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({ extended: false}));

// keeps the info stored in a session ID cookie for user tracking
app.use(session({
  secret: SESSION_SECRET,
  // allows you to keep track of session keeping all data
  store: new RedisStore()
}));
/// this code uses more analytics in getting the user info stored in memory for when they login in again.
app.use((req, res, next) => {
  req.session.visits = req.session.visits || {};
  req.session.visits[req.url] = req.session.visits[req.url] || 0;
  req.session.count[req.url]++
  console.log(req.session);
  next();
});

// home page
app.get('/', (req, res) => {
  res.render('index');
});

// Root Route -- login form, is already registered
app.get('/login', (req, res) => {
  res.render('login');
});
app.post('/login', (req, res) => {
  res.redirect('/');
});


/// registration form
app.get('/register', (req, res) => {
  res.render('register');
});
/// password verification on registration form
app.post('/register', (req, res) => {
  if (req.body.password === req.body.verify) {
    res.redirect('/login');
  } else {
    res.render('register', {
      email: req.body.email,
      message: 'Passwords do not match'
    });
  }
});


app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

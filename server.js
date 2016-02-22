'use strict';


const bodyParser = require('body-parser');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({ extended: false}));

// home page
app.get('/', (req, res) => {
  res.render('index');
});

// login form is already registered
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

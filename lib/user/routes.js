const express = require('express');
const router = express.Router();


const User = require('./models');

// Root Route -- login form, is already registered
router.get('/login', (req, res) => {
  res.render('login');
});
router.post('/login', (req, res) => {
  User.findOne({email: req.body.email},
  (err, user) => {
    if (err) throw err;

    req.session.user = user;
    req.redirect('/');
  });
});

/// registration form
router.get('/register', (req, res) => {
  res.render('register');
});
/// password verification on registration form
router.post('/register', (req, res) => {
  if (req.body.password === req.body.verify) {
    User.findOne({email: req.body.email}, (err, user) => {
      if (err) throw err;

      if (user) {
        res.redirect('/login');
      } else {
        User.create(req.body, (err) => {
          if (err) throw err;

          res.redirect('/login');
        });
      }
    });
  } else {
    res.render('register', {
      email: req.body.email,
      message: 'Passwords do not match'
    });
  }
});
module.exports = router;

const express = require('express');
const passport = require('passport');
const router = express.Router();

const User = require('./models');

// just executing the local.js file
require('./local');

// Root Route -- login form, is already registered
router.get('/login', (req, res) => {
  res.render('login');
});


router.post('/login',
  passport.authenticate('local',
    {
      failureFlash: 'Incorrect email or password',
      failureRedirect: '/login',
      successFlash: 'Success!',
      successRedirect: '/'
    }
  )
);

// req.session.user = user;
router.delete('/login', (req, res) => {
  req.session.regenerate(function(err) {
    if (err) throw err;

    res.redirect('/');
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

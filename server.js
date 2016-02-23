'use strict';


const bodyParser = require('body-parser');
const express = require('express');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);// for memory storage

const userRoutes = require('./lib/user/routes');

const app = express();
const PORT = process.env.PORT || 3000;
// use the first part if it exists if not use the second part
const SESSION_SECRET = process.env.SESSION_SECRET || 'supersecret';

app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({ extended: false}));

app.use(methodOverride('_method'));
// keeps the info stored in a session ID cookie for user tracking
app.use(session({
  secret: SESSION_SECRET,
  // allows you to keep track of session keeping all data
  store: new RedisStore()
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(userRoutes);

app.locals.title = '';

app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// home page
app.get('/', (req, res) => {
  res.render('index');
});


mongoose.connect('mongodb://localhost:27017/nodeauth', (err) => {
  if (err) throw err;

  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
});

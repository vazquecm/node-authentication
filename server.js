'use strict';


const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);// for memory storage

const userRoutes = require('./lib/user/routes');

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

app.use(userRoutes);

app.locals.title = '';

app.use((req, res, next) => {
  app.locals.user = req.session.user || { email: 'Guest' };
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

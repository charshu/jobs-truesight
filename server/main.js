// @flow
const passport = require('passport');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const LocalStrategy = require('passport-local').Strategy;

// setup mongoose
const dbConnection = require('../common/dbConnection');

dbConnection();
const AuthMiddlewareHandler = require('./middlewares/authentication');
const User = require('./models/User');
// import models
const Models = {
  User,
};

// Setup express
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

// Setup passport
passport.use(new LocalStrategy({ usernameField: 'email' }, AuthMiddlewareHandler.LocalStrategyHandler(Models)));
passport.serializeUser(AuthMiddlewareHandler.serializeUser(Models));
passport.deserializeUser(AuthMiddlewareHandler.deserializeUser(Models));

// import routes
app.use(require('./routes')(Models));


app.listen(3000, () => {
  console.log('app is start on 3000');
});

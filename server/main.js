// @flow
const passport = require('passport');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');

// setup mongoose
const dbConnection = require('../common/dbConnection');
dbConnection();

const AuthMiddlewareHandler = require('./middlewares/authentication');
const authenticationRoute = require('./routes/authentication.routes');

// import models
const User = require('./models/User');

const Models = {
  User,
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy({ usernameField: 'email' }, AuthMiddlewareHandler.LocalStrategyHandler(Models)));
passport.serializeUser(AuthMiddlewareHandler.serializeUser(Models));
passport.deserializeUser(AuthMiddlewareHandler.deserializeUser(Models));

app.use('/auth', authenticationRoute(Models));


app.listen(3000, function(){
  console.log('app is start on 3000');
})

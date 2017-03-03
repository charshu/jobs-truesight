// @flow
const passport = require('passport');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
// setup mongoose
const dbConnection = require('../common/dbConnection');

dbConnection();

const app = express();
const AuthMiddlewareHandler = require('./middlewares/authentication');
const ContextMiddlewareHandler = require('./middlewares/context.middleware');
const User = require('./models/User');

const context = {
  User,
};
app.use(ContextMiddlewareHandler(context));

// Setup express

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
const fbStrategyConfig = {
  clientID: '1744234895905318',
  clientSecret: '337508e13131ff63bcaaba43052c5722',
  callbackURL: '/auth/facebook/callback',
  profileFields: [
    'name', 'email', 'link', 'locale', 'timezone',
  ],
  passReqToCallback: true,
};
passport.use(new LocalStrategy({ usernameField: 'email' }, AuthMiddlewareHandler.LocalStrategyHandler(context)));
passport.use(new FacebookStrategy(fbStrategyConfig, AuthMiddlewareHandler.FacebookStrategyHandler(context)));
passport.serializeUser(AuthMiddlewareHandler.serializeUser(context));
passport.deserializeUser(AuthMiddlewareHandler.deserializeUser(context));

// import routes
app.use(require('./routes')());


app.listen(3000, () => {
  console.log('app is start on 3000');
});

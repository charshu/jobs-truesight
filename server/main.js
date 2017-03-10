// @flow
const passport = require('passport');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const Logger = require('../common/logger');

// setup mongoose
const dbConnection = require('../common/dbConnection');

dbConnection();

const app = express();
const AuthMiddlewareHandler = require('./middlewares/authentication.middleware');
const ContextMiddlewareHandler = require('./middlewares/context.middleware');
const User = require('./models/User');

const context = {
  User,
  Logger,
};
app.use(ContextMiddlewareHandler(context));
app.all('/*', (req, res, next) => {
    // res.header("Access-Control-Allow-Origin", "*");
  console.log(`origin ${req.headers.origin}`);
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-type');
  next();
});
// Setup express
app.all('/', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  next();
});
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
passport.use(AuthMiddlewareHandler.LocalStrategyMiddleware(context));
passport.use(AuthMiddlewareHandler.FacebookStrategyHandler(context));
passport.serializeUser(AuthMiddlewareHandler.serializeUser(context));
passport.deserializeUser(AuthMiddlewareHandler.deserializeUser(context));


// import routes
app.use(require('./routes')());


app.listen(3000, () => {
  Logger('app is start on 3000');
});

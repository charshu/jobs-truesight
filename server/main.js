// TODO: setup express and routes
// and add dependency

const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const passport = require('passport');
const errorHandler = require('errorhandler');
const flash = require('express-flash');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator'); 

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({path: '.env.example'});

const IS_DEV = process.env.NODE_ENV !== 'production';
if(IS_DEV) {
  // setup dev here
}

/**
 * Create Express server.
 */
const app = express();

/**
 * Connect to MongoDB.
 */
const connection = require('./helpers/connection');
connection();

/**
 * Express configuration.
 */
app.use(require('cookie-parser')());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.use(expressValidator());//req.assert(...)
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'mysecret',
  store: new MongoStore({
    url: 'mongodb://localhost:27017/test2',
    autoReconnect: true
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

/**
 * Return Path Config.
 */
app.use((req, res, next) => {
  // Save the last req path before get into login, auth or signup pages
  // After successful login, redirect back to the intended page
  if (!req.user && req.path !== '/login' && req.path !== '/signup' && !req.path.match(/^\/auth/) && !req.path.match(/\./)) {
    req.session.returnTo = req.path;
  } else if (req.user && req.path == '/account') {
    req.session.returnTo = req.path;
  }
  next();
});

/**
 * App routes.
 */
app.use(require('./routes'));

/**
 * Error Handler.
 */
app.use(errorHandler());


/**
 * Start Express server.
 */
app.listen(3000, function(){
  console.log('Remote server start on 3000');
  
});

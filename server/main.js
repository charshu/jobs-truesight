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

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({path: '.env.example'});

const IS_DEV = process.env.NODE_ENV !== 'production';
if(IS_DEV) {
  // setup dev here
}

// setup express
const app = express();

// connect mongo
const connection = require('./helpers/connection');
connection();

app.use(require('cookie-parser')());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

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
app.use(require('./routes'));
app.use(errorHandler());


app.listen(3000, function(){
  console.log('Remote server start on 3000');
  
});

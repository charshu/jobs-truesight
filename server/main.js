// TODO: setup express and routes
// and add dependency

const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const bodyParser = require('body-parser');
const passport = require('passport');


const IS_DEV = process.env.NODE_ENV !== 'production';
if(IS_DEV) {
  // setup dev here
}

// setup express
const app = express();
const connection = require('./helpers/connection');

app.use(require('./routes'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(passport.initialize());
app.use(passport.session());


app.listen(3000, function(){
  console.log('Remote server start on 3000');
});


// @flow
const passport = require('passport');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const Logger = require('../common/logger');

const { graphqlExpress, graphiqlExpress } = require('graphql-server-express');
const schema = require('./schema');


// setup mongoose
const dbConnection = require('../common/dbConnection');

dbConnection();

const app = express();
const AuthMiddlewareHandler = require('./middlewares/authentication.middleware');
const ContextMiddlewareHandler = require('./middlewares/context.middleware');
const User = require('./models/User');
const { TestSheet, ChoicePreset, Question, AnswerSheet, Choice } = require('./models/Test');
const { Job, WorkPlace } = require('./models/Job');

const context = {
  User,
  AnswerSheet,
  ChoicePreset,
  Question,
  Choice,
  TestSheet,
  Job,
  WorkPlace,
  Logger

};
app.use(ContextMiddlewareHandler(context));

// Setup express
app.use(require('cors')({
  origin: 'http://localhost:8080',
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  allowedHeaders: ['Content-type', 'X-Requested-With'],
  optionsSuccessStatus: 204
}));
// app.all('/*', (req, res, next) => {
//     // res.header("Access-Control-Allow-Origin", "*");
//   console.log(`origin ${req.headers.origin}`);
//   res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//   res.header('Access-Control-Allow-Origin', req.headers.origin);
//   res.header('Access-Control-Allow-Credentials', true);
//   res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-type');
//   next();
// });

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

// Setup passport
passport.use(AuthMiddlewareHandler.LocalStrategyMiddleware(context));
passport.use(AuthMiddlewareHandler.FacebookStrategyHandler(context));
passport.serializeUser(AuthMiddlewareHandler.serializeUser(context));
passport.deserializeUser(AuthMiddlewareHandler.deserializeUser(context));


// import routes
app.use(require('./routes')());

const root = {
  hello: () => 'Hello world!'
};
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
app.use('/graphql', bodyParser.json(), graphqlExpress(req => ({
  schema,
  rootValue: root,
  context: Object.assign({ user: req.user }, req.context)
})));

app.listen(3000, () => {
  Logger('app is start on 3000');
});

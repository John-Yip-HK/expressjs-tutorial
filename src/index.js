const express = require('express');

const cookieParser = require('cookie-parser');
const session = require('express-session');

const MongoStore = require('connect-mongo');

// Passport-related imports
const passport = require('passport');

require('./strategies/local');

const groceriesRouter = require('./routes/groceries');
const marketsRouter = require('./routes/markets');
const authRouter = require('./routes/auth');

require("./database")

const app = express();
const PORT = 3001;

/*
  Register a middleware to parse POST request body properly.
  Middleware - a function that is invoked in the middle of 2 main functionalities.
*/
app.use(express.json());

// Parse URL-encoded data.
app.use(express.urlencoded({ extended: true }));

// Parse cookie content.
app.use(cookieParser());

/*
  Use session to persist data on server side.
*/
app.use(session({
  secret: 'thisIsASecret',
  resave: false,
  saveUninitialized: false,

  // Our sessions are not stored in our MongoDB database. Session is persisted after restart.
  store: MongoStore.create({
    mongoUrl: 'mongodb://localhost:27017/expressjs_tutorial'
  }),
}));

// Create a simple middleware and apply it to all routes.
app.use((req, res, next) => {
  console.log(`${req.method}: ${req.url}`);
  next();
});

app.use(passport.initialize());

// Using passport authentication usually also uses passport session.
app.use(passport.session());

// Prevent auth routes from being 'protected' by the below middleware.
app.use('/api/v1/auth', authRouter);

/*
  Authenticate user by checking its session.
  The `req.user` value is defined by callback argument of `passport.deserializeUser()` middleware in `strategies/local.js`.
  The session does not persist after server is stopped and restarted.
*/
app.use((req, res, next) => {
  if (req.user) {
    console.log(req.user);
    
    next();
  } else {
    res.sendStatus(401);
  }
});

// Register `/groceries` router into our main express app with path prefix.
app.use('/api/v1/groceries', groceriesRouter);
app.use('/api/v1/markets', marketsRouter);

app.listen(PORT, () => {
  console.log(`Running Express Server on Port ${PORT}`);
});

const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const groceriesRouter = require('./routes/groceries');
const marketsRouter = require('./routes/markets');
const authRouter = require('./routes/auth');

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
}));

// Create a simple middleware and apply it to all routes.
app.use((req, res, next) => {
  console.log(`${req.method}: ${req.url}`);
  next();
});

// Prevent auth routes from being 'protected' by the below middleware.
app.use('/api/v1/auth', authRouter);

// Authenticate user by checking its session.
app.use((req, res, next) => {
  if (req.session.user) {
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

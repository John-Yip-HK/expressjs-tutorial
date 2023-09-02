const express = require('express');
const groceriesRouter = require('./routes/groceries');
const marketsRouter = require('./routes/markets');

const app = express();
const PORT = 3001;

/*

Register a middleware to parse POST request body properly.
Middleware - a function that is invoked in the middle of 2 main functionalities.

*/
app.use(express.json());

// Parse URL-encoded data.
app.use(express.urlencoded({ extended: true }));

// Create a simple middleware and apply it to all routes.
app.use((req, res, next) => {
  console.log(`${req.method}: ${req.url}`);
  next();
});

// Register `/groceries` router into our main express app with path prefix.
app.use('/api/v1/groceries', groceriesRouter);
app.use('/api/v1/markets', marketsRouter);

app.listen(PORT, () => {
  console.log(`Running Express Server on Port ${PORT}`);
});

const express = require('express');

const app = express();
const PORT = 3001;

// Register a middleware to parse POST request body properly.
// Middleware - a function that is invoked in the middle of 2 main functionalities.
app.use(express.json());

// Parse URL-encoded data.
app.use(express.urlencoded({ extended: true }));

// Create a simple middleware and apply it to all routes.
app.use((req, res, next) => {
  console.log(`${req.method}: ${req.url}`);
  next();
});

app.listen(PORT, () => {
  console.log(`Running Express Server on Port ${PORT}`);
});

const groceryList = [
  {
    item: 'milk',
    quentity: 2,
  },
  {
    item: 'cereal',
    quentity: 1,
  },
]

// Can think every single parameter after the route name as 'middleware'.
app.get('/groceries', (req, res, next) => {
  console.log('Before handling request.');
  next();
}, (req, res, next) => {
  res.send(groceryList);
  next();
}, (_, res) => {
  console.log('Finish executing GET request');

  // You cannot send another response.
  // res.send(403);
});

app.post('/groceries', (req, res) => {
  console.log(req.body);

  groceryList.push(req.body);

  // Deprecated
  // res.send(201);

  res.sendStatus(201);
});
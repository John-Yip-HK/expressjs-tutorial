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
  {
    item: 'pop-tarts',
    quentity: 3,
  },
]

// Can think every single parameter after the route name as 'middleware'.
// Route parameter: capture value at certain position of the URL.
app.get('/groceries', (req, res, next) => {
  res.send(groceryList);
});

app.get('/groceries/:item', (req, res) => {
  // Every route param is stored as key-value pair in this object.
  // console.log(req.params.item);

  const { item } = req.params;
  const groceryItem = groceryList.find((grocery) => grocery.item === item);

  res.send(groceryItem);
});

app.post('/groceries', (req, res) => {
  console.log(req.body);

  groceryList.push(req.body);

  // Deprecated
  // res.send(201);

  res.sendStatus(201);
});
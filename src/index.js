const express = require('express');

const app = express();
const PORT = 3001;

// Register a middleware to parse POST request body properly.
// Middleware - a function that is invoked in the middle of 2 main functionalities.
app.use(express.json());
// Parse URL-encoded data.
app.use(express.urlencoded({ extended: true }));

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

app.get('/groceries', (req, res) => {
  res.send(groceryList);
});

app.post('/groceries', (req, res) => {
  console.log(req.body);

  groceryList.push(req.body);

  // Deprecated
  // res.send(201);

  res.sendStatus(201);
});
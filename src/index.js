const express = require('express');

const app = express();
const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Running Express Server on Port ${PORT}`);
});

app.get('/groceries', (req, res) => {
  res.send([
    {
      item: 'milk',
      quentity: 2,
    },
    {
      item: 'cereal',
      quentity: 1,
    },
  ]);
});
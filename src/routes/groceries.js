const { Router } = require('express');

const router = Router();

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
router.get('', (req, res, next) => {
  res.send(groceryList);
});

router.get('/:item', (req, res) => {
  // Every route param is stored as key-value pair in this object.
  // console.log(req.params.item);

  const { item } = req.params;
  const groceryItem = groceryList.find((grocery) => grocery.item === item);

  res.send(groceryItem);
});

router.post('', (req, res) => {
  console.log(req.body);

  groceryList.push(req.body);

  // Deprecated
  // res.send(201);

  res.sendStatus(201);
});

module.exports = router;
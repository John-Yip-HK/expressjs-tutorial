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
  // Set a cookie to the client.
  res.cookie('visited', true, {
    maxAge: 60000,
  });

  res.send(groceryList);
});

router.get('/:item', (req, res) => {
  // Get raw cookies
  // console.log(req.headers.cookie);

  // Need cookie parser to get the cookie value from req.cookies.
  console.log(req.cookies);

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

router.get('/shopping/cart', (req, res) => {
  // Get cart of a user.
  const { cart } = req.session;

  if (!cart) {
    res.send('You have no cart session.');
  } else {
    res.send(cart);
  }
});

router.post('/shopping/cart/item', (req, res) => {
  const { item, quantity } = req.body;
  const cartItem = { item, quantity };

  console.log(cartItem);

  /*
    Session ID is not changed if the session is not modified.
    Session modified ==> the session ID will be relevant to the changed session and
    every subsequent change to that session.
  */
  // req.sessionID;
  const { cart } = req.session;

  console.log(cart);

  if (cart) {
    req.session.cart.items.push(cartItem);
  } else {
    /* 
      We modify the session here.
      The moment you modify the session, the cookie data related to that change is sent back to the client.
    */
    req.session.cart = {
      items: [cartItem],
    };
  }

  res.sendStatus(201);
});

module.exports = router;
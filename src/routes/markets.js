const { Router } = require('express');

const router = Router();

const supermarkets = [
  {
    id: 1,
    store: 'Whole Foods',
    miles: 0.6,
  },
  {
    id: 2,
    store: 'Trader Joe',
    miles: 2.5,
  },
  {
    id: 3,
    store: 'Albertsons',
    miles: 2.8,
  },
  {
    id: 4,
    store: 'Trader Joe',
    miles: 3.5,
  },
  {
    id: 5,
    store: 'Albertsons',
    miles: 1.8,
  },
];

router.get('', (req, res) => {
  // An object storing all query-query value pairs.
  const { miles } = req.query;
  const parsedMiles = Number.parseFloat(miles, 10);

  // `miles` query parameter may not be present.
  if (miles && !Number.isNaN(parsedMiles)) {
    const filteredStores = supermarkets.filter((market) => market.miles <= parsedMiles);
    res.send(filteredStores);
  } else {
    res.send(supermarkets);
  }
})

module.exports = router;
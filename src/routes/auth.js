const { Router } = require('express');
const User = require('../database/schemas/User');
const { hashPassword, comparePassword } = require("../utils/helpers");
const passport = require('passport');

const router = Router();

// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;
//   if (!email || !password) {
//     res.sendStatus(400);
//   }

//   const userDB = await User.findOne({ email });
//   if (!userDB) {
//     return res.sendStatus(401);
//   }

//   const isValid = comparePassword(password, userDB.password);
//   if (isValid) {
//     req.session.user = userDB;
    
//     return res.sendStatus(200);
//   } else {
//     return res.sendStatus(401);
//   }
// });

// Authenticate a user with `local` passport middleware.
router.post('/login', passport.authenticate('local'), 
(req, res) => {
  console.log('Logged In');
  res.sendStatus(200);
});

router.post('/register', async (req, res) => {
  const { email } = req.body;

  // Create a new user if the user has not been found in the user model based on the `email`.
  const userDB = await User.findOne({
    email
  });

  if (userDB) {
    res.status(400).send({ msg: 'User already exists.' });
  } else {
    const password = hashPassword(req.body.password);
    await User.create({
      password, email
    });
    res.sendStatus(201);
  }
});

module.exports = router;
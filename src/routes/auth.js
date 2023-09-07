const { Router } = require('express');
const passport = require('passport');

const { authRegisterController } = require('../controllers/auth');

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

router.post('/register', authRegisterController);

router.get('/discord', passport.authenticate('discord'), (req, res) => {
  // Trigger discord strategy and redirect the user to Discord platform for log in.
  res.sendStatus(200);
})

router.get('/discord/redirect', passport.authenticate('discord'), (req, res) => {
  res.sendStatus(200);
})

module.exports = router;
const { Router } = require('express');
const passport = require('passport');

const { registerUserController } = require('../controllers/auth');

const router = Router();

router.post('/login', 
  passport.authenticate('local'), 
  (_, res) => {
    return res.sendStatus(201);
  }
);

router.post('/register', registerUserController);

router.get('/login/google', passport.authenticate('google'));

router.get('/google/redirect', 
  passport.authenticate('google'), 
  (req, res) => {
    if (req.user) {
      return res.sendStatus(201);
    } else {
      return res.sendStatus(401);
    }
  }  
);

router.post('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(err);
    else return res
      .status(201)
      .clearCookie('connect.sid', { httpOnly: true, })
      .send('Logout successful.');
  });
});

module.exports = router;
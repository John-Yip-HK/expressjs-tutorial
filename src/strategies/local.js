const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');

const { dbQuery } = require('../db');
const { comparePassword } = require('../utils');

passport.use(new LocalStrategy({
  usernameField: 'email',
}, async (email, password, done) => {
  try {
    const userExistsQuery = `
      SELECT * FROM users 
      WHERE email = $1
      LIMIT 1;
    `;
    const userExistsResult = await dbQuery(userExistsQuery, [email]);

    if (userExistsResult.length === 0) {
      return done(null, false, { message: 'User not found' });
    }

    const user = userExistsResult[0];
    const isValid = await comparePassword(password, user.hashed_password);
    
    if (isValid) {
      return done(null, user);
    } else {
      return done(null, false, { message: 'Password is incorrect.' });
    }
  } catch (error) {
    return done(error);
  }
}))

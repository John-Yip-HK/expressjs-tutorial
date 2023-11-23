const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');

const { dbQuery } = require('../db');
const { comparePassword } = require('../utils');

passport.use(new LocalStrategy({
  usernameField: 'email',
}, async (email, password, done) => {
  if (!email || !password) {
    const missingFields = [];

    if (!email) { missingFields.push('email') }
    if (!password) { missingFields.push('password') }
    
    return done({
      error: 'Missing fields',
      missingFields,
    });
  }

  try {
    const userExistsQuery = `
      SELECT * FROM users 
      WHERE email = $1
      LIMIT 1;
    `;
    const userExistsResult = await dbQuery(userExistsQuery, [email]);

    if (userExistsResult.length === 0) {
      return done({
        error: 'User not found',
      })
    }

    const user = userExistsResult[0];
    const isValid = await comparePassword(password, user.hashed_password);
    
    if (isValid) {
      return done(null, user);
    } else {
      return done({
        error: 'Password is incorrect.'
      });
    }
  } catch (error) {
    return done({
      error: 'Cannot log in.',
      originalError: error,
    });
  }
}))

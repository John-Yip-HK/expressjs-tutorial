const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');

const { dbQuery } = require('../db');
const { comparePassword } = require('../utils');

passport.serializeUser((user, done) => {
  console.log('Serializing user...');
  done(null, user.id);
});

passport.deserializeUser(async (userId, done) => {
  console.log('Try to deserialize user...');
  console.log(userId);

  try {
    const userInDb = await dbQuery(`
      SELECT * FROM users 
      WHERE id = $1::integer
      LIMIT 1;
    `, [userId]);

    if (userInDb.length === 0) {
      throw new Error(JSON.stringify({
        error: 'No such user.'
      }));
    }

    const { email, username } = userInDb[0];

    done(null, { email, username });
  } catch (err) {
    console.log(err);
    done(JSON.parse(err.message));
  }
})

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

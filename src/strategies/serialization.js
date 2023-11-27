const passport = require('passport');

const { dbQuery } = require('../db');

passport.serializeUser((user, done) => {
  console.log('Serializing user...');

  if ('provider' in user) {
    const { id, provider } = user;
    return done(null, `${provider}-${id}`);
  }
  
  returndone(null, user.id);
});

passport.deserializeUser(async (userId, done) => {
  console.log('Try to deserialize user...');
  console.log('Deserialized user:', userId);

  const isGoogleUser = userId.includes('-');

  try {
    const userIdForQuery = isGoogleUser ? userId.split('-')[1] : userId;
    const userQuery = `
      SELECT * FROM users 
      WHERE ${isGoogleUser ? 'oauth2_user_id = $1' : 'id = $1::integer'}
      LIMIT 1;
    `;
    
    const userInDb = await dbQuery(userQuery, [userIdForQuery]);

    if (userInDb.length === 0) {
      throw new Error(JSON.stringify({
        error: 'No such user.'
      }));
    }

    const { email, username } = userInDb[0];

    done(null, { email, username });
  } catch (err) {
    console.log(err);
    done(err.message);
  }
})
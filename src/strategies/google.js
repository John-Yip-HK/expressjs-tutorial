const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');

const { dbQuery } = require('../db');

async function googleOAuth2Verify(accessToken, refreshToken, profile, done) {
  try {
    const {
      id: googleUserId,
      displayName,
      emails,
      provider,
    } = profile;

    const userExistsQuery = `
      SELECT * FROM users
      WHERE oauth2_user_id = $1
      LIMIT 1;
    `;

    const userExistsResult = await dbQuery(userExistsQuery, [googleUserId]);

    if (userExistsResult.length === 0) {
      const email = emails[0].value;
      const insertNewGoogleUserMutation = `
        INSERT INTO users (email, username, oauth2_provider, oauth2_user_id)
        VALUES ($1, $2, $3, $4);
      `;

      await dbQuery(
        insertNewGoogleUserMutation, 
        [email, displayName, provider, googleUserId]
      );
    }

    return done(null, profile);
  } catch (error) {
    return done(error);
  }
}

passport.use(new GoogleStrategy(
  {
    clientID: process.env['GOOGLE_CLIENT_ID'],
    clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
    callbackURL: '/api/v1/auth/google/redirect',
    scope: ['profile', 'email'],
    state: true,
  }, 
  googleOAuth2Verify
));

module.exports = { googleOAuth2Verify };

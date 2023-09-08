const passport = require('passport');
const { Strategy: DiscordStrategy } = require('passport-discord');
const DiscordUser = require('../database/schemas/DiscordUser');

/*
  If you have moltuple strategies, make sure `serializeUser` and `deserializeUser` are called once only.
*/

passport.serializeUser((user, done) => {
  console.log('Serializing user...');
  console.log(user);

  // ID of the document, used to be an identifier in the stored session.
  done(null, user.id);
});

/*
  The first argument of the callback will be the thing passed into `done` function of `serializeUser()`.
  Will be called for every request requiring authentication.
*/
passport.deserializeUser(async (id, done) => {
  console.log('Deserializing user...');
  console.log(id);

  try {
    const user = await DiscordUser.findById(id);

    if (!user) throw new Error('User not found');
    
    // The value of `user` is attached to the `req.user` property.
    done(null, user);
  } catch (err) {
    console.log(err);
    done(err, null);
  }
});

/*
  `accessToken`: make requests on behalf of the authenticated user. Sensitive info.
  `refreshToken`: refresh access token by calling an endpoint and then retrieving a new set of tokens.
*/
async function discordVerifyFunction(accessToken, refreshToken, profile, done) {
    const { id: discordId } = profile;
    
    try {
      const discordUser = await DiscordUser.findOne({ discordId, });
  
      if (discordUser) {
        return done(null, discordUser);
      } else {
        // If the user does not exist, add it into our DB.
        const newUser = await DiscordUser.create({
          discordId,
        });

        return done(null, newUser);
      }
    } catch (err) {
      console.log(err);
      done(err, null);
    }
  }

passport.use(
  new DiscordStrategy({
    clientID: '1148962966117568512',

    // Make sure this secret is stored somewhere securely, like environmental variable.
    clientSecret: '8QYUa7C9rfEleOwoYgKpk4z2Bo-toMxD',

    // The redirect URI set in our discord app.
    callbackURL: 'http://localhost:3001/api/v1/auth/discord/redirect',

    // Get user details. Can be found on "URL Generator" page of discord portal.
    scope: ['identify']
  },
  discordVerifyFunction
));

module.exports = { discordVerifyFunction };